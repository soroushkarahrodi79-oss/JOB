# User Flows

> **Canonical for:** the end-to-end flow spine and the decision points within it.
> **Not canonical for:** screens (see [screen-inventory.md](screen-inventory.md)), demo narratives
> (see [demo-scenarios.md](demo-scenarios.md)), entity definitions (see
> [../domain/domain-model.md](../domain/domain-model.md)), entity state machines (see
> [../domain/state-transitions.md](../domain/state-transitions.md)), or the detailed mechanism of
> any single capability (see [experience/](experience/)).
> **Status:** Draft.

Flows are described as sequences of state transitions and decisions, not as screens.

Each flow below states where it sits in the journey and delegates its mechanism to the canonical
document for that capability. A flow that restated its mechanism would become a second, drifting
copy of it.

---

## F1 — Worker onboarding and Passport growth

1. Worker registers via an authentication port (`SIMULATED`).
2. Worker declares skills, availability and location preferences. Declared, not verified.
3. Worker optionally submits identity verification (`SIMULATED`).
4. Passport state is computed from what exists. It is never asserted.

**Decision point:** how much can a worker do unverified? Deliberately open — D2.

**Invariant:** a declared attribute and a verified attribute are never rendered identically.
This is the same honesty rule as the truth matrix, applied inside the domain.

---

## F2 — Opportunity creation

1. Employer describes the need: work type, time window, location, headcount, pay terms.
2. Employer states **eligibility requirements** as concrete conditions.
3. System derives a provisional engagement classification signal
   (see [../domain/engagement-classification.md](../domain/engagement-classification.md)).
4. Opportunity is published.

**Decision point:** step 3 may constrain what the employer is allowed to publish, or may only
inform them. This is a product *and* legal question — D3 and
[../legal/open-questions.md](../legal/open-questions.md) Q1.

---

## F3 — Eligibility-first matching

1. Candidate set is filtered by **hard eligibility**: unmet requirement means excluded, not ranked lower.
2. The remaining eligible set is ordered.
3. Each result carries a machine-generated explanation of *why* it qualified and why it sits
   where it sits.

**Invariant:** exclusion is explainable to both sides. An eligibility engine that cannot state
its reason is not acceptable, because it cannot be audited for unlawful or unfair exclusion.

The pipeline stages, the split between filtering and ordering, the explanation rules, and which
matching behaviour is functional versus simulated are canonical in
[experience/matching.md](experience/matching.md).

---

## F4 — Engagement lifecycle

An engagement moves from offer or acceptance through work to settlement, with cancellation and
dispute as diverting branches. The states, their triggers and their guards are canonical in
[../domain/state-transitions.md](../domain/state-transitions.md).

Transitions are events. The Passport, reputation and payment state are all *derived from* this
event record — never edited directly. This is what makes the Passport evidential rather than
declarative.

---

## F5 — Proof of Work

1. Worker records arrival, progress or completion.
2. Employer confirms, disputes, or does not respond.
3. Non-response is an explicit outcome with its own rule, not an undefined state.

**Constraint:** any attestation stronger than mutual confirmation (device, location, biometric)
is a privacy and consent question before it is a technical one. Tracked in
[../legal/open-questions.md](../legal/open-questions.md) Q4.

The proof mechanisms, and which part of each is functional versus simulated, are canonical in
[experience/proof-of-work.md](experience/proof-of-work.md).

---

## F6 — Payment orchestration

1. Amount is derived from the agreed terms and the confirmed Proof of Work.
2. A payment intent is created and recorded in the Platform ledger.
3. Settlement is delegated to a payment port (`SIMULATED` — no funds move).
4. Ledger state reflects the reported outcome, including failure.

**Constraint:** the Platform never represents itself as holding funds. See charter non-goals and
[../legal/open-questions.md](../legal/open-questions.md) Q5.

The payment experience, and the wording that carries that constraint to each party, are canonical
in [experience/payment.md](experience/payment.md).

---

## F7 — Dispute

1. Either party opens a case against a specific engagement, or operations flags one.
2. Evidence is assembled from the existing event record — not re-entered.
3. Operations records an outcome.
4. The outcome is recorded and affects reputation. The Platform does not adjudicate or enforce.

The prototype's dispute scenario, the findings available to operations, and the prototype's
trust-and-safety scope are canonical in [experience/disputes.md](experience/disputes.md).

---

## F8 — Preferred Crew / rehire

Employers mark workers they would rehire. This biases future matching **after** eligibility, never
before, so a preference relationship can never override a hard requirement.

---

## Flows deliberately not defined yet

Worker appeal against exclusion, employer offboarding, and account deletion. Their absence is a
known gap — D7 — not an oversight.

Trust-and-safety **case intake** was on this list and is now defined, at the minimum scope the
prototype needs, in [experience/disputes.md](experience/disputes.md). Everything else in the
trust-and-safety surface remains out of scope and `PLANNED`. Worker appeal against exclusion is the
sharpest remaining gap and is recorded there as a prototype-to-pilot blocker.
