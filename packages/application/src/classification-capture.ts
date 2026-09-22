import {
  CLASSIFICATION_FACTORS,
  type ClassificationFactor,
  type ClassificationFactorKind,
  type ClassificationFactorValue,
  type OpportunityTerms,
} from '@platform/domain';

// Where the classification factors come from.
//
// `HYPOTHESIS` · Nothing in this file is a legal analysis. It records how an engagement is
// organised, using the factor set owned by docs/domain/engagement-classification.md. It states no
// legal conclusion and none of its output may be read as one (ADR-0007).
//
// docs/product/experience/classification.md sets the collection rule: most factors are DERIVED
// from what the employer already said while describing real work, because "an answer the employer
// gave while describing real work is more reliable than one given to a compliance form"; only the
// factors nothing in E-02 implies are ASKED, in plain language, each with a "not decided yet"
// answer; and the set is capped, with what falls outside it recorded as uncaptured rather than
// guessed.
//
// Every derived factor records WHICH FIELD it came from, so the derivation is auditable and a
// later change to it does not silently rewrite history.

/** A factor derived from an E-02 field, with the field named. */
interface DerivedFactorSpec {
  readonly kind: ClassificationFactorKind;
  /** The E-02 field the value was read from. Shown to the employer, so it is the field's name. */
  readonly fieldLabel: string;
  readonly value: (terms: OpportunityTerms) => ClassificationFactorValue;
  /** Why this reading follows from that field. Rendered beside the factor. */
  readonly reading: (terms: OpportunityTerms) => string;
}

const DERIVED: readonly DerivedFactorSpec[] = [
  {
    kind: 'ScheduleControl',
    fieldLabel: 'زمان شیفت',
    value: () => 'EmploymentLike',
    reading: () => 'ساعت شروع و پایان کار را شما تعیین کرده‌اید، نه فردی که کار را انجام می‌دهد.',
  },
  {
    kind: 'DurationAndRepetition',
    fieldLabel: 'زمان شیفت',
    value: () => 'IndependentLike',
    reading: () => 'این یک شیفت مشخص و یک‌باره است، نه یک الگوی تکرارشونده با یک کارفرما.',
  },
  {
    kind: 'EconomicStructure',
    fieldLabel: 'مبلغ و مبنای پرداخت',
    value: (terms) => (terms.payBasis === 'PerHour' ? 'EmploymentLike' : 'IndependentLike'),
    reading: (terms) =>
      terms.payBasis === 'PerHour'
        ? 'پرداخت بر مبنای ساعت است، یعنی بر مبنای زمانِ در اختیار گذاشته‌شده.'
        : 'پرداخت مبلغی مقطوع برای یک کار مشخص است، نه بر مبنای ساعت.',
  },
];

/** A factor E-03 asks about, in the employer's own vocabulary and with no legal terminology. */
export interface FactorQuestion {
  readonly kind: ClassificationFactorKind;
  readonly question: string;
  /** Exactly three answers, and the third is never a hidden "no". */
  readonly answers: readonly {
    readonly key: 'employmentLike' | 'independentLike' | 'undecided';
    readonly label: string;
    readonly value: ClassificationFactorValue;
  }[];
}

export type FactorAnswerKey = FactorQuestion['answers'][number]['key'];

export const FACTOR_QUESTIONS: readonly FactorQuestion[] = [
  {
    kind: 'DirectionAndControl',
    question: 'روش انجام کار را در طول شیفت چه کسی تعیین می‌کند؟',
    answers: [
      {
        key: 'employmentLike',
        label: 'ما تعیین می‌کنیم و بر کار نظارت داریم',
        value: 'EmploymentLike',
      },
      {
        key: 'independentLike',
        label: 'خود فرد تصمیم می‌گیرد چطور کار را انجام دهد',
        value: 'IndependentLike',
      },
      { key: 'undecided', label: 'هنوز مشخص نیست', value: 'Uncaptured' },
    ],
  },
  {
    kind: 'ToolsAndMaterials',
    question: 'ابزار و مواد لازم برای کار را چه کسی فراهم می‌کند؟',
    answers: [
      { key: 'employmentLike', label: 'ما فراهم می‌کنیم', value: 'EmploymentLike' },
      { key: 'independentLike', label: 'خود فرد می‌آورد', value: 'IndependentLike' },
      { key: 'undecided', label: 'هنوز مشخص نیست', value: 'Uncaptured' },
    ],
  },
  {
    kind: 'Integration',
    question: 'این کار یک وظیفهٔ مشخص و محدود است، یا بخشی از کار جاری مجموعه؟',
    answers: [
      { key: 'employmentLike', label: 'بخشی از کار جاری مجموعه است', value: 'EmploymentLike' },
      { key: 'independentLike', label: 'یک وظیفهٔ مشخص و محدود است', value: 'IndependentLike' },
      { key: 'undecided', label: 'هنوز مشخص نیست', value: 'Uncaptured' },
    ],
  },
];

