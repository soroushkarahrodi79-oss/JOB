# Screen Inventory

> **Canonical for:** the prototype's screens, their stable IDs, purpose, decisions, transitions, and
> the record of screens deliberately rejected.
> **Not canonical for:** visual design or layout (see [../design/](../design/), and
> [../design/storyboard.md](../design/storyboard.md) for the per-view mapping), the stories the screens serve
> (see [demo-scenarios.md](demo-scenarios.md)), entity states (see
> [../domain/state-transitions.md](../domain/state-transitions.md)), or capability truth status
> (see [../demo-truth-matrix.md](../demo-truth-matrix.md)).
> **Status:** Draft.

**No styling is defined here.** This document defines what each screen is *for*. Colour, type,
spacing, iconography and component structure are GATE 1.5 work and are governed by
[../design/design-system.md](../design/design-system.md).

## The justification test

Every screen must answer: **what new user decision, system state transition, or investor
understanding does this screen create?** A screen that only re-displays what an adjacent screen
already displays is folded into that screen. Rule recorded in
[ADR-0009](../adr/0009-prototype-experience-architecture.md).

Twenty-four screens are retained. Twelve candidate screens were rejected; they are recorded at the
end of this document with the reason, because the rejections are as much a part of the definition
as the retentions.

## ID scheme

`SH-nn` shared / public · `W-nn` worker · `E-nn` employer · `OPS-nn` operations.
IDs are stable. A screen that is removed leaves its ID retired, never reused.

## Transition notation

**In** and **Out** list *forward* transitions, and the graph they describe is checked for symmetry:
if X lists Y as an outgoing transition, Y lists X as incoming.

Two things are implicit and are deliberately not listed, because listing them would fill every row
with noise and hide the transitions that carry meaning:

- **Returning** to the screen you arrived from.
- **Returning to a home screen** — SH-01, W-01, E-01, OPS-01. These are reachable from anywhere and
  appear in an **Out** row without a mirroring **In**.

## Path classification

Every screen is **Primary path** or **Supporting**.

- **Primary path** — a surface the Investor Golden Path stops on. Thirteen screens.
- **Supporting** — a retained prototype surface the primary demo does not stop on. Eleven screens.

Supporting is not second-class and is not a deletion queue. These screens are built, reachable, and
several are the best available answer to a predictable investor question. What they are not is a
scheduled stop, because a demo that visits all 24 surfaces has stopped arguing a thesis and started
touring a product.

This document owns *whether* a screen is on the path. [investor-narrative.md](investor-narrative.md)
owns *when, in what order, for how long, and why* — and lists what each supporting surface is the
answer to.

## Truth-state notation

Each screen lists the truth states present **on that screen**. Where any state other than
`FUNCTIONAL` appears, the label is rendered at the point of use, not in a footer. Statuses are
owned by [../demo-truth-matrix.md](../demo-truth-matrix.md); the row numbers referenced below are
that document's.

---

## Shared and public

### SH-01 — Demo Entry and Actor Switch

| | |
| --- | --- |
| **Primary actor** | Demo operator / investor |
| **Path** | Supporting |
| **Demo purpose** | Frame the demo as one world seen from three sides, and make the truth model visible before anything else. |
| **Principal decision** | Which story to enter, and as whom. |
| **System response** | Assumes the chosen actor's session; the underlying dataset does not change. |
| **In** | Application root |
| **Out** | W-01, E-01, OPS-01, SH-02 |
| **Domain concepts** | None. This is demo scaffolding. |
| **Truth states** | `FUNCTIONAL` (row 21), and it declares itself a demo affordance that does not exist in a real deployment. |

This screen exists because the alternative — three separate demo builds — would make the shared
Work Graph unverifiable. It must state plainly that actor switching is a demo mechanism, not a
product feature.

### SH-02 — Truth Ledger

