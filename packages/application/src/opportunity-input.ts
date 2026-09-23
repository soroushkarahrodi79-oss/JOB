import type {
  AdministrativeLocation,
  EligibilityRequirement,
  Money,
  PayBasis,
  TravelBoundary,
} from '@platform/domain';
import { parseTomanInput } from './money-input';
import { areRequirementsBinaryEvaluable, requirementById } from './requirement-catalogue';
import { parseCivilDateKey, tehranInstant } from './shift-window';

// E-02's field set and its validation.
//
// The canonical set is screen-inventory.md E-02 and demo-scenarios.md beats B1–B3: "Need, time,
// place, pay and headcount, and nothing else mandatory." Nothing is added to it here. The
// employer's note is optional and is deliberately NOT a requirement — see `employerNote`.

// PayBasis is the domain's: it is a term of the opportunity and travels with the money, so the
// application does not get to hold a second definition of it (ADR-0006).
export type { PayBasis };
export type AcceptanceMode = 'InviteOnly' | 'OpenAcceptance';

/** The demo's neighbourhoods (D6: administrative hierarchy, coordinates deferred). */
export const DEMO_NEIGHBOURHOODS = [
  'Demo-Centre',
  'Demo-North',
  'Demo-East',
  'Demo-West',
  'Demo-South',
  'Demo-River',
] as const;

export type DemoNeighbourhood = (typeof DEMO_NEIGHBOURHOODS)[number];

/** Raw form values, exactly as the controls hold them. Strings, because a form holds strings. */
export interface OpportunityFormValues {
  readonly title: string;
  readonly shiftDateKey: string;
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly neighbourhood: string;
  readonly tomanAmount: string;
  readonly payBasis: PayBasis;
  readonly headcount: number;
  readonly requirementIds: readonly string[];
  readonly acceptanceMode: AcceptanceMode;
  /**
   * The employer's travel boundary in kilometres of the synthetic demo geography, or the empty
   * string for no boundary. Optional by design: an empty value is the employer declining to filter
   * on distance (matching.md stage 3), never a boundary of zero.
   */
  readonly travelBoundaryKm: string;
  /**
   * Anything the employer wants to say that is not an evaluable condition.
   *
   * It travels with the opportunity and is shown to workers, and it never reaches the requirement
   * list. demo-scenarios.md B2: "A requirement the employer cannot state concretely cannot be a
   * requirement." Letting free text become a gate would exclude people for a reason the domain
   * cannot evaluate and the worker cannot answer.
   */
  readonly employerNote: string;
  /** B3. False until the employer explicitly records the commitment. */
  readonly paymentCommitmentRecorded: boolean;
}

export type OpportunityFieldName =
  | 'title'
  | 'shiftDateKey'
  | 'endMinutes'
  | 'neighbourhood'
  | 'tomanAmount'
  | 'headcount'
  | 'requirementIds'
  | 'travelBoundaryKm'
  | 'paymentCommitmentRecorded';

export interface FieldError {
  readonly field: OpportunityFieldName;
  /** Persian, describing the correction rather than the violation (foundations.md, *Errors*). */
  readonly message: string;
}

export interface ValidatedOpportunityInput {
  readonly title: string;
  readonly amount: Money;
  readonly payBasis: PayBasis;
  readonly workStartsAt: string;
  readonly workEndsAt: string;
  readonly location: AdministrativeLocation;
  readonly headcount: number;
  readonly acceptanceMode: AcceptanceMode;
  readonly requirements: readonly EligibilityRequirement[];
  readonly employerNote: string;
  /** Present only when the employer recorded a boundary; absent means distance never filters. */
  readonly travelBoundary?: TravelBoundary;
}

export type OpportunityValidation =
  | { readonly ok: true; readonly input: ValidatedOpportunityInput }
  | { readonly ok: false; readonly errors: readonly FieldError[] };

const MAX_HEADCOUNT = 20;
const MAX_TRAVEL_KM = 100;

/**
 * Parses an optional travel-boundary distance. The empty string is a valid answer — it means "no
 * boundary" — and returns `{ ok: true, boundary: undefined }`. A non-empty value must be a whole
 * number of kilometres greater than zero (Persian or Latin digits); zero is rejected because a
 * boundary of zero would exclude everyone and is never what an employer means.
 */
function parseTravelBoundary(
  raw: string,
): { readonly ok: true; readonly boundary: TravelBoundary | undefined } | { readonly ok: false } {
  const trimmed = raw.trim();
  if (trimmed.length === 0) return { ok: true, boundary: undefined };
  const normalized = trimmed.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
  if (!/^\d+$/.test(normalized)) return { ok: false };
  const km = Number(normalized);
  if (km <= 0 || km > MAX_TRAVEL_KM) return { ok: false };
  return { ok: true, boundary: { maxKilometres: km } };
}

