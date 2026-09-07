# Dispute Experience

> **Canonical for:** the prototype's dispute scenario, the available findings, and the trust-and-safety
> scope of the prototype.
> **Not canonical for:** the case state machine (see
> [../../domain/state-transitions.md](../../domain/state-transitions.md)), the flow (see
> [../user-flows.md](../user-flows.md) F7), or the screens (see
> [../screen-inventory.md](../screen-inventory.md)).
> **Status:** Draft.

## The scenario

Story C reviews the engagement contested at beat **B11**: `WKR-02` on `OPP-01` — the *same shift*,
under the same terms and the same amendment, as the engagement the audience has just watched
complete successfully for `WKR-01`.

That shared origin is what makes the case reviewable rather than anecdotal. The two engagements
differ in outcome and in almost nothing else, so the difference has to be found in the record. It
also means an investor who has just watched this employer behave well now watches the record
complicate that impression.

**Claim (employer, recorded at E-07, expanded at E-09).** The work was not completed as agreed.
The employer contested the completion proof rather than approving it.

**Counterclaim (worker, W-09).** The scope changed mid-shift and the work ran past the agreed end
time. The worker submitted proof against what was actually asked.

## The evidence

Assembled from the existing record. Nothing is re-entered (F7).

| Evidence | Origin | What it shows |
| --- | --- | --- |
| Terms as accepted | W-04 snapshot | What was agreed, before anything changed |
| Arrival attestation | Check-in, W-05 | The worker was present, from when |
| **Amendment record** | B9, employer-recorded, acknowledged by both workers | The employer did change the scope, at a recorded time, and the worker acknowledged it |
| Completion submission | W-06 | Structured fields, free note, submission time |
| Recorded times | `ClockPort` at each event | The shift ran past the scheduled end |
| Both parties' records | W-08, E-08 | Including `EMP-01`'s amendment frequency across engagements |

The amendment is the decisive artifact, and it exists because the product refused to build a chat.
In a messaging product the same exchange would be an unstructured conversation to be interpreted;
here it is a timestamped, acknowledged change to agreed terms. This is the strongest argument in the
prototype for the narrow-mechanism approach recorded in
[ADR-0009](../../adr/0009-prototype-experience-architecture.md), and the demo should make the point
explicitly.

## The findings available

At OPS-03. Every finding is a statement about **the record**, never a verdict about a person.

| Finding | Meaning | Payment consequence |
| --- | --- | --- |
| `RecordSupportsWorkerAccount` | The recorded events are consistent with the worker's account and not with the employer's | Release proceeds |
| `RecordSupportsEmployerAccount` | The reverse | Release held; the commitment and the reason remain recorded |
| `RecordInconclusive` | The record does not distinguish between the accounts | Release proceeds on the terms as amended. Silence in the record is not evidence against the party who performed the work. |
| `ResolvedByAgreement` | The parties agreed an outcome; operations recorded it | As agreed, including partial release |

**The expected outcome in the demo is `ResolvedByAgreement` with partial release**, reached because
the amendment record makes both accounts partly true: the employer did not get what was originally
agreed, and the worker did do what was subsequently asked.

`RecordInconclusive` must remain visibly available even though the demo does not land on it. An
operations tool that cannot say "I do not know" will manufacture certainty, and the demo should make
clear that the option exists.

Deliberately absent: any finding phrased as fault, bad faith, or dishonesty. The Platform does not
adjudicate (F7) and has no basis for a statement about a person's intent.

## Reputation consequences

| Party | Recorded | Not recorded |
| --- | --- | --- |
| `WKR-02` | One dispute on the engagement, with the finding and the date | No penalty, no score adjustment, no flag on the profile, no effect on eligibility |
| `EMP-01` | One dispute on the engagement, with the finding and the date; the amendment already sits in the observed history | Same absences |

A dispute appears in **layer 3, observed history** ([trust-profiles.md](trust-profiles.md)) as an
event with an outcome. It is not a derived metric and it does not silently move any metric. A
disputed engagement still counts as completed if it was completed.

This is a deliberate and arguable choice. The case against it: employers will want disputes to carry
weight, and a record where a dispute costs nothing may be ignored. The case for it, which prevails
here: the Platform records outcomes it did not adjudicate, and converting an unadjudicated outcome
into a penalty would be enforcement by arithmetic — precisely what F7 forbids. If this proves wrong,
it changes a derived metric's inputs, not the record.

`HYPOTHESIS` · Whether recording a dispute outcome against a real person creates liability, or
requires a right of correction or response, is Q12, `UNKNOWN`.

## Trust-and-safety scope for the prototype

> **Prototype-provisional default — D7.** Trust-and-safety scope is dispute casework only, defined
> below. D7 stays OPEN; the provisional value, its revisit trigger and its pilot-transfer status —
> including the absence of a worker appeal route — are recorded in
> [../../open-decisions.md](../../open-decisions.md).

**In scope, and nothing more:**

1. Case intake from three sources — employer contests proof, worker disputes an outcome, operations
   flags an engagement — through one mechanism.
2. Evidence assembly from the existing record.
3. Attributed operations review and recorded outcome.
4. Payment consequence following the recorded outcome.

**Out of scope, and remaining `PLANNED`** (truth-matrix row 19): account suspension or ban, abuse
and harassment reporting, identity-fraud handling, content moderation, worker appeal against
eligibility exclusion, employer offboarding, safety incident reporting, and any automated risk
detection.

The scoping rule is that the prototype demonstrates the *mechanism* by which trust is adjudicated
without adjudication — casework over an evidential record. Everything above is a separate product
surface with its own personal-data exposure and its own legal questions. Building any of it now
would be the speculative surface [ADR-0009](../../adr/0009-prototype-experience-architecture.md)
decision 4 rules out.

The absence of a **worker appeal against exclusion** is the sharpest gap and is not a comfortable
one. It is recorded as D7's known omission and appears below as a pilot blocker.

## Demonstration requirements

The demo fails unless:

1. the disputed engagement is one the audience watched being created;
2. no evidence is typed in during the review — every item is drawn from the record;
3. the employer's own record is examined alongside the worker's;
4. the operator can reach `RecordInconclusive` and it is visibly a real option;
5. OPS-03 states that the Platform records the outcome and does not enforce it;
6. after resolution, neither party has acquired a badge, a flag, or a score change.

## Prototype-to-pilot blockers

| # | Element | Blocked on |
| --- | --- | --- |
| 1 | Recording a dispute outcome against a real person | Q12 `UNKNOWN` — liability and right of correction. |
| 2 | Operating without a worker appeal mechanism | D7, and Q9 (non-discrimination constraints on automated exclusion). A real pilot that can exclude a worker with no route of appeal is not defensible. |
| 3 | Any payment consequence applied to real funds | Q5, and [payment.md](payment.md) blockers. |
| 4 | Operations access to real personal data | Q3, Q7, Q8. Persona P3's surface is where minimisation is tested hardest. |
| 5 | Presenting a finding as a determination | ADR-0007. The findings above are wordings, and wordings drift under commercial pressure. |