| | |
| --- | --- |
| **Primary actor** | Investor / reviewer |
| **Path** | Primary path |
| **Demo purpose** | Satisfy charter success criterion 4: a reviewer identifies what is simulated *without being told*. |
| **Principal decision** | Whether to trust what was just seen. |
| **System response** | Renders the capability matrix and, for each row, the screens where that capability is exercised. |
| **In** | SH-01, and a persistent affordance from any truth label |
| **Out** | Back to the originating screen |
| **Domain concepts** | None |
| **Truth states** | `FUNCTIONAL` (row 22) |

Reachable from *any* truth label, so that a reviewer who notices a `SIMULATED` badge can go
straight from that badge to the full picture. That link is the mechanism; a menu entry is not.

### SH-03 — Notification Outbox

| | |
| --- | --- |
| **Primary actor** | Any actor |
| **Path** | Supporting |
| **Demo purpose** | Make the `MOCK` messaging boundary observable rather than invisible. Row 16 requires messages to land in an in-app outbox; this is that outbox. |
| **Principal decision** | Whether to act on a received invitation or notice. |
| **System response** | Displays messages that would have been sent, with recipient, channel and time. Nothing leaves the system. |
| **In** | Persistent affordance from W-01, E-01, OPS-01; invitations issued from E-04 and E-05 |
| **Out** | W-02 (invitation), W-09 / E-09 (case notice) |
| **Domain concepts** | Engagement, Dispute |
| **Truth states** | `MOCK` (row 16), labelled on the screen and on every message |

---

## Worker

### W-01 — Opportunity Feed and My Work

| | |
| --- | --- |
| **Primary actor** | Worker (P1) |
| **Path** | Supporting |
| **Demo purpose** | Opportunity discovery, and the first demonstration that matching is explained rather than ranked opaquely. |
| **Principal decision** | Which opportunity to examine. |
| **System response** | Returns eligible opportunities in explained order, plus the worker's active and past engagements. |
| **In** | SH-01, SH-03, W-04 (post-acceptance), W-08 |
| **Out** | W-02, W-05, W-08, SH-03 |
| **Domain concepts** | Opportunity, Engagement, EligibilityRequirement |
| **Truth states** | `FUNCTIONAL` (rows 5, 6, 7), `SIMULATED` location (row 8) |
| **Beats** | A1 |

Combines discovery and the worker's own work list. They are separated in most products; here they
are one screen because a worker on a phone between shifts is doing one thing — checking their
work — and P1's constraint is time, not navigation elegance.

Opportunities the worker is **not** eligible for are not silently absent. A count and a route to
the reason are shown, per D9's prototype-provisional default.

### W-02 — Opportunity Detail and Eligibility Explanation

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Primary path |
| **Demo purpose** | The transparency claim, in one screen: full terms and requirement-by-requirement eligibility before any commitment. |
| **Principal decision** | Whether to pursue this engagement. |
| **System response** | Renders terms, and the eligibility evaluation with the basis of each result. |
| **In** | W-01, SH-03 |
| **Out** | W-03 (if verification is required), W-04, back to W-01 |
| **Domain concepts** | Opportunity, EligibilityRequirement, Attestation, PaymentIntent (commitment state) |
| **Truth states** | `FUNCTIONAL` (rows 5, 6, 7), `SIMULATED` location (row 8), `MOCK` escrow-absence statement (row 12) |
| **Beats** | A2, A3 |

Carries the statement that the Platform does not hold funds. That statement belongs here — where
the worker is deciding whether to rely on the terms — and not only on the employer's side.

Absorbs the separately-proposed eligibility screen; splitting them would let a worker read terms
without reading eligibility, which is the exact split the product exists to close.

### W-03 — Verification Step

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Primary path |
| **Demo purpose** | Demonstrate "earned effort": verification is requested at the moment it unlocks something, and is honestly labelled. |
| **Principal decision** | Whether to verify now. |
| **System response** | Runs the simulated identity check and records an attestation with source, strength and time. Never stores the underlying identifier. |
| **In** | W-02, W-08 |
| **Out** | W-04 (on success), W-02 (on decline or failure) |
| **Domain concepts** | Attestation |
| **Truth states** | `SIMULATED` (rows 3, 17) |
| **Beats** | A4 |

