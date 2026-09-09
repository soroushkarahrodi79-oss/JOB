# Proof-of-Work Experience

> **Canonical for:** the proof mechanisms the prototype uses, and which parts of each are functional
> versus simulated.
> **Not canonical for:** what Proof of Work *is* (see
> [../../domain/domain-model.md](../../domain/domain-model.md)), its state machine (see
> [../../domain/state-transitions.md](../../domain/state-transitions.md)), or the flow it sits in
> (see [../user-flows.md](../user-flows.md) F5).
> **Status:** Draft.

## The design constraint

Proof of Work is what makes the Passport evidential rather than declarative. It is also the feature
most likely to be experienced as surveillance — which the charter lists as one of four things that
would falsify the thesis.

The resolution is not a privacy setting. It is to capture only what the **work** requires, in a form
both parties can see, and to attach nothing the worker did not perform deliberately. Every mechanism
below is an action the worker takes, visible to the worker, at a moment the work already demands.

## The four mechanisms

### 1 — Arrival check-in

The employer's screen shows a short code for the engagement; the worker enters it on W-05 on
arrival. Produces an arrival attestation with a time.

| Component | Truth | Note |
| --- | --- | --- |
| Code generation, validation, single-use enforcement, event recording | `FUNCTIONAL` | Rejects wrong, expired and replayed codes. Correct for arbitrary input. |
| Device or location attestation of the arrival | `SIMULATED` | Row 10. The prototype does **not** read real device location. |

`HYPOTHESIS` · Whether location or device attestation is lawful, and on what consent basis, is Q4,
`UNKNOWN`. The prototype therefore demonstrates the *shape* of a stronger attestation without
collecting the data — and the screen says exactly that where the simulated strength is shown.

Chosen over a QR code because it works on the cheapest phone, over a poor camera, in a badly lit
storeroom. QR is a presentation option for GATE 1.5, not a requirement; the mechanism is a shared
single-use secret either way.

### 2 — Time confirmation

Start and end times are taken from `ClockPort` at the recorded events, not typed by either party.
`FUNCTIONAL`.

The worker sees the recorded times, and disagreement is expressed by contesting or amending, never
by editing. A time either party can edit is not evidence.

### 3 — Structured completion fields

At W-06 the worker answers a small set of completion fields the employer defined at E-02, plus a
free note. `FUNCTIONAL`.

Fields are constrained to what can be answered honestly in under a minute at the end of a shift, by
someone who wants to go home. A long checklist gets straight-lined, and a straight-lined checklist
is worse than no checklist because it looks like evidence.

### 4 — Employer decision

At E-07 the employer approves or contests. Under D18's authorised prototype-only value, employer
non-response leaves proof `Submitted`: it awaits an explicit employer action or case handling and
does not approve proof or authorise payment. There is no response window, countdown or timer.
`FUNCTIONAL` (rows 10, 13).

The distinction matters in both directions: a worker's record should not credit them with an
approval nobody gave, and an employer's record should show that they did not respond. Both appear in
[trust-profiles.md](trust-profiles.md).

## Not built, and why

| Candidate | Rejected because |
| --- | --- |
| **Photograph or file evidence** | Requires a storage port that does not exist ([ADR-0003](../../adr/0003-provider-ports-and-adapters.md): adding a port requires an ADR), a retention answer (Q7), a consent basis (Q4), and a moderation surface. It would be the most persuasive thing in the demo and the least defensible. Recorded as D17. |
| **Continuous location tracking** | Surveillance. Directly triggers the falsification condition in the charter, and Q4 is `UNKNOWN`. |
| **Biometric or device fingerprint** | Same, with a higher-sensitivity data class and no consent basis. |
| **Third-party verification of task quality** | Introduces an intermediary the personas document explicitly excludes. |
| **Automatic geofenced check-in** | Removes the worker's deliberate act, which is the thing that keeps this from being surveillance. |

The absence of photographs is a designed position, not a gap, and the demo should say so when asked
rather than treating it as unfinished work.

> **Prototype-provisional default — D17, `PENDING AUTHORISATION`.** Structured completion fields
> only; no evidence media. D17 stays OPEN, and this default was proposed by an agent rather than
> human-authorised — per [ADR-0010](../../adr/0010-prototype-provisional-defaults.md) safeguard 8 it
> must be authorised before any pilot. It selects an *absence*, so it cannot overclaim; the risk it
> carries is the opposite one, that structured proof turns out too weak for some real work type.
> Recorded in [../../open-decisions.md](../../open-decisions.md).

## Where proof is used

Once captured, the same events serve four purposes, which is the argument for capturing them at all:

1. **Completion** — proof resolution moves the engagement toward `Settled`.
2. **Payment** — release is authorised by proof resolution, never by elapsed time alone
   ([payment.md](payment.md)).
3. **Reputation** — arrival against schedule feeds the on-time metric.
4. **Dispute evidence** — assembled, never re-entered ([disputes.md](disputes.md)).

The amendment event belongs to the same family. It is not proof of work, but it is the record of
what the work *became*, and in Story C it is the decisive artifact.

## Demonstration requirements

The demo fails unless:

1. an invalid or reused check-in code is visibly **rejected** — a simulated adapter that only
   accepts the demo's happy path is `MOCK` and must be labelled `MOCK`;
2. the simulated portion of the arrival attestation is labelled where its strength is shown, not in
   a footer;
3. a submitted proof with no employer action remains visibly unresolved and offers no automatic
   approval or release;
4. no response-window duration, countdown or timer is rendered at W-06 or elsewhere;
5. no screen offers a photograph upload as a disabled control. Prefer absence over a dead
   affordance ([../../demo-truth-matrix.md](../../demo-truth-matrix.md), `PLANNED`).

## Prototype-to-pilot blockers

| # | Element | Blocked on |
| --- | --- | --- |
| 1 | Any real device or location attestation | Q4 `UNKNOWN`. Until answered, mutual confirmation is the ceiling. |
| 2 | Evidence media of any kind | Q4, Q7, and D17 — plus a new port, requiring an ADR. |
| 3 | Retention of arrival and completion events | Q7 `UNKNOWN`. These are the Passport's evidential basis, so retention rules and deletion rules interact directly ([../../architecture/data-model.md](../../architecture/data-model.md)). |
| 4 | Any pilot or production treatment of employer non-response | D18 remains OPEN. The authorised prototype value creates no automatic approval, release or time-based outcome. |
