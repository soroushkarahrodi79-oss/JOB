# Documentation Index and Canonical Ownership Map

This repository follows a **single-source-of-truth** rule: every project concept has
exactly one canonical document. Other documents reference it; they never restate it.

If you are about to write a definition, check this table first. If the concept already
has an owner, link to the owner instead of describing it again.

## Canonical ownership

| Concept | Canonical source |
| --- | --- |
| Problem, thesis, in-scope / out-of-scope, success criteria | [product/charter.md](product/charter.md) |
| Actors and their motivations, constraints, literacy assumptions | [product/personas.md](product/personas.md) |
| End-to-end flow spine and its decision points | [product/user-flows.md](product/user-flows.md) |
| Demo stories, scenario register, demo-data policy | [product/demo-scenarios.md](product/demo-scenarios.md) |
| Investor Golden Path, its timing, and narration rules | [product/investor-narrative.md](product/investor-narrative.md) |
| Screens, their IDs, purpose and transitions | [product/screen-inventory.md](product/screen-inventory.md) |
| Demo dataset composition, archetypes and generation rules | [product/demo-dataset.md](product/demo-dataset.md) |
| Matching pipeline and explanation model | [product/experience/matching.md](product/experience/matching.md) |
| Classification factor capture and signal presentation | [product/experience/classification.md](product/experience/classification.md) |
| Worker Passport and Employer Trust Profile contents | [product/experience/trust-profiles.md](product/experience/trust-profiles.md) |
| Proof-of-Work mechanisms | [product/experience/proof-of-work.md](product/experience/proof-of-work.md) |
| Payment experience and its wording | [product/experience/payment.md](product/experience/payment.md) |
| Dispute scenario, findings, trust-and-safety scope | [product/experience/disputes.md](product/experience/disputes.md) |
| Domain entities, invariants, ubiquitous language | [domain/domain-model.md](domain/domain-model.md) |
| Entity lifecycle states, triggers and guards | [domain/state-transitions.md](domain/state-transitions.md) |
| Engagement classification model and its assumptions | [domain/engagement-classification.md](domain/engagement-classification.md) |
| Layering, module boundaries, dependency direction | [architecture/system-architecture.md](architecture/system-architecture.md) |
| Port catalogue and adapter substitution rules | [architecture/provider-boundaries.md](architecture/provider-boundaries.md) |
| Persistence rules and data-representation decisions | [architecture/data-model.md](architecture/data-model.md) |
| How legal claims are represented, and their epistemic status | [legal/legal-architecture.md](legal/legal-architecture.md) |
| Unresolved **legal** questions | [legal/open-questions.md](legal/open-questions.md) |
| Unresolved **product and architecture** decisions | [open-decisions.md](open-decisions.md) |
| Product design values and decision rules | [design/design-principles.md](design/design-principles.md) |
| Design system governance: tokens, primitives, composition | [design/design-system.md](design/design-system.md) |
| RTL and accessibility requirements | [design/rtl-accessibility.md](design/rtl-accessibility.md) |
| Truth taxonomy and per-capability truth status | [demo-truth-matrix.md](demo-truth-matrix.md) |
| Gate definitions and exit criteria | [acceptance-gates.md](acceptance-gates.md) |
| Accepted and proposed architectural decisions | [adr/](adr/README.md) |
| Agent operating rules and routing | [../CLAUDE.md](../CLAUDE.md) |

## Deliberate non-overlaps

These pairs are easy to duplicate. The split is intentional:

- **domain-model vs data-model** — `domain-model.md` owns concepts and invariants and says
  nothing about storage. `data-model.md` owns persistence and representation rules and
  defines no entities. Neither contains a schema; no schema exists yet.
- **domain-model vs personas** — `personas.md` owns human actors. `domain-model.md` owns the
  system's representation of those actors. `Worker` (entity) is not `Worker` (persona).
- **system-architecture vs provider-boundaries** — `system-architecture.md` owns the layering
  rule that forbids domain-to-vendor dependencies. `provider-boundaries.md` owns the list of
  ports and what each one abstracts.
- **legal-architecture vs engagement-classification** — `legal-architecture.md` owns *how* the
  project handles legal uncertainty. `engagement-classification.md` owns the *product-side model*
  and states its assumptions. Neither asserts a legal conclusion.
- **open-decisions vs legal/open-questions** — legal questions live only in
  `legal/open-questions.md`. Everything else lives only in `open-decisions.md`.
- **ADRs vs everything else** — an ADR records *that a decision was made, why, and what it
  rules out*. It does not become the reference manual for the thing it decided.
- **user-flows vs experience/** — `user-flows.md` owns the *spine*: where each flow sits in the
  end-to-end journey and what the decision points are. Each document in `product/experience/` owns
  the *mechanism* of one capability. A flow that restated its mechanism would become a second,
  drifting copy of it, so the flow delegates by link.
- **demo-scenarios vs investor-narrative** — `demo-scenarios.md` owns *what happens* in the demo
  world: the three stories and their beats. `investor-narrative.md` owns *how it is presented*:
  stage order, time budget, and what each stage proves. The narrative references beat IDs and
  restates no beat.
- **domain-model vs state-transitions** — `domain-model.md` owns what an entity *is* and the
  invariants over it. `state-transitions.md` owns the states it can hold and the transitions
  between them. Neither defines the other's subject, and derived projections appear in
  `state-transitions.md` only to record that they have no state machine.
- **experience/classification vs domain/engagement-classification** — the domain document owns the
  factor model, its assumptions and its permitted uses. The experience document owns how factors
  are captured and how the signal is displayed. The factors themselves are defined once, in the
  domain document.
- **screen-inventory vs design/** — `screen-inventory.md` owns what a screen is *for*. The design
  documents own how anything looks. No styling decision appears in the inventory.
- **screen-inventory vs investor-narrative, on the Golden Path** — the inventory owns *whether* a
  screen is on the primary path (its `Path` row). The narrative owns *when, in what order, for how
  long and why*. Neither restates the other's half, and the two counts — 13 primary, 11 supporting
  — are asserted in the inventory and consumed by the narrative.
- **open-decisions: the two tables** — the main register owns which decisions are open and what
  happens by drift. The prototype-provisional table owns human-approved values in active use, with
  their revisit triggers. A decision can appear in both; appearing in the second never removes it
  from the first, and never means it is resolved. Mechanism:
  [ADR-0010](adr/0010-prototype-provisional-defaults.md).

## Document header convention

Every canonical document opens with:

```
> **Canonical for:** …
> **Not canonical for:** … (see …)
> **Status:** Draft | Stable
```