const DERIVED_KINDS = new Set<ClassificationFactorKind>(DERIVED.map((spec) => spec.kind));
const ASKED_KINDS = new Set<ClassificationFactorKind>(
  FACTOR_QUESTIONS.map((question) => question.kind),
);

/**
 * The factors the prototype neither derives nor asks about.
 *
 * `Exclusivity` is here on purpose and must stay here. experience/classification.md's
 * demonstration requirement 3 is that at least one factor is visibly uncaptured and named as such,
 * and it names it "the uncomfortable one [that] must not be removed for looking incomplete". A
 * classification panel with no gaps would be the overclaim the whole mechanism exists to avoid.
 */
export const NEVER_CAPTURED_FACTORS: readonly ClassificationFactorKind[] =
  CLASSIFICATION_FACTORS.filter((kind) => !DERIVED_KINDS.has(kind) && !ASKED_KINDS.has(kind));

/** A derived factor, with the field it was read from, for rendering beside the factor. */
export interface DerivedFactorReading {
  readonly kind: ClassificationFactorKind;
  readonly fieldLabel: string;
  readonly reading: string;
}

export function derivedFactorReadings(terms: OpportunityTerms): readonly DerivedFactorReading[] {
  return DERIVED.map((spec) => ({
    kind: spec.kind,
    fieldLabel: spec.fieldLabel,
    reading: spec.reading(terms),
  }));
}

/** The factors readable from E-02 alone. Available before the employer answers anything. */
export function deriveFactorsFromTerms(
  terms: OpportunityTerms,
  recordedAt: string,
): readonly ClassificationFactor[] {
  return DERIVED.map((spec) => ({
    kind: spec.kind,
    value: spec.value(terms),
    source: 'Derived' as const,
    sourceReference: spec.fieldLabel,
    recordedAt,
  }));
}

export type FactorAnswers = Readonly<Partial<Record<ClassificationFactorKind, FactorAnswerKey>>>;

/**
 * Every factor in the set, recorded with its true source.
 *
 * Five cases, and keeping them apart is the whole point of the function:
 *
 *   Derived           — read from an E-02 field, which is named.
 *   EmployerAnswered  — the employer chose one of the two substantive answers at E-03. This is
 *                       also where an answer that reads as "no" lands: the questions have no
 *                       yes/no form, so a negative is a substantive value and never a gap.
 *   EmployerAnswered  — with value `Uncaptured`, when the employer chose «هنوز مشخص نیست». They
 *                       told us they have not decided, which is a statement BY them.
 *   AskedNotAnswered  — the question was put and no answer came back. Nobody stated anything.
 *   NotAsked          — outside the prototype's question set. Nobody was asked at all.
 *
 * The last three all carry `value: 'Uncaptured'` and must never be stored or rendered identically
 * (experience/classification.md, *Storage*). They are three different facts about the record, and
 * a later legal analysis that merged them could not tell them apart afterwards.
 */
export function captureClassificationFactors(input: {
  readonly terms: OpportunityTerms;
  readonly answers: FactorAnswers;
  readonly recordedAt: string;
}): readonly ClassificationFactor[] {
  const { terms, answers, recordedAt } = input;
  const derived = deriveFactorsFromTerms(terms, recordedAt);

  const asked = FACTOR_QUESTIONS.map((question): ClassificationFactor => {
    const chosen = answers[question.kind];
    const answer = question.answers.find((option) => option.key === chosen);
    if (answer === undefined) {
      // Asked, nothing back. NOT the same as the employer saying they have not decided — that is
      // a statement by them and carries their attribution; this carries none.
      return {
        kind: question.kind,
        value: 'Uncaptured',
        source: 'AskedNotAnswered',
        sourceReference: `E-03: ${question.question}`,
        recordedAt,
      };
    }
    return {
      kind: question.kind,
      value: answer.value,
      source: 'EmployerAnswered',
      sourceReference: `E-03: ${question.question}`,
      recordedAt,
    };
  });

  const neverAsked = NEVER_CAPTURED_FACTORS.map(
    (kind): ClassificationFactor => ({
      kind,
      value: 'Uncaptured',
      source: 'NotAsked',
      sourceReference: 'خارج از مجموعه‌پرسش‌های نمونهٔ اولیه',
      recordedAt,
    }),
  );

  // Canonical order, so the panel reads the same way every time and a diff is legible.
  const byKind = new Map(
    [...derived, ...asked, ...neverAsked].map((factor) => [factor.kind, factor]),
  );
  return CLASSIFICATION_FACTORS.map((kind) => {
    const factor = byKind.get(kind);
    if (factor === undefined) {
      throw new Error(`Classification factor ${kind} was not captured. Every factor is recorded.`);
    }
    return factor;
  });
}