> **Prototype-provisional default — D2.** Browsing and application are open; verification is
> required before acceptance. D2 stays OPEN; the provisional value and its revisit trigger are
> recorded in [open-decisions.md](../open-decisions.md). If D2 resolves the other way this screen
> moves or becomes optional, and nothing else in the inventory changes.

The screen must show what verification unlocks *before* asking, and must succeed and fail visibly —
a simulated adapter that only succeeds is `MOCK`.

### W-04 — Offer Acceptance and Terms Confirmation

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Supporting |
| **Demo purpose** | Make acceptance a deliberate act with a fixed record of what was agreed. |
| **Principal decision** | Accept or decline. |
| **System response** | Creates or advances the Engagement to `Accepted`, snapshots the agreed terms, and emits the acceptance event. |
| **In** | W-02, W-03 |
| **Out** | W-01, W-05 |
| **Domain concepts** | Engagement, Opportunity |
| **Truth states** | `FUNCTIONAL` |
| **Beats** | A5 |

Design principle 8 forbids styling a consequential action as a trivial one. The terms shown here
are the terms from W-02, unchanged; any later change is an amendment event with its own
acknowledgement, never a silent edit.

### W-05 — Engagement Detail and Check-in

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Primary path |
| **Demo purpose** | The live engagement, and the first Proof of Work capture. |
| **Principal decision** | When to check in; whether to acknowledge an amendment. |
| **System response** | Validates the check-in code and records an arrival event; records amendment acknowledgement. |
| **In** | W-01, W-04 |
| **Out** | W-06, W-07 |
| **Domain concepts** | Engagement, ProofOfWork, EngagementEvent |
| **Truth states** | `FUNCTIONAL` check-in logic, `SIMULATED` device or location attestation (row 10), `FUNCTIONAL` amendment (row 24) |
| **Beats** | A6, A7 |

Hosts check-in inline rather than as its own screen: check-in is one action producing one event, and
a dedicated screen would add a step to the moment a worker is least able to spend one — arriving at
a workplace.

### W-06 — Completion Proof Submission

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Primary path |
| **Demo purpose** | Show that proof is structured evidence, not a photograph and not a message. |
| **Principal decision** | What to submit as evidence of completion. |
| **System response** | Records the completion attestation and transitions ProofOfWork to `Submitted`. No response window, countdown or automatic outcome starts. |
| **In** | W-05 |
| **Out** | W-07 |
| **Domain concepts** | ProofOfWork, Engagement |
| **Truth states** | `FUNCTIONAL` submission, `SIMULATED` attestation strength (row 10) |
| **Beats** | A8 |

States before submission that employer non-response leaves proof unresolved, awaiting explicit
employer action or case handling. A worker should never learn that rule by experiencing it.

### W-07 — Payment and Receipt

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Primary path |
| **Demo purpose** | Expose the whole payment chain, including its failure, and the boundary where a real provider would attach. |
| **Principal decision** | Whether to acknowledge receipt; whether to dispute an outcome. |
| **System response** | Renders the payment state progression with its events; records receipt acknowledgement; opens a case if disputed. |
| **In** | W-05, W-06 |
| **Out** | W-08, W-09 |
| **Domain concepts** | PaymentIntent, Engagement, Dispute |
| **Truth states** | `SIMULATED` settlement (row 11), `MOCK` escrow-absence statement (row 12) |
| **Beats** | A9 |

Retained rather than folded into W-05 because it is the single place the payment port boundary is
made visible, and because scenario S5's failure must be shown to the party it affects — not only to
the employer who caused it.

### W-08 — Worker Passport

| | |
| --- | --- |
| **Primary actor** | Worker; also rendered to employers via E-05 and to operations via OPS-02 |
| **Path** | Primary path |
| **Demo purpose** | The thesis artifact. Shows a record whose every element is traceable to a source. |
| **Principal decision** | What to declare or verify next. |
| **System response** | Computes and renders the four Passport layers; provides entry points to author *attestations*. |
| **In** | W-01, W-07 |
| **Out** | W-03, W-01 |
| **Domain concepts** | WorkerPassport, Attestation, Reputation, Engagement, Work Graph |
| **Truth states** | `FUNCTIONAL` aggregation (rows 1, 2, 14, 23), `SIMULATED` verification inputs (row 3) |
| **Beats** | A10 |

