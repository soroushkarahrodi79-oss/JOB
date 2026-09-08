# Demo Scenarios

> **Canonical for:** the demo stories, the scenario register, and the demo-data policy.
> **Not canonical for:** the flows they traverse (see [user-flows.md](user-flows.md)), the screens
> they use (see [screen-inventory.md](screen-inventory.md)), the presentation sequence (see
> [investor-narrative.md](investor-narrative.md)), the dataset that backs them (see
> [demo-dataset.md](demo-dataset.md)), or the truth status of the capabilities they exercise (see
> [../demo-truth-matrix.md](../demo-truth-matrix.md)).
> **Status:** Draft.

## Purpose

Demo scenarios exist to make the thesis inspectable. Each scenario must exercise a real decision
that a reviewer could disagree with. A scenario that only walks a happy path proves nothing.

## One world, three stories

The prototype has **one** synthetic dataset. Stories A, B and C are three traversals of it, not
three demo worlds. They share the same café, the same workers, the same opportunities and the same
engagement history, and Story C's disputed engagement is created during Story B. Decision recorded
in [ADR-0009](../adr/0009-prototype-experience-architecture.md).

The cast used below is defined in [demo-dataset.md](demo-dataset.md). This document names entities;
it does not define them.

Every beat carries a stable ID (`A1`, `B4`, `C3`). [investor-narrative.md](investor-narrative.md)
and [screen-inventory.md](screen-inventory.md) reference these IDs rather than restating the beats.

---

## The featured transaction

All three stories run through **one opportunity**, `OPP-01` — a café shift with two positions,
filled by `WKR-01` and `WKR-02`. One of those two engagements completes; the other is disputed. A
second opportunity, `OPP-02`, is created near the end solely to show what the first one left behind.

This is tighter than three parallel examples, and it is the reason the dispute in Story C is
reviewable: every piece of its evidence was generated on screen.

---

## Story A — Worker

**Protagonist:** `WKR-01`, a worker with an almost empty Passport, in Tehran.
**Counterpart:** `EMP-01`, a café.
**Engagement:** `WKR-01` on `OPP-01`.

| ID | Beat | What must be true |
| --- | --- | --- |
| A1 | Receives the invitation to `OPP-01` | She was found by eligibility, not by reputation — she has none. This is the product's answer to how a newcomer is hired at all. |
| A2 | Opens the opportunity and reads the terms | Pay, hours, location, travel expectation and the eligibility requirements are all visible before any commitment. Nothing is disclosed after acceptance. The employer's own payment reliability is visible here too. |
| A3 | Sees her own eligibility, requirement by requirement | Each requirement is marked met or unmet with its basis. One requirement is met only by a self-declaration, and is shown as such. |
| A4 | Completes simulated identity verification | Asked for at the moment it unlocks acceptance, not at signup. Labelled `SIMULATED` at the point of use. |
| A5 | Accepts, confirming the terms | A deliberate, consequential action, and the terms confirmed are the terms shown at A2. |
| A6 | Arrives and checks in | Produces a recorded arrival event with a time. That event is later used three ways: as proof, as reliability input, and as dispute evidence. |
| A7 | Acknowledges the shift amendment | The change `EMP-01` records at B9. Structured and acknowledged, not a chat message. |
| A8 | Submits completion proof | Structured fields plus a note. No photograph — see [experience/proof-of-work.md](experience/proof-of-work.md). |
| A9 | Approved; simulated release **fails**, then succeeds on retry | The ledger shows the failure honestly and stays consistent. This is scenario S5 and it is not optional. |
| A10 | Sees her Passport after settlement | Specific, enumerable changes. Rates shown with sample size — "1 of 1", never "100%". |

**Deliberately uncomfortable:** A3 does not dress a self-declaration as verified. A9 fails in front
of the audience. A10 shows a Passport that is still thin.

---

## Story B — Employer

**Protagonist:** `EMP-01`, the café.
**Opportunities:** `OPP-01` (two positions, invite-only), then `OPP-02`.

| ID | Beat | What must be true |
| --- | --- | --- |
| B1 | Creates `OPP-01` in minutes | Persona P2 will not write a job specification. Need, time, place, pay and headcount, and nothing else mandatory. |
| B2 | States eligibility as concrete requirements | Binary conditions, not a wish list. A requirement the employer cannot state concretely cannot be a requirement. |
| B3 | Records the payment commitment | The Platform records a commitment. It does not hold funds, and the screen says so at the point of use. |
| B4 | Answers the engagement-factor questions | Most factors are derived from B1 and B2. Only the ones that cannot be derived are asked. |
| B5 | Sees the classification signal with its contributing factors | A hypothesis with its basis. It does not block publication, and it states no legal status. |
| B6 | Reviews candidates | Ordered, each with the reason it qualified and the reason for its position. `WKR-01` qualifies on eligibility alone, with no history. |
| B7 | Sees a plausible candidate **excluded**, with the reason | Scenario S1. The excluded worker is visibly capable and better reviewed than `WKR-01`; she lacks one stated requirement. |
| B8 | Invites `WKR-01` and `WKR-02` | Both accept. Two engagements on one opportunity — one becomes Story A, the other becomes Story C. |
| B9 | Records a mid-shift amendment | A structured change to scope and end time, acknowledged by both workers. It is also a direction-and-control factor input, and it decides Story C. |
| B10 | Approves `WKR-01`'s proof and marks her for rehire | Preferred Crew is created here — the only moment anyone can honestly answer "would you work with them again". |
| B11 | **Contests** `WKR-02`'s proof | Creates the case Story C reviews. Requires a stated reason, and freezes release without cancelling the commitment. |
| B12 | Creates `OPP-02`; `WKR-01` leads its candidate list on prior relationship | The record built in Story A is now useful to someone other than its owner. The Work Graph, shown as an effect on a decision. |
| B13 | Sees its own trust profile | Payment reliability, cancellation behaviour, amendment frequency, worker feedback, and the open dispute from B11. Trust is reciprocal or it is decoration. |

