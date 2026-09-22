import type { TruthLevel } from '@platform/domain';

// The in-product Truth Ledger's data (SH-02), transcribed from the canonical capability matrix.
//
// CANONICAL SOURCE: docs/demo-truth-matrix.md. That document owns the truth taxonomy and every
// capability's Target and Actual level; this module is a rendering transcription of it, the same
// way vocabulary.ts transcribes state-vocabulary.md. It exists because truth-matrix row 22 ("In-
// product truth ledger") requires the matrix to be rendered inside the prototype and reachable
// from every truth label. `capability-ledger.test.ts` guards the shape (24 rows, contiguous ids,
// valid levels), and `capability-ledger.consistency.test.ts` asserts this data matches the
// Markdown row for row — capability, target, actual and note — so a status or content edit to the
// matrix that is not mirrored here fails CI (ADR-0006 single source of truth; ADR-0004 truth taxonomy).
//
// `id` is the matrix row number and is the stable anchor a truth chip deep-links to
// (`#truth-row-<id>`), so a reviewer who notices a SIMULATED label lands on the exact row.

export interface CapabilityLedgerRow {
  /** The matrix row number. Stable anchor target for truth-chip deep-links (`#truth-row-<id>`). */
  readonly id: number;
  /** The capability's canonical name, as the matrix names it. */
  readonly capability: string;
  /** The level intended at prototype delivery. */
  readonly target: TruthLevel;
  /** The current implementation state. A capability may never be shown above this level. */
  readonly actual: TruthLevel;
  /** The matrix Notes cell, transcribed faithfully. Empty where the matrix leaves it blank. */
  readonly note: string;
}

