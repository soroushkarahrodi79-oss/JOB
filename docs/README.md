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
| End-to-end flows across actors | [product/user-flows.md](product/user-flows.md) |
| Demo narratives and demo data policy | [product/demo-scenarios.md](product/demo-scenarios.md) |
| Domain entities, invariants, ubiquitous language | [domain/domain-model.md](domain/domain-model.md) |
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

## Document header convention

Every canonical document opens with:

```
> **Canonical for:** …
> **Not canonical for:** … (see …)
> **Status:** Draft | Stable
```