**Deliberately uncomfortable:** B7 excludes someone who looks like the better hire. B11 makes the
employer the party who escalates. B13 shows the employer a record it did not author and cannot edit.

---

## Story C — Trust and operations

**Subject:** the engagement contested at **B11** — `WKR-02` on `OPP-01`. Not a fresh example, and
not a fresh opportunity: the same shift the audience has just watched succeed for the other worker.

Six beats. Story C proves the platform has a credible unhappy-path model; it does not tour the
operations product.

| ID | Beat | What must be true |
| --- | --- | --- |
| C1 | The contest opens a case | One intake mechanism, whether the employer contests proof, the worker disputes an outcome, or operations flags an engagement. |
| C2 | Competing claims are recorded | `EMP-01` says the work was not completed as agreed. `WKR-02` says the scope changed mid-shift and the work ran over. Both accounts stand; neither is adjudicated. |
| C3 | Evidence is assembled from the existing record | Nothing re-entered: the terms as accepted, the arrival event, the B9 amendment and its acknowledgement, the completion submission and its timestamps. |
| C4 | Operations reviews both parties' records | `WKR-02`'s history and `EMP-01`'s trust profile, including `EMP-01`'s amendment frequency. The employer is examined, not only the worker. |
| C5 | Operations records an outcome | A finding about the record, never a verdict about the parties. Attributed. The Platform explicitly declines to enforce it. Scenario S4. |
| C6 | The consequence propagates | Partial release per the recorded outcome; a dispute event on both records. No punitive score, no badge, no suspension. |

**Deliberately uncomfortable:** the record supports *both* accounts in part, and the finding must be
able to say so rather than manufacturing a winner. The evidence that carries the case is the
employer's own amendment — recorded because the product refused to build a chat.

---


## Scenario register

The scenarios below are properties the stories must exhibit. They are not separate demos.

| # | Scenario | Demonstrates | Realised in |
| --- | --- | --- | --- |
| S1 | Café needs shift staff within 24 hours | F2, F3, F4 | B1–B8, A1–A5 |
| S2 | Worker with an empty Passport takes a first engagement | F1, F4, F5 | A1–A10 |
| S3 | Prior relationship outranks an unknown, after eligibility | F3, F8 | B10, B12 |
| S4 | Proof of Work is disputed | F5, F7 | B11, C1–C6 |
| S5 | Payment settlement fails | F6 | A9 |
| S6 | An engagement is flagged as employment-like | F2 | B4, B5, B9 |

S4, S5 and S6 are the scenarios that matter. A demo that omits them is a sales artifact, not a
prototype.

## Demo data policy

1. **Realistic, never real.** Iranian names, cities, business types, wages and working patterns
   must be plausible. They must not be traceable to any actual person or business.
2. **No real registry values.** No real national identification numbers, business registration
   numbers, phone numbers, or bank account numbers — not even syntactically valid ones for real
   registries. Demo identifiers use reserved or clearly invalid ranges.
3. **No real provider names.** No real bank, registry, carrier, or map provider is named anywhere
   in the demo, including in placeholder text.
4. **Currency is explicit.** Amounts state their unit. Rial and Toman are not used
   interchangeably; see [../architecture/data-model.md](../architecture/data-model.md).
5. **Dates are Jalali-correct.** Demo dates must be coherent in the Iranian calendar, including
   weekends. A Gregorian-shaped week will read as fake to the intended audience.
6. **Seed data is generated, versioned and reproducible.** It is not hand-edited into a database.
7. **Demo data is never mixed with any real data**, at any point, for any reason.

Rules 1, 2 and 6 have operational consequences — a real-entity screening step, identifiers that are
never stored at all, and a generator rather than a fixture file. Those consequences are specified
in [demo-dataset.md](demo-dataset.md).

## Presentation rules

- Every screen that exercises a non-`FUNCTIONAL` capability carries its truth label at the point
  of use.
- The truth matrix is reachable from within the prototype.
- No narration — spoken, written, or in a deck — may describe a simulated integration as live.