Absorbs the worker profile screen. The Passport is the profile — but the screen must not blur the
domain distinction: it **renders a projection** and offers routes to author the underlying
attestations. Nothing on this screen writes the projection. That is domain invariant 1, made
visible.

The post-engagement state of this screen is a designed moment, not a variant: it enumerates what
changed and why, with sample sizes. Contents are specified in
[experience/trust-profiles.md](experience/trust-profiles.md).

### W-09 — Case Response

| | |
| --- | --- |
| **Primary actor** | Worker |
| **Path** | Supporting |
| **Demo purpose** | Give the worker a real voice in a dispute, so Story C is not an investigation *of* the worker. |
| **Principal decision** | What account to give, and which recorded events to point to. |
| **System response** | Records the counterclaim and the referenced evidence against the case. |
| **In** | SH-03, W-07 |
| **Out** | W-01 |
| **Domain concepts** | Dispute, Engagement, EngagementEvent |
| **Truth states** | `FUNCTIONAL` (row 13) |
| **Beats** | C2 — the worker half of the competing claims |

The worker selects from recorded events rather than writing free narrative alone. Evidence is
assembled, not re-entered (F7).

---

## Employer

### E-01 — Employer Home

| | |
| --- | --- |
| **Primary actor** | Employer (P2) |
| **Path** | Supporting |
| **Demo purpose** | Establish that the employer's default state is "what needs my attention", not a dashboard. |
| **Principal decision** | Create an opportunity, or act on something in progress. |
| **System response** | Lists open opportunities, live engagements, and items awaiting the employer — chiefly submitted proof decisions. |
| **In** | SH-01, SH-03 |
| **Out** | E-02, E-04, E-06, E-07, E-08, SH-03 |
| **Domain concepts** | Opportunity, Engagement, ProofOfWork |
| **Truth states** | `FUNCTIONAL` |
| **Beats** | entry to B1, B9, B10, B11, B12 |

Design principle 3 rules out dashboards as a default. This is a queue, not a dashboard: it shows
what is waiting on this employer without a response-window countdown.

### E-02 — Opportunity Creation

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Primary path |
| **Demo purpose** | Prove that eligibility-first does not mean slow. A café operator publishes in minutes. |
| **Principal decision** | What the need is, what is genuinely required, what the terms are, and whether eligible workers may accept directly. |
| **System response** | Validates that each requirement is a binary evaluable condition; records the payment commitment; creates the Opportunity in `Draft`. |
| **In** | E-01 |
| **Out** | E-03 |
| **Domain concepts** | Opportunity, EligibilityRequirement, PaymentIntent |
| **Truth states** | `FUNCTIONAL` (row 5), `SIMULATED` location resolution (row 8), `MOCK` escrow-absence statement (row 12) |
| **Beats** | B1, B2, B3 |

Absorbs the separately-proposed requirements builder and payment-commitment screens. Requirements
are step two of this screen because a requirement stated apart from the work it belongs to tends to
become a wish list — and the product's central rule is that a requirement excludes people.

The escrow-absence statement is placed at the commitment step: the moment the employer might
otherwise assume the Platform is holding the money.

> **Prototype-provisional default — D16, `AUTHORISED`.** Both acceptance modes exist and the
> employer chooses per opportunity; invite-only is pre-selected. This value is prototype-only and
> D16 remains OPEN; it establishes no production or pilot policy. Recorded in
> [open-decisions.md](../open-decisions.md).

