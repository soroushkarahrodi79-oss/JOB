# Payment Experience

> **Canonical for:** the simulated payment experience, what each state means to each party, and
> where the future provider boundary sits.
> **Not canonical for:** the payment state machine (see
> [../../domain/state-transitions.md](../../domain/state-transitions.md)), the port (see
> [../../architecture/provider-boundaries.md](../../architecture/provider-boundaries.md)), money
> representation (see [../../architecture/data-model.md](../../architecture/data-model.md)), or the
> flow (see [../user-flows.md](../user-flows.md) F6).
> **Status:** Draft.

## The one thing this must not do

**The prototype must never imply that the Platform holds money.**

The charter lists payment institution, escrow agent and holder of third-party funds as explicit
non-goals; whether fund-holding crosses into regulated activity is Q5, `UNKNOWN` and rated severe.
The failure mode is not a lie in the copy — it is the ordinary interface convention of showing a
"secured" or "in escrow" state, which every user will read as *the platform has the money*.

So the prototype shows a **commitment**, not a balance, and says what a commitment is at the moment
it is created.

## What each state means to each party

States are defined in [../../domain/state-transitions.md](../../domain/state-transitions.md). What
matters here is how each is described to a human.

| State | To the employer (E-02, E-07) | To the worker (W-02, W-07) |
| --- | --- | --- |
| `CommitmentRecorded` | "You have committed to pay this amount. The Platform records the commitment. It does not take or hold your money." | "The employer has recorded a commitment to pay this amount. The Platform does not hold the money." |
| `AuthorizationSimulated` | "A payment authorisation was returned — **simulated**." | Same, labelled. |
| `ReleaseAuthorized` | "Work confirmed. Release instructed." | "Your work was confirmed. Payment has been instructed." |
| `SettlementReported` | "The payment provider reported settlement — **simulated**." | "The provider reported that payment was sent — **simulated**. Confirm when it arrives." |
| `SettlementFailed` | "The provider reported a failure. The commitment stands." | "The provider reported a failure. Your payment is not cancelled." |
| `ReceiptAcknowledged` | "The worker confirmed receipt." | "You confirmed receipt." |

Two wordings carry most of the honesty burden. `SettlementReported` says **reported**, because the
Platform knows only what an adapter told it. And `SettlementFailed` tells the worker that the
obligation survives the failure — the moment a worker is most likely to assume they have been cheated
by a system rather than failed by an integration.

`ReceiptAcknowledged` exists because the Platform cannot observe arrival of funds. It is the one
state in the chain grounded in a human observation, and the engagement does not depend on it.

## The escrow affordance

Truth-matrix row 12 is `MOCK` and is deliberately never `FUNCTIONAL`. It exists so the demo can show
an **absence** honestly.

Concretely, at E-02's commitment step and on W-02's terms, the prototype states what the Platform
does and does not do with money, and links to SH-02. There is no escrow balance, no held-funds
figure, and no control that suggests one. This is the row a reviewer should be able to find without
being told, and it is the clearest single test of charter success criterion 4.

## The failure, on purpose

Scenario S5 is a required beat (A9), not an error path.

At the first release attempt the simulated provider reports a failure. The demo shows: the failure
state on both sides, the ledger unchanged in what it committed to, the retry, and both attempts
still present in the record afterwards. The failure is never overwritten.

This is the anti-gaming clause in practice. An adapter that settles whenever the demo needs it to is
`MOCK` and must be labelled `MOCK`; the port contract includes rejection, timeout and unknown
outcome ([../../architecture/provider-boundaries.md](../../architecture/provider-boundaries.md) rule
3), and the demo exercises at least one of them in front of the audience.

The unknown-outcome path deserves particular attention at GATE 3: a domain that never modelled "we
do not know whether this settled" cannot be given a real payment provider, and that is the specific
rewrite ADR-0003 exists to prevent.

## Money representation in the experience

Amounts are stored in **Rial** as integer minor units and presented in **Toman**, converted at the
boundary ([../../architecture/data-model.md](../../architecture/data-model.md)). Every displayed
amount states its unit. Persian digits are used in presentation.

This is not a formatting preference. A 10× Rial/Toman error is identified in the data-model document
as the single most likely data defect in the project, and in a payment screen it is the most
damaging place for it to appear.

## What is not built

| Candidate | Rejected because |
| --- | --- |
| Real payment rails | Q5 `UNKNOWN`, D11 unresearched, charter non-goal. Row 11 stays `SIMULATED`. |
| Any Platform-held balance or wallet | Charter non-goal; Q5 severe. Row 12 stays `MOCK` permanently. |
| Platform fees or commission | D10 — no revenue model is defined, and modelling one would prejudge it. |
| Payroll, tax withholding, invoices | Charter non-goal; Q10 `UNKNOWN`. |
| Advance payment, wage access, credit | Financial products in a jurisdiction where the Platform's basic payment posture is unresolved. |
| Refunds and reversals | The Platform performs no settlement and can reverse none. |
| Multi-currency | The market is one currency, and the Rial/Toman distinction is already the hard part. |

## Demonstration requirements

The demo fails unless:

1. a reviewer who reads only the payment screens can state that the Platform does not hold funds;
2. the settlement failure occurs in the main narrative, not in a side branch;
3. after retry, both the failed and the successful attempt remain visible;
4. every amount shows its unit, and Rial and Toman are never mixed on one screen;
5. `SIMULATED` is labelled at each payment state that came from the port, not once per screen.

## Prototype-to-pilot blockers

| # | Element | Blocked on |
| --- | --- | --- |
| 1 | Any real payment integration | Q5 `UNKNOWN` — severe; may require an entirely different payment topology. D11 unresearched. |
| 2 | Any state resembling held funds | Q5, and a charter change. Not an engineering decision. |
| 3 | Payment records against real people | Q7 retention, Q8 data protection, Q10 tax. |
| 4 | The commitment's legal character | `UNKNOWN`. The prototype records a commitment as a product fact. Whether it creates an obligation between the parties, and what the Platform's role in it is, touches Q6 and is not answered here. |