export const CAPABILITY_LEDGER: readonly CapabilityLedgerRow[] = [
  {
    id: 1,
    capability: 'Worker profile and skills',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'Domain-owned; no external dependency.',
  },
  {
    id: 2,
    capability: 'Worker Passport (aggregated verified record)',
    target: 'FUNCTIONAL',
    actual: 'PLANNED',
    note: 'Functional as an aggregate; the verification inputs it aggregates are not (rows 3, 4).',
  },
  {
    id: 3,
    capability: 'Worker identity verification',
    target: 'SIMULATED',
    actual: 'SIMULATED',
    note: 'Deterministic in-repo adapter only; real Iranian identity rails are out of scope. See legal/open-questions.md Q3.',
  },
  {
    id: 4,
    capability: 'Employer business verification',
    target: 'SIMULATED',
    actual: 'SIMULATED',
    note: 'Deterministic in-repo adapter only.',
  },
  {
    id: 5,
    capability: 'Opportunity creation and publication',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'Domain rules, and the employer surfaces that exercise them: E-02 creates the Opportunity in Draft with a recorded payment commitment, and E-03 publishes it through the lifecycle guards. Candidate listing and invitation are E-04 and are not built.',
  },
  {
    id: 6,
    capability: 'Eligibility-first matching',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'Deterministic rule evaluation over the domain model. No ML.',
  },
  {
    id: 7,
    capability: 'Availability-aware matching',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: '',
  },
  {
    id: 8,
    capability: 'Location-aware matching',
    target: 'SIMULATED',
    actual: 'SIMULATED',
    note: 'Distance computed in-repo over fixed demo geography; no maps provider.',
  },
  {
    id: 9,
    capability: 'Engagement classification',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'The mechanism is functional. Its legal correctness is unvalidated — see row 18.',
  },
  {
    id: 10,
    capability: 'Proof of Work capture',
    target: 'SIMULATED',
    actual: 'SIMULATED',
    note: 'Attestation logic is real; any device/location attestation is simulated.',
  },
  {
    id: 11,
    capability: 'Payment orchestration',
    target: 'SIMULATED',
    actual: 'SIMULATED',
    note: 'Ledger and state machine are real; settlement is simulated. No funds move.',
  },
  {
    id: 12,
    capability: 'Escrow-style assurance affordance',
    target: 'MOCK',
    actual: 'PLANNED',
    note: 'Deliberately MOCK, and deliberately never FUNCTIONAL. The Platform does not hold third-party funds — that is a charter non-goal, and holding them is a regulated activity (Q5). This row exists only so the demo can show the absence honestly. The employer half is built: E-02 commitment step states that the Platform records a commitment and holds no money, and links here. Actual stays PLANNED because product/experience/payment.md requires the statement on both sides and the worker half (W-02) is unbuilt. Whether an absence shown honestly is MOCK at all is raised for human review, not decided here.',
  },
  {
    id: 13,
    capability: 'Dispute handling',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'Case state machine only. Outcomes are recorded, not enforced.',
  },
  {
    id: 14,
    capability: 'Reputation — worker and employer',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'Event-derived projections cover both sides; no composite score.',
  },
  {
    id: 15,
    capability: 'Preferred Crew / rehire',
    target: 'FUNCTIONAL',
    actual: 'PLANNED',
    note: '',
  },
  {
    id: 16,
    capability: 'Messaging / SMS notification',
    target: 'MOCK',
    actual: 'MOCK',
    note: 'Deterministic mock adapter; no message leaves the system.',
  },
  {
    id: 17,
    capability: 'Authentication',
    target: 'SIMULATED',
    actual: 'SIMULATED',
    note: 'Deterministic simulated session outcome only; no credential/OTP channel exists.',
  },
  {
    id: 18,
    capability: 'Legal compliance posture',
    target: 'PLANNED',
    actual: 'PLANNED',
    note: 'The prototype demonstrates no validated compliance. See legal/legal-architecture.md.',
  },
  {
    id: 19,
    capability: 'Trust and safety controls',
    target: 'PLANNED',
    actual: 'PLANNED',
    note: "Beyond dispute casework, which is row 13. Account suspension, abuse reporting, fraud handling, moderation, and worker appeal against exclusion are all out of scope and unbuilt. The prototype's minimum scope is defined in product/experience/disputes.md on D7's recorded default; that definition scopes the gap, it does not close it.",
  },
  {
    id: 20,
    capability: 'Operations / admin tooling',
    target: 'FUNCTIONAL',
    actual: 'PLANNED',
    note: 'Scope limited to what the demo scenarios require.',
  },
  {
    id: 21,
    capability: 'Demo scaffolding — actor switch, demo reset',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'FUNCTIONAL covers the actor-selection mechanism (SH-01) and navigation into the one actor home that exists: choosing the employer opens E-01. W-01 and OPS-01 are not built and remain PLANNED, and SH-01 renders no link to either. Demo reset is not built. The demo session lasts for one browser tab, is not shared between tabs, devices or people, and reaches no server; the demo bar says so at the point of use. Real logic that exists only in the prototype; it declares itself a demo mechanism, not a product feature.',
  },
  {
    id: 22,
    capability: 'In-product truth ledger',
    target: 'FUNCTIONAL',
    actual: 'FUNCTIONAL',
    note: 'Renders this matrix inside the prototype and is reachable from every truth label. Required by the presentation rules in product/demo-scenarios.md. Built as SH-02; a per-row anchor exists for truth-chip deep-links.',
  },
  {
    id: 23,
    capability: 'Work Graph accumulation',
    target: 'FUNCTIONAL',
    actual: 'PLANNED',
    note: 'A projection over engagement events, Preferred Crew and reputation — not a stored structure and not a visualised feature. See domain/domain-model.md.',
  },
  {
    id: 24,
    capability: 'Structured engagement amendment',
    target: 'FUNCTIONAL',
    actual: 'PLANNED',
    note: 'A recorded, acknowledged change to agreed terms. Replaces free-form messaging, and is the decisive dispute evidence in Story C.',
  },
];

/** The canonical Persian gloss for a truth level, where the design system defines one.
 *  SIMULATED and MOCK are owned by color.md / TruthChip; FUNCTIONAL and PLANNED have no chip
 *  gloss (color.md: FUNCTIONAL is unmarked, PLANNED is never a control), so the ledger names them
 *  by their canonical taxonomy term. */
export const TRUTH_LEVEL_GLOSS: Readonly<Record<TruthLevel, string | null>> = {
  FUNCTIONAL: null,
  SIMULATED: 'شبیه‌سازی‌شده',
  MOCK: 'ساختگی',
  PLANNED: null,
};