### E-03 — Engagement Factors and Classification Signal

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Primary path |
| **Demo purpose** | Scenario S6. Demonstrate the classification mechanism and its epistemic honesty in the same screen. |
| **Principal decision** | How the work is actually organised — the factors that cannot be derived from E-02. |
| **System response** | Computes the classification signal, renders it with its contributing factors and their weights, and publishes the Opportunity. Does not block. |
| **In** | E-02 |
| **Out** | E-04 |
| **Domain concepts** | Engagement Classification, Opportunity |
| **Truth states** | `FUNCTIONAL` mechanism (row 9), `PLANNED` legal validity (row 18), and every classification statement carries `HYPOTHESIS` |
| **Beats** | B4, B5 |

> **Prototype-provisional default — D3.** This screen informs and does not block. D3 stays OPEN;
> the provisional value and its revisit trigger are recorded in
> [open-decisions.md](../open-decisions.md), and the reason blocking is unavailable under the
> mechanism is in [experience/classification.md](experience/classification.md).

The screen must never state or imply what the engagement legally *is*. Capture and display rules
are in [experience/classification.md](experience/classification.md); the factor model itself is
owned by [../domain/engagement-classification.md](../domain/engagement-classification.md).

### E-04 — Candidate List

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Primary path |
| **Demo purpose** | The core matching demonstration, including the exclusion that makes it credible (S1) and the prior-relationship effect that makes the Work Graph observable (S3). |
| **Principal decision** | Which candidates to examine and invite. |
| **System response** | Evaluates eligibility, then orders the eligible set, attaching a reason to every inclusion, every ordering position, and every exclusion. On invitation, creates the Engagement in `Offered` and emits a notification to SH-03. |
| **In** | E-03, E-01 |
| **Out** | E-05, SH-03 |
| **Domain concepts** | Worker, EligibilityRequirement, Reputation, Preferred Crew, Work Graph |
| **Truth states** | `FUNCTIONAL` (rows 6, 7, 14, 15, 23), `SIMULATED` distance (row 8) |
| **Beats** | B6, B7, B8 |

Excluded candidates are shown in a distinct, non-ranked group with the specific unmet requirement.
Presenting them as low-ranked candidates would contradict domain invariant 4, which is the
difference between this product and a job board.

No composite score appears anywhere on this screen. Ordering is explained by named factors in a
stated sequence — see [experience/matching.md](experience/matching.md).

Invitation is issued from this screen, because the evidence that justifies it is already on the row:
each candidate carries the requirement-by-requirement reason they qualified. E-05 is the deeper
read, not a gate — requiring it before every invitation would add a step for a time-poor employer
(persona P2) without adding information they have not already been shown.

### E-05 — Candidate Detail

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Supporting |
| **Demo purpose** | Show that the employer's screening artifact is the same evidenced Passport the worker owns, not a separate employer-facing rating. |
| **Principal decision** | Whether this candidate's full record changes the invitation decision. |
| **System response** | Renders the Passport as an employer sees it, plus the full match explanation. Invitation may also be issued here. |
| **In** | E-04 |
| **Out** | E-04, SH-03, E-01 |
| **Domain concepts** | WorkerPassport, Attestation, Engagement, Work Graph |
| **Truth states** | `FUNCTIONAL` (rows 2, 14), `SIMULATED` verification inputs (row 3) |
| **Beats** | Supports B8 — the deeper read before inviting |

The employer view must show the same provenance distinctions the worker sees. An employer-only
summary score would recreate the opaque signal the product exists to replace.

Off the Golden Path, and the strongest supporting surface: it is the direct answer to "what does an
employer actually see about a worker?", and the answer — the same record the worker owns, with the
same provenance markers — is one of the product's better ones.

### E-06 — Engagement Monitoring

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Supporting |
| **Demo purpose** | Show live work state, and demonstrate the amendment mechanism that replaces chat and later decides Story C. |
| **Principal decision** | Whether to record an amendment to scope or time. |
| **System response** | Renders arrival state per engagement; records the amendment as an event and notifies the worker for acknowledgement. |
| **In** | E-01 |
| **Out** | E-07 |
| **Domain concepts** | Engagement, EngagementEvent, ProofOfWork |
| **Truth states** | `FUNCTIONAL` (row 24), `SIMULATED` arrival attestation (row 10) |
| **Beats** | B9 |