const MONEY_MESSAGES: Record<string, string> = {
  Empty: 'مبلغ پرداخت را به تومان وارد کنید.',
  NotANumber: 'مبلغ را فقط با رقم وارد کنید؛ ارقام فارسی و انگلیسی هر دو پذیرفته می‌شود.',
  NotAWholeNumber: 'مبلغ را به تومان کامل وارد کنید، بدون اعشار.',
  NotPositive: 'مبلغ باید بزرگ‌تر از صفر باشد.',
  TooLarge: 'این مبلغ از حد مجاز نمونهٔ اولیه بیشتر است. مبلغ کمتری وارد کنید.',
};

/**
 * Validates the whole form at once and returns every failure, because a submitted form that fails
 * moves focus to a summary naming every failed field (foundations.md). Returning the first error
 * would make that summary impossible.
 */
export function validateOpportunityForm(values: OpportunityFormValues): OpportunityValidation {
  const errors: FieldError[] = [];

  const title = values.title.trim();
  if (title.length === 0) {
    errors.push({ field: 'title', message: 'بنویسید چه کاری لازم دارید.' });
  }

  const date = parseCivilDateKey(values.shiftDateKey);
  if (date === null) {
    errors.push({
      field: 'shiftDateKey',
      message: 'یک تاریخ از فهرست روزهای پیشِ رو انتخاب کنید.',
    });
  }
  if (values.endMinutes <= values.startMinutes) {
    errors.push({
      field: 'endMinutes',
      message: 'ساعت پایان باید بعد از ساعت شروع باشد. یک ساعت پایان دیرتر انتخاب کنید.',
    });
  }

  const neighbourhood = DEMO_NEIGHBOURHOODS.find((known) => known === values.neighbourhood);
  if (neighbourhood === undefined) {
    errors.push({ field: 'neighbourhood', message: 'محل کار را از فهرست محله‌ها انتخاب کنید.' });
  }

  const money = parseTomanInput(values.tomanAmount);
  if (!money.ok) {
    errors.push({
      field: 'tomanAmount',
      message: MONEY_MESSAGES[money.failure] ?? MONEY_MESSAGES['NotANumber'] ?? '',
    });
  }

  if (!Number.isInteger(values.headcount) || values.headcount < 1) {
    errors.push({ field: 'headcount', message: 'دست‌کم یک جایگاه لازم است.' });
  } else if (values.headcount > MAX_HEADCOUNT) {
    errors.push({
      field: 'headcount',
      message: `در نمونهٔ اولیه حداکثر ${String(MAX_HEADCOUNT)} جایگاه پذیرفته می‌شود.`,
    });
  }

  const requirements = values.requirementIds
    .map((id) => requirementById(id))
    .filter((option): option is NonNullable<typeof option> => option !== undefined)
    .map(({ id, label }): EligibilityRequirement => ({ id, label }));

  if (requirements.length !== values.requirementIds.length) {
    errors.push({
      field: 'requirementIds',
      message:
        'فقط شرط‌هایی پذیرفته می‌شود که سامانه بتواند آن‌ها را بررسی کند. شرط‌ها را از فهرست انتخاب کنید.',
    });
  } else if (!areRequirementsBinaryEvaluable(requirements)) {
    errors.push({
      field: 'requirementIds',
      message: 'هر شرط باید قابل بررسی باشد. شرط‌ها را از فهرست انتخاب کنید.',
    });
  }

  if (!values.paymentCommitmentRecorded) {
    errors.push({
      field: 'paymentCommitmentRecorded',
      message: 'برای ادامه، تعهد پرداخت این مبلغ را ثبت کنید.',
    });
  }

  const travel = parseTravelBoundary(values.travelBoundaryKm);
  if (!travel.ok) {
    errors.push({
      field: 'travelBoundaryKm',
      message:
        'محدودهٔ مسافت را با یک عدد کیلومتر بزرگ‌تر از صفر وارد کنید، یا برای نبودِ محدودیت آن را خالی بگذارید.',
    });
  }

  if (
    errors.length > 0 ||
    date === null ||
    neighbourhood === undefined ||
    !money.ok ||
    !travel.ok
  ) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    input: {
      title,
      amount: money.money,
      payBasis: values.payBasis,
      workStartsAt: tehranInstant(date, values.startMinutes),
      workEndsAt: tehranInstant(date, values.endMinutes),
      location: { city: 'Tehran', neighbourhood },
      headcount: values.headcount,
      acceptanceMode: values.acceptanceMode,
      requirements,
      employerNote: values.employerNote.trim(),
      ...(travel.boundary === undefined ? {} : { travelBoundary: travel.boundary }),
    },
  };
}
