# User Flows

> **Canonical for:** end-to-end flows and the decision points within them.
> **Not canonical for:** screens or layout (not yet defined), demo narratives (see
> [demo-scenarios.md](demo-scenarios.md)), entity definitions (see
> [../domain/domain-model.md](../domain/domain-model.md)).
> **Status:** Draft.

Flows are described as sequences of state transitions and decisions, not as screens. Screen
definition belongs to GATE 1.

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
2. The remaining set is filtered by availability over the specific time window.
3. The remaining set is ordered by location and reliability signals.
4. Each result carries a machine-generated explanation of *why* it qualified.

**Invariant:** exclusion is explainable to both sides. An eligibility engine that cannot state
its reason is not acceptable, because it cannot be audited for unlawful or unfair exclusion.

---

## F4 — Engagement lifecycle

`Offered → Accepted → InProgress → Completed → Settled`, with `Cancelled` and `Disputed` as
terminal or diverting branches.

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

---

## F6 — Payment orchestration

1. Amount is derived from the agreed terms and the confirmed Proof of Work.
2. A payment intent is created and recorded in the Platform ledger.
3. Settlement is delegated to a payment port (`SIMULATED` — no funds move).
4. Ledger state reflects the reported outcome, including failure.

**Constraint:** the Platform never represents itself as holding funds. See charter non-goals and
[../legal/open-questions.md](../legal/open-questions.md) Q5.

---

## F7 — Dispute

1. Either party opens a case against a specific engagement.
2. Evidence is assembled from the existing event record — not re-entered.
3. Operations records an outcome.
4. The outcome is recorded and affects reputation. The Platform does not adjudicate or enforce.

---

## F8 — Preferred Crew / rehire

Employers mark workers they would rehire. This biases future matching **after** eligibility, never
before, so a preference relationship can never override a hard requirement.

---

## Flows deliberately not defined yet

Trust-and-safety intake, worker appeal against exclusion, employer offboarding, and account
deletion. Their absence is a known gap — D7 — not an oversight.
