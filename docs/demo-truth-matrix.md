# Demo Truth Matrix

> **Canonical for:** the truth taxonomy, and the truth status of every demonstrable capability.
> **Not canonical for:** what each capability does (see the domain and architecture docs).
> **Status:** Draft — statuses are targets for the prototype, not descriptions of built software.

Nothing has been built. Every row below is currently `PLANNED` **in reality**. The
"Target" column states what the capability is intended to be at prototype delivery. When a
capability is built, its "Actual" column is updated in the same pull request.

**A capability may never be demonstrated at a higher truth level than its `Actual` value.**

## Truth taxonomy

| Level | Meaning | What the user may be shown |
| --- | --- | --- |
| `FUNCTIONAL` | Real logic, real state, real persistence. Behaves correctly for arbitrary valid input, not only the demo path. | Present normally. |
| `SIMULATED` | Real domain logic runs, but an external dependency is replaced by a deterministic in-repo stand-in that models the provider's behaviour, including its failure modes. | Must be labelled as simulated at the point of use. |
| `MOCK` | No meaningful logic. Fixed or scripted responses that exist to make a flow traversable. | Must be labelled as mock at the point of use. |
| `PLANNED` | Not implemented. Present only as documentation, or as a visibly inert affordance. | Must not be presented as working. Prefer absence over a dead control. |

### The non-negotiable rule

> **No `SIMULATED` or `MOCK` capability may be presented as a real integration.**

This applies to UI copy, screenshots, investor decks, recorded demos, and verbal narration.
It is not satisfied by a disclaimer on a different screen. Labelling is *at the point of use*.

Concretely, the prototype must never display the name of a real provider, bank, government
registry, or carrier in a way that implies a live connection to it. Simulated providers use
names that are unmistakably not real (see `provider-boundaries.md`).

### Anti-gaming clause

`SIMULATED` is not a licence to hard-code the demo. A simulated adapter must implement the
full port contract — including rejection, timeout, and partial-failure paths — for inputs
outside the demo script. An adapter that only answers the demo's exact inputs is `MOCK`,
and must be labelled `MOCK`.

## Capability matrix

| # | Capability | Target | Actual | Notes |
| --- | --- | --- | --- | --- |
| 1 | Worker profile and skills | `FUNCTIONAL` | `PLANNED` | Domain-owned; no external dependency. |
| 2 | Worker Passport (aggregated verified record) | `FUNCTIONAL` | `PLANNED` | Functional as an aggregate; the *verification inputs* it aggregates are not (rows 3, 4). |
| 3 | Worker identity verification | `SIMULATED` | `PLANNED` | Real Iranian identity rails are out of scope. See `legal/open-questions.md` Q3. |
| 4 | Employer business verification | `SIMULATED` | `PLANNED` | Same reasoning as row 3. |
| 5 | Opportunity creation and publication | `FUNCTIONAL` | `PLANNED` | |
| 6 | Eligibility-first matching | `FUNCTIONAL` | `PLANNED` | Deterministic rule evaluation over the domain model. No ML. |
| 7 | Availability-aware matching | `FUNCTIONAL` | `PLANNED` | |
| 8 | Location-aware matching | `SIMULATED` | `PLANNED` | Distance computed in-repo over fixed demo geography; no maps provider. |
| 9 | Engagement classification | `FUNCTIONAL` | `PLANNED` | The *mechanism* is functional. Its legal correctness is unvalidated — see row 18. |
| 10 | Proof of Work capture | `SIMULATED` | `PLANNED` | Attestation logic is real; any device/location attestation is simulated. |
| 11 | Payment orchestration | `SIMULATED` | `PLANNED` | Ledger and state machine are real; settlement is simulated. No funds move. |
| 12 | Escrow-style assurance affordance | `MOCK` | `PLANNED` | Deliberately `MOCK`, and deliberately never `FUNCTIONAL`. The Platform does not hold third-party funds — that is a charter non-goal, and holding them is a regulated activity (Q5). This row exists only so the demo can show the *absence* honestly. |
| 13 | Dispute handling | `FUNCTIONAL` | `PLANNED` | Case state machine only. Outcomes are recorded, not enforced. |
| 14 | Reputation — worker **and** employer | `FUNCTIONAL` | `PLANNED` | Covers both sides. Employer trust is not a separate capability; a matrix that listed only worker reputation would encode the asymmetry the model exists to prevent. Contents in `product/experience/trust-profiles.md`. |
| 15 | Preferred Crew / rehire | `FUNCTIONAL` | `PLANNED` | |
| 16 | Messaging / SMS notification | `MOCK` | `PLANNED` | Delivered to an in-app outbox viewer. No message leaves the system. |
| 17 | Authentication | `SIMULATED` | `PLANNED` | Session handling is real; the credential/OTP channel is simulated. |
| 18 | Legal compliance posture | `PLANNED` | `PLANNED` | The prototype demonstrates *no* validated compliance. See `legal/legal-architecture.md`. |
| 19 | Trust and safety controls | `PLANNED` | `PLANNED` | **Beyond dispute casework**, which is row 13. Account suspension, abuse reporting, fraud handling, moderation, and worker appeal against exclusion are all out of scope and unbuilt. The prototype's minimum scope is defined in `product/experience/disputes.md` on D7's recorded default; that definition scopes the gap, it does not close it. |
| 20 | Operations / admin tooling | `FUNCTIONAL` | `PLANNED` | Scope limited to what the demo scenarios require. |
| 21 | Demo scaffolding — actor switch, demo reset | `FUNCTIONAL` | `PLANNED` | Real logic, and it exists only in the prototype. Must declare itself a demo mechanism, not a product feature. |
| 22 | In-product truth ledger | `FUNCTIONAL` | `PLANNED` | Renders this matrix inside the prototype and is reachable from every truth label. Required by the presentation rules in `product/demo-scenarios.md`. |
| 23 | Work Graph accumulation | `FUNCTIONAL` | `PLANNED` | A projection over engagement events, Preferred Crew and reputation — not a stored structure and not a visualised feature. See `domain/domain-model.md`. |
| 24 | Structured engagement amendment | `FUNCTIONAL` | `PLANNED` | A recorded, acknowledged change to agreed terms. Replaces free-form messaging, and is the decisive dispute evidence in Story C. |

Rows 12, 18 and 19 exist to be honest about gaps. Removing a row because it is uncomfortable
is a governance violation.

Rows 21–24 were added at GATE 1 under
[ADR-0009](adr/0009-prototype-experience-architecture.md). No previously recorded target level was
changed; row 14's and row 19's notes were clarified, not re-levelled.
