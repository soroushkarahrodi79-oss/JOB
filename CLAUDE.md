# CLAUDE.md — Operating Constitution

Rules for AI agents working in this repository. This file **routes**; it does not restate project
knowledge. Where a rule and a canonical document disagree, the canonical document wins and this
file is the defect.

## 1. Current state

**GATE 0 — FOUNDATION.** Documentation and governance only.

There is **no application code, no dependencies, no build tooling, no database**. This is
deliberate, not incomplete.

**Do not**, in this gate: implement screens, install dependencies, add `package.json` or build
config, provision a database, connect any external service, or create empty directory skeletons.

Gate definitions and exit criteria: [docs/acceptance-gates.md](docs/acceptance-gates.md).

## 2. Before you write anything

1. **Investigate before claiming.** Read the relevant files. Never describe this project from
   assumption or from what similar projects usually do.
2. **Check the ownership map** — [docs/README.md](docs/README.md) — before writing any definition.
   If a concept has an owner, link to it. Do not restate it.
3. **Check the ADRs** — [docs/adr/](docs/adr/README.md) — before changing any boundary.
4. **Check the open registers** — [docs/open-decisions.md](docs/open-decisions.md) and
   [docs/legal/open-questions.md](docs/legal/open-questions.md) — before deciding anything
   consequential. If your work depends on an open entry, surface it. Do not resolve it.

## 3. Routing

All canonical sources are listed in **[docs/README.md](docs/README.md)**. Start there.

The four you will need most often:

- What the product is → [docs/product/charter.md](docs/product/charter.md)
- What is real vs simulated → [docs/demo-truth-matrix.md](docs/demo-truth-matrix.md)
- Architecture rules → [docs/architecture/system-architecture.md](docs/architecture/system-architecture.md)
- Provider boundaries → [docs/architecture/provider-boundaries.md](docs/architecture/provider-boundaries.md)

## 4. Hard rules

These are not preferences. Violating one is a defect regardless of whether anything breaks.

1. **Never present a simulated or mocked capability as real.** ([ADR-0004](docs/adr/0004-demo-truth-taxonomy.md))
2. **Never state a legal conclusion as fact.** Every legal statement carries an epistemic status.
   Agents may record legal questions; agents may never answer them.
   ([ADR-0007](docs/adr/0007-legal-claims-carry-epistemic-status.md))
3. **Never let the domain layer depend on an external provider.**
   ([ADR-0003](docs/adr/0003-provider-ports-and-adapters.md))
4. **Never define the same concept in two documents.**
   ([ADR-0006](docs/adr/0006-single-source-of-truth-documentation.md))
5. **Never silently change an accepted ADR.** Supersede it with a new one, or ask.
6. **Never invent capabilities outside accepted scope.** If it is not in the charter or the truth
   matrix, it does not exist.
7. **Never hard-code behaviour to make a test pass.** Tests verify the implementation; they do not
   define it.
8. **Never bundle a broad refactor into unrelated work.**
9. **Never commit a credential, endpoint, or provider account.**
10. **Never use real personal data, or real registry, bank or phone identifiers** — including in
    demo data. ([docs/product/demo-scenarios.md](docs/product/demo-scenarios.md))

## 5. Bias against complexity

Be adversarial toward abstraction. If a proposed abstraction has no current architectural purpose,
**do not create it**. An interface with one implementation and no substitution risk, a module
boundary with no seam, a port for something that will never be replaced — all are defects, not
foresight.

When unsure whether something is needed: it is not. Add it when the need appears.

## 6. Change control

| Change | Requires |
| --- | --- |
| Module or layer boundary | ADR |
| Adding, removing or redefining a port | ADR |
| Truth level of a capability | ADR + truth matrix update in the same change |
| Foundational technology | ADR |
| Reversing an accepted ADR | New superseding ADR |
| Resolving an open decision or legal question | Explicit human instruction |
| Anything contradicting a canonical document | Stop and raise it |

## 7. Validation commands

**None exist.** No tooling is installed at GATE 0. This section is populated at GATE 2 and is the
canonical location for validation commands when it is.

Until then, validation is manual review against the GATE 0 exit criteria in
[docs/acceptance-gates.md](docs/acceptance-gates.md).

## 8. When you are unsure

Stop and ask. In this project, a wrong silent assumption is more expensive than a question —
especially for anything legal, anything that changes a boundary, or anything that affects what the
prototype claims to be.

Do not resolve ambiguity by choosing the interpretation that produces more visible output.
