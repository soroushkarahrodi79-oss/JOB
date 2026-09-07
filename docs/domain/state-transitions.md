# State Transitions

> **Canonical for:** the lifecycle states of the prototype's entities, the events that cause
> transitions, and the guards on them.
> **Not canonical for:** what the entities are or what they mean (see
> [domain-model.md](domain-model.md)), the flows that traverse them (see
> [../product/user-flows.md](../product/user-flows.md)), or persistence (see
> [../architecture/data-model.md](../architecture/data-model.md)).
> **Status:** Draft. Conceptual only — no fields, no types, no schema.

Scope is the prototype. States that a production system would plausibly need but the demo does not
exercise are **not** defined here; adding them would encode guesses as structure. Where such a state
was considered and left out, it is recorded at the end.

## The rule that shapes everything below

`EngagementEvent` is the append-only record. Every state below is either **held** by an entity or
**derived** from that record. Nothing derived has a state machine of its own, because nothing
derived can be transitioned — it can only be recomputed. Domain invariant 1.

Corrections are compensating events. There is no transition that rewrites history.

---

## Opportunity

```
Draft ──publish──▶ Published ──all positions filled──▶ Filled ──work window ends──▶ Closed
  │                    │                                 │
  │                    ├──window passes unfilled──▶ Expired
  │                    │
  └──abandon──▶ (no record)      └──employer cancels──▶ Cancelled
                                        Filled ──employer cancels──▶ Cancelled
```

| Transition | Trigger | Guard |
| --- | --- | --- |
| `Draft → Published` | Employer publishes | Every requirement is a binary evaluable condition; a payment commitment is recorded; the classification signal has been computed and shown. The signal does **not** gate this transition — D3 default. |
| `Published → Filled` | Accepted engagements reach headcount | — |
| `Published → Expired` | Work window start passes with positions unfilled | Emits no penalty. Expiry is an outcome, not a failure. |
| `Published/Filled → Cancelled` | Employer cancels | Cancels every non-terminal Engagement on it, each with the employer-cancellation reason. Feeds the employer's cancellation behaviour metric. |
| `Filled → Closed` | Work window ends | Engagements proceed independently; closing the Opportunity does not close its Engagements. |

`Draft` is not persisted as an abandoned artifact in the prototype. A creation flow left incomplete
leaves no record.

---

## Engagement

Carries the offer and acceptance states. There is no separate Application or Offer entity —
[domain-model.md](domain-model.md) defines Engagement as the record of a specific worker on a
specific opportunity, and offer/acceptance are stages of that record, not a different thing.

```
                    ┌── invite ──▶ Offered ──accept──▶ Accepted ──┐
(no engagement) ────┤                 │                           ├──▶ InProgress ──▶ Completed ──▶ Settled
                    └── open accept ─────────────────▶ Accepted ──┘        │              │
                                      │                                    │              └──▶ Disputed
                                      ├──decline──▶ Declined               │
                                      └──no response──▶ Expired            └──▶ Cancelled
                                                     Accepted ──▶ Cancelled
```

| State | Meaning |
| --- | --- |
| `Offered` | An employer has invited a specific worker. Invite-only path (B8). |
| `Accepted` | The worker has confirmed the terms. Reached either by accepting an offer, or directly where the Opportunity permits open acceptance (A5). |
| `InProgress` | An arrival event has been recorded. |
| `Completed` | Completion proof has been submitted **and** resolved — approved, approved by non-response, or resolved through a case. |
| `Settled` | The payment intent has reached a terminal reported state and the engagement is closed. |
| `Declined` | The worker declined an offer. Not a reliability signal; declining is legitimate. |
| `Expired` | An offer was not answered within its window. Not a reliability signal. |
| `Cancelled` | Ended before completion, by either party, with a recorded reason and actor. |
| `Disputed` | A case is open against the engagement. Divergent, not terminal: the engagement returns to `Completed` and proceeds to `Settled` when the case closes. |

**Guards**

- `→ Accepted` requires that eligibility still evaluates true at the moment of acceptance. Eligibility
  is re-evaluated, not trusted from the earlier candidate list; requirements and availability can
  change between listing and acceptance.