The screen must state, at the point of recording, that an amendment is a recorded change to agreed
terms that the worker must acknowledge — and that it is visible in any later case. An employer who
does not understand that has been given a trap, not a tool.

### E-07 — Proof Review and Decision

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Primary path |
| **Demo purpose** | The employer's highest-consequence decision, and the entry point to Story C. |
| **Principal decision** | Approve the submitted proof, or contest it. |
| **System response** | On approval, transitions ProofOfWork to `Approved` and authorises release. On contest, opens a case and freezes release. With no employer action, proof remains `Submitted` and unresolved; it neither approves nor releases payment. |
| **In** | E-01, E-06 |
| **Out** | E-08, E-09, E-01 |
| **Domain concepts** | ProofOfWork, PaymentIntent, Dispute, Preferred Crew |
| **Truth states** | `FUNCTIONAL` (rows 10, 13), `SIMULATED` release (row 11) |
| **Beats** | B10, B11, and C1 — the contest opens the case |

Hosts the Preferred Crew marking, because "would you work with this person again" is answerable
exactly once — immediately after approving their work — and asking it anywhere else gets a guess.

The contest path must require a stated reason, and must show what contesting does: it opens a case,
it does not cancel the obligation, and the Platform will not decide it.

### E-08 — Employer Trust Profile

| | |
| --- | --- |
| **Primary actor** | Employer; also rendered to workers via W-02 and to operations via OPS-02 |
| **Path** | Supporting |
| **Demo purpose** | Make trust reciprocal in fact rather than in claim. The employer is measured on the record too. |
| **Principal decision** | Whether to change behaviour — settlement speed, cancellation, amendment frequency. |
| **System response** | Computes and renders the employer trust layers, including open disputes; runs the simulated business verification. |
| **In** | E-01, E-07 |
| **Out** | E-01 |
| **Domain concepts** | Employer, Reputation, Attestation, Preferred Crew, Work Graph |
| **Truth states** | `FUNCTIONAL` (rows 14, 15, 23), `SIMULATED` business verification (row 4) |
| **Beats** | B13 |

Absorbs the business verification screen: verification is a state on this profile plus one
simulated action, and a screen of its own would be a form with a single button.

Like W-08, it shows no composite score and no editable field that feeds a derived metric. Contents
in [experience/trust-profiles.md](experience/trust-profiles.md).

### E-09 — Case Response

| | |
| --- | --- |
| **Primary actor** | Employer |
| **Path** | Supporting |
| **Demo purpose** | The employer's side of Story C, symmetrical with W-09. |
| **Principal decision** | What account to give, and which recorded events to point to. |
| **System response** | Records the claim and referenced evidence against the case. |
| **In** | E-07, SH-03 |
| **Out** | E-01 |
| **Domain concepts** | Dispute, EngagementEvent |
| **Truth states** | `FUNCTIONAL` (row 13) |
| **Beats** | C2 — the employer half of the competing claims |

---

## Operations

### OPS-01 — Case Queue

| | |
| --- | --- |
| **Primary actor** | Operations (P3) |
| **Path** | Supporting |
| **Demo purpose** | Establish that operations work is bounded, evidence-driven casework — not a general admin console. |
| **Principal decision** | Which case to take. |
| **System response** | Lists open cases with age, type, parties and the engagement value at stake. |
| **In** | SH-01, OPS-03 |
| **Out** | OPS-02, SH-03 |
| **Domain concepts** | Dispute |
| **Truth states** | `FUNCTIONAL` (rows 13, 20) |
| **Beats** | entry to C3 |

### OPS-02 — Case Review

| | |
| --- | --- |
| **Primary actor** | Operations |
| **Path** | Primary path |
| **Demo purpose** | The heart of Story C: every claim is checked against a record neither party could edit. |
| **Principal decision** | Whether the record supports either account, and whether more is needed. |
| **System response** | Assembles the engagement's ordered event history, both parties' claims, both parties' records, and the terms as accepted. Assembles only; it computes no recommendation. |
| **In** | OPS-01 |
| **Out** | OPS-03 |
| **Domain concepts** | Dispute, Engagement, EngagementEvent, WorkerPassport, Reputation, Work Graph |
| **Truth states** | `FUNCTIONAL` (rows 13, 20, 23), `SIMULATED` attestation strengths inherited from row 10 |
| **Beats** | C2, C3, C4 |

