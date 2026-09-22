import type { AdministrativeLocation, EligibilityRequirement, Money } from '@platform/domain';
import { parseTomanInput } from './money-input';
import { areRequirementsBinaryEvaluable, requirementById } from './requirement-catalogue';
import { parseCivilDateKey, tehranInstant } from './shift-window';

// E-02's field set and its validation.
//
// The canonical set is screen-inventory.md E-02 and demo-scenarios.md beats B1–B3: "Need, time,
// place, pay and headcount, and nothing else mandatory." Nothing is added to it here. The
// employer's note is optional and is deliberately NOT a requirement — see `employerNote`.

export type PayBasis = 'PerShift' | 'PerHour';
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
}

export type OpportunityValidation =
  | { readonly ok: true; readonly input: ValidatedOpportunityInput }
  | { readonly ok: false; readonly errors: readonly FieldError[] };

const MAX_HEADCOUNT = 20;

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

  if (errors.length > 0 || date === null || neighbourhood === undefined || !money.ok) {
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
    },
  };
}
