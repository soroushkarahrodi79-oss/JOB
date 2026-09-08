# CLAUDE.md — Operating Constitution

Rules for AI agents working in this repository. This file **routes**; it does not restate project
knowledge. Where a rule and a canonical document disagree, the canonical document wins and this
file is the defect.

## 1. Current state

**GATE 2 — ENGINEERING SKELETON, closed `ENGINEERING_SKELETON_LOCKED`.** GATE 0 closed
`FOUNDATION_LOCKED`; GATE 0.1 `FOUNDATION_RECONCILED`; GATE 1 `PROTOTYPE_EXPERIENCE_LOCKED`;
GATE 1.5 `DESIGN_SYSTEM_LOCKED`. The next gate is **GATE 3 — domain implementation**.

The repository now has a pnpm workspace, strict TypeScript, linting, test runners, a self-hosted
font, the token layer and the design-system primitives — but **no domain rules, no provider
adapters, no database, and no product screens**. That is the gate boundary, not an omission.

**Do not**, before their gate: implement product screens or the screen inventory (GATE 4);
implement domain rules, eligibility/classification logic, provider ports with failure contracts,
or simulated adapters, or generate the demo dataset (GATE 3); author a database schema (GATE 3);
connect any real external service (never in the prototype). Primitives compose into screens at
GATE 4; the domain and its ports are GATE 3 ([ADR-0011](docs/adr/0011-design-system-gate.md)).

Gate definitions, exit criteria and the current gate: [docs/acceptance-gates.md](docs/acceptance-gates.md).

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

And, from GATE 1 onward:

- What the prototype does → [docs/product/screen-inventory.md](docs/product/screen-inventory.md)
  and [docs/product/experience/](docs/product/experience/)
- What the demo is → [docs/product/demo-scenarios.md](docs/product/demo-scenarios.md)

And, from GATE 1.5 onward:

- What it looks like and why → [docs/design/visual-language.md](docs/design/visual-language.md)
- How anything is rendered → [docs/design/](docs/design/) and
  [docs/design/components/](docs/design/components/)

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

Node is pinned in `.nvmrc`; the package manager is pinned in `package.json` (`packageManager`).
Install with `pnpm install`; CI uses `pnpm install --frozen-lockfile` (D15).

| Command | Checks |
| --- | --- |
| `pnpm typecheck` | Strict TypeScript across every package; type errors are build failures. |
| `pnpm lint` | ESLint, including the inward dependency-direction boundary (ADR-0002) and the no-physical-`left`/`right` rule in JS/TSX (ADR-0005). |
| `pnpm lint:css` | Stylelint, including the CSS logical-properties rule (ADR-0005). |
| `pnpm format:check` | Prettier. Canonical documentation is excluded so it is not reflowed. |
| `pnpm test` | Vitest — token, domain and primitive unit/component tests, including the domain-state → visual-vocabulary exhaustiveness guard. |
| `pnpm test:e2e` | Playwright — the GATE 1.5 rendered risk checks (R1–R5), RTL, keyboard focus and an axe pass. |
| `pnpm build` | Generates the token CSS and builds the Next.js app. |
| `pnpm dev` | Runs the app locally. |

CI runs all of the above plus a generic Docker build-and-run portability check
([ADR-0008](docs/adr/0008-provisional-application-stack.md) constraint 3) — see
`.github/workflows/ci.yml`.

## 8. When you are unsure

Stop and ask. In this project, a wrong silent assumption is more expensive than a question —
especially for anything legal, anything that changes a boundary, or anything that affects what the
prototype claims to be.

Do not resolve ambiguity by choosing the interpretation that produces more visible output.