Absorbs the separately-proposed audit view and party-profile screens. The event history *is* the
audit view, and the party records are rendered read-only in place — routing an operator to an
editable profile screen mid-case is how records get quietly corrected.

Deliberately produces **no** suggested outcome. A recommendation engine here would be an
unexplainable judgment about people, which is the thing the product refuses to build.

Personal-data minimisation applies most sharply on this screen (persona P3): it shows the events
and outcomes needed for the case, and never underlying verification evidence, which is not stored
([../architecture/data-model.md](../architecture/data-model.md)).

### OPS-03 — Resolution Recording

| | |
| --- | --- |
| **Primary actor** | Operations |
| **Path** | Primary path |
| **Demo purpose** | Scenario S4's closing move: the Platform records an outcome and explicitly declines to enforce it. |
| **Principal decision** | Which finding the record supports, and what follows for the payment state. |
| **System response** | Records an attributed outcome with its reasoning; releases, partially releases or holds the payment per the recorded terms; propagates the dispute outcome to both records. |
| **In** | OPS-02 |
| **Out** | OPS-01 |
| **Domain concepts** | Dispute, PaymentIntent, Reputation |
| **Truth states** | `FUNCTIONAL` (row 13), `SIMULATED` release (row 11) |
| **Beats** | C5, C6 |

Separate from OPS-02 on purpose. Persona P3's constraint is that every consequential action is
attributed and recorded; putting the decision on the same surface as the evidence invites deciding
while scrolling. The screen states, in the operator's own view, that the outcome is a finding about
the record and is not enforced by the Platform.

Available findings are enumerated in [experience/disputes.md](experience/disputes.md). None of them
is a verdict about a person.

---

## Rejected screens

Recorded because the rejections are part of the definition. Each was a plausible screen.

| Candidate | Rejected because | Where its purpose went |
| --- | --- | --- |
| Sign-in / OTP entry | Proves no thesis element and consumes narrative time. Authentication is `SIMULATED` (row 17) and its status is visible in SH-02. | SH-01 actor switch |
| Worker registration / onboarding wizard | The demo's worker already exists; a wizard would demonstrate form-filling, not the product. Incremental onboarding is shown by W-03 arriving late instead. | W-03, W-08 |
| Standalone eligibility explanation | Would allow reading terms without reading eligibility — the exact split the product closes. | W-02 |
| Worker profile editor | The Passport is the profile view; a second surface would invite editing derived state. | W-08 |
| "What changed in your Passport" screen | A post-engagement state of one screen, not a second screen. | W-08 |
| Standalone payment commitment | A step in creating an opportunity, not a destination. | E-02 |
| Standalone requirements builder | A requirement authored apart from its work becomes a wish list. | E-02 |
| Standalone invite screen | Would permit inviting without reading the evidence that justifies it. | E-05 |
| Preferred Crew roster | Demonstrating the *effect* on a later candidate list is stronger evidence than a list page, and the marking action has a natural home. | E-04 effect, E-07 action |
| Employer business verification screen | A form with one button. | E-08 |
| Work Graph visualisation | Visually striking; advances no decision; would present a derived projection as a claimed product feature. | W-08, E-04, E-08, OPS-02 |
| Operations audit / system-health console | The case event history is the audit view. Anything broader is speculative personal-data surface. | OPS-02 |

## Coverage check

Every retained screen is reachable, and every screen has at least one outgoing transition to a
screen that is not itself. Entry points: SH-01 reaches W-01, E-01 and OPS-01; every other screen is
reachable from one of those three. No screen is reachable only from a screen that no story visits.

Beat coverage: A1–A10, B1–B12 and C1–C7 each map to at least one screen above. C7 has no screen of
its own — it is the propagation visible on W-08 and E-08 after OPS-03, which is a state change, not
a destination.