- `→ Accepted` requires the worker's verification state to satisfy the acceptance threshold —
  D2's prototype-provisional default, labelled as a fallback.
- `→ InProgress` requires a valid arrival attestation for this engagement.
- `→ Settled` requires ProofOfWork in a terminal state and no open case.
- `Cancelled` records who cancelled and how far in advance. A no-show is a worker cancellation with
  a reason of non-arrival — **not** a distinct state. One state with a reason is enough for the
  prototype and keeps the reliability metric honest about what it counts.

---

## Proof of Work

One per Engagement, holding the attestations for that engagement (arrival, completion).

```
Awaited ──worker submits completion──▶ Submitted ──┬── employer approves ──▶ Approved
                                                   ├── window elapses ─────▶ ApprovedByNonResponse
                                                   └── employer contests ──▶ Contested ──case closes──▶ ResolvedByCase
   │
   └── engagement cancelled ──▶ NotRequired
```

| Transition | Trigger | Guard |
| --- | --- | --- |
| `Awaited → Submitted` | Worker submits completion evidence | Engagement is `InProgress`. Starts the employer response window. |
| `Submitted → Approved` | Employer approves | Affirmative act. Authorises payment release. |
| `Submitted → ApprovedByNonResponse` | Response window elapses | An explicit outcome with its own name, per F5 step 3. It authorises release **and is never rendered as an approval** — the distinction between "the employer approved" and "the employer did not respond" is exactly the kind of fact a reputation record must not blur. |
| `Submitted → Contested` | Employer contests with a stated reason | Opens a Dispute. Freezes release. |
| `Contested → ResolvedByCase` | Case closes | Payment consequence follows the recorded outcome, not the state name. |

> **Prototype-provisional default — `PENDING AUTHORISATION`.** D18 (the length of the response
> window, and whether non-response should authorise release at all) is open. The prototype uses a
> stated window with release on elapse, because the alternative — non-response withholding a
> worker's pay indefinitely — puts the cost of employer inattention on the party least able to carry
> it. D18 stays OPEN. This default was proposed by an agent and is **not yet human-authorised**; per
> [ADR-0010](../adr/0010-prototype-provisional-defaults.md) safeguard 8 it must be authorised before
> GATE 4. It is the most consequential provisional default in the repository, because it decides
> whether a worker is paid when an employer stays silent. Recorded in
> [../open-decisions.md](../open-decisions.md).

---

## Payment Intent

No state below means the Platform holds money. The Platform records commitments and reflects
reported outcomes; that is the whole of it. Charter non-goal, and truth-matrix row 12.

```
CommitmentRecorded ──▶ AuthorizationSimulated ──proof resolved──▶ ReleaseAuthorized
                                                                        │
                                                    ┌───────────────────┤
                                                    ▼                   ▼
                                            SettlementFailed      SettlementReported ──worker confirms──▶ ReceiptAcknowledged
                                                    │
                                                    └──retry──▶ ReleaseAuthorized
```

| State | Meaning |
| --- | --- |
| `CommitmentRecorded` | The employer has recorded a commitment to pay the agreed amount. A Platform ledger entry. No funds exist anywhere in the system. |
| `AuthorizationSimulated` | The simulated payment port reported an authorisation. `SIMULATED`, labelled wherever shown. |
| `ReleaseAuthorized` | Proof reached a terminal state permitting release; a release instruction was created. |
| `SettlementReported` | The simulated provider reported settlement. The Platform reports what it was told; it does not assert that money arrived. |
| `SettlementFailed` | The simulated provider reported failure. A first-class state, not an error screen. Scenario S5. |
| `ReceiptAcknowledged` | The worker confirmed receipt. The only state in this machine backed by a human observation rather than a provider report. |

**Guards**

- `→ ReleaseAuthorized` requires ProofOfWork terminal and no open case.
- `SettlementFailed → ReleaseAuthorized` is a retry and emits its own event. The failure is never
  overwritten; both attempts remain in the record.
- A case opening against a `ReleaseAuthorized` intent holds it. It does not reverse it — the
  prototype models no reversal, because reversing a settlement the Platform never performed would
  be fiction.
- Partial release exists only as an outcome of a recorded case resolution (OPS-03).

`ReceiptAcknowledged` is deliberately the last state and deliberately not required for `Settled`.
The Platform cannot know whether money arrived. Making the engagement's closure depend on a fact the
system cannot observe would be a false certainty.

---

## Dispute

```
Opened ──▶ UnderReview ──▶ OutcomeRecorded ──▶ Closed
   │            │
   └────────────┴── either party withdraws ──▶ Withdrawn
```

| Transition | Trigger | Guard |
| --- | --- | --- |
| `→ Opened` | Employer contests proof, worker disputes an outcome, or operations flags an engagement | One intake mechanism for all three. Requires a specific Engagement. |
| `Opened → UnderReview` | Operations takes the case | Both parties have had the opportunity to record an account; the case does not wait indefinitely for a silent party. |
| `UnderReview → OutcomeRecorded` | Operations records an attributed finding | Requires a stated basis referencing recorded events. The **finding** is a value carried by this transition, not a state: the permitted findings are enumerated once, in [../product/experience/disputes.md](../product/experience/disputes.md). |
| `OutcomeRecorded → Closed` | Payment consequence applied and outcome propagated | — |
| `→ Withdrawn` | The raising party withdraws | Recorded, not erased. |

There is **no** `Enforced` state and no appeal state. The Platform records outcomes and does not
adjudicate or enforce (F7). An appeal mechanism would imply an adjudicative authority the Platform
does not claim; whether one is needed is a real question and is recorded as a pilot blocker in
[../product/experience/disputes.md](../product/experience/disputes.md), not modelled here.

---

## Attestation

```
Declared ──────────────────────────────▶ (terminal; strength: self-declared)
Submitted ──▶ VerifiedSimulated ────────▶ (terminal; strength: provider-verified, SIMULATED)
          └─▶ VerificationFailed ───────▶ (terminal)
Confirmed by employer ─────────────────▶ (terminal; strength: employer-confirmed)
```

Attestations are immutable once recorded. A changed fact produces a **new** attestation; the old one
remains with its original time. Strength never collapses to a boolean — domain invariant 2.

---

## Preferred Crew relationship

```
(none) ──employer marks──▶ Marked ──employer removes──▶ Removed
```

Two states and nothing more. Repeat-engagement counts, recency and rehire rate are **derived
metrics** over the event record, not states. Modelling an "active" or "dormant" tier would create
state that has to be maintained and can drift from the events that justify it.

The relationship influences candidate ordering only. It can never introduce a candidate who fails
eligibility — domain invariant 4, and F8.

---

## Derived projections — no state machines

| Projection | Recomputed when | Never |
| --- | --- | --- |
| Worker Passport | Any attestation is recorded, or any engagement event lands | Authored, edited, or seeded as a value |
| Worker reliability metrics | An engagement reaches `Completed`, `Cancelled`, `Expired`, or a case closes | Adjusted by hand |
| Employer trust profile | The same triggers, plus payment state changes and amendment events | Adjusted by hand |
| Work Graph | An engagement reaches `Accepted` (edge created) and on each subsequent terminal transition (edge weighted) | Stored as an independent structure that can disagree with the events |

If a projection is materialised for performance it must be rebuildable from events, and the rebuild
must be tested ([../architecture/data-model.md](../architecture/data-model.md)).

---

## Considered and deliberately not modelled

| Candidate | Why not |
| --- | --- |
| Engagement `NoShow` | A cancellation reason carries the same information. A separate state invites treating it as a permanent label on a person. |
| Payment reversal / refund | The Platform performs no settlement, so it can reverse none. Modelling it would be fiction. |
| Dispute appeal | Implies an adjudicative authority the Platform explicitly does not claim (F7). Recorded as a pilot blocker instead. |
| Opportunity `Paused` | No demo need, and it duplicates unpublish-and-republish. |
| Worker account suspension | Trust-and-safety scope beyond dispute handling is `PLANNED` (row 19) and out of the prototype. |
| Engagement `Rescheduled` | An amendment event on a live engagement covers it, and keeps the change in the evidence record where a dispute can find it. |
