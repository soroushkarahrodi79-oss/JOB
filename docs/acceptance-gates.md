# Acceptance Gates

> **Canonical for:** gate definitions, exit criteria, and the current gate.
> **Not canonical for:** capability truth status (see [demo-truth-matrix.md](demo-truth-matrix.md)).
> **Status:** Draft.

Work proceeds in gates. A gate is not "mostly done". Each gate ends with an explicit verdict.
Work belonging to a later gate is not started early, even when it looks cheap.

## Current gate

**GATE 1 — PRODUCT AND INTERACTION DEFINITION.**

## Gate history

| Gate | Verdict | Date |
| --- | --- | --- |
| GATE 0 — Foundation | `FOUNDATION_LOCKED` | 2026-09-07 |
| GATE 0.1 — Architecture reconciliation | `FOUNDATION_RECONCILED` | 2026-09-07 |
| GATE 1 — Product and interaction definition | `PROTOTYPE_EXPERIENCE_LOCKED` — on authorised prototype-provisional defaults for D1, D2, D3, D8 and D9, none of which is resolved | 2026-09-07 |

GATE 1 first returned `PROTOTYPE_EXPERIENCE_NOT_READY` because the gate rule and the decision
register contradicted each other. The contradiction was resolved by
[ADR-0010](adr/0010-prototype-provisional-defaults.md), not by resolving any decision.

GATE 0.1 was an unplanned reconciliation gate, recorded here after the fact because it produced an
accepted ADR ([ADR-0008](adr/0008-provisional-application-stack.md)) and changed a gate's blocking
status. A gate that leaves no record in this document is a gate that did not happen.

## GATE 0 — Foundation

**Purpose:** produce a coherent, non-duplicative documented foundation from which product and
visual design can begin, without pre-committing the future production architecture.

**In scope:** documentation, governance, decision records.

**Explicitly out of scope:** application screens, external integrations, database provisioning,
payment or identity connections, dependency installation, build tooling, speculative directory
skeletons.

**Exit criteria**

1. Every concept in the canonical ownership map has exactly one owning document.
2. No concept is independently defined in two documents.
3. The truth taxonomy exists and every listed capability has a truth status.
4. External capabilities that will later require real Iranian providers are named as ports.
5. Consequential product and legal questions are recorded as open, not silently answered.
6. Architectural decisions that constrain the future are recorded as ADRs.
7. A duplication and contradiction audit has been performed, and every finding is either resolved or recorded in [open-decisions.md](open-decisions.md).

**Verdict vocabulary:** `FOUNDATION_LOCKED` or `FOUNDATION_NOT_READY`. No other verdict is valid.

## GATE 1 — Product and interaction definition

Personas, flows and demo scenarios are taken from draft to stable, and screen-level interaction
is defined. Still no application code.

**Blocked on:** every entry in [open-decisions.md](open-decisions.md) whose *Blocks* column names
GATE 1, unless that entry is operating under an `AUTHORISED` prototype-provisional default
([ADR-0010](adr/0010-prototype-provisional-defaults.md)). That register is canonical; this document
does not restate the list.

**Exit criteria**

GATE 1 previously had none. They are recorded here so the gate can be judged rather than declared.

1. The complete investor-demo narrative is defined, with a stated time budget, and each stage names
   what it proves and what the viewer understands afterwards.
2. Three demo stories are defined over **one** shared dataset, cross-referencing the same entities.
   Three disconnected demo worlds fail this criterion.
3. Every screen has a stable ID and justifies its existence against a new decision, state
   transition, or investor understanding. Rejected screens are recorded with their reason.
4. The canonical state progression is defined for every entity the demo exercises.
5. Matching, classification, Passport, employer trust, Proof of Work, payment and disputes each have
   a defined prototype experience, and each states which behaviour is functional and which is
   simulated.
6. The demo dataset is specified by archetype and approximate count, with generation rules.
7. Every capability the demo uses appears in [demo-truth-matrix.md](demo-truth-matrix.md).
8. Prototype elements that must not proceed into a real pilot without qualified Iranian legal review
   are identified, per capability.
9. A duplication and contradiction audit has been performed against the charter, the domain model
   and the truth matrix, and every finding is resolved or recorded.
10. Every open decision whose *Blocks* column names GATE 1 is either **resolved by explicit human
    instruction**, or operating under an `AUTHORISED` **prototype-provisional default** that
    satisfies all seven recorded fields and all eight safeguards in
    [ADR-0010](adr/0010-prototype-provisional-defaults.md), and is enumerated in the gate report.
    A provisional default is not a resolution: the decision stays `OPEN`.
11. The investor golden path is defined separately from the full screen inventory, and is small
    enough to argue a thesis rather than tour a product.

**Verdict vocabulary:** `PROTOTYPE_EXPERIENCE_LOCKED` or `PROTOTYPE_EXPERIENCE_NOT_READY`. No other
verdict is valid.

## GATE 2 — Engineering skeleton

Workspace, strict TypeScript, linting, test runners, and the domain/ports separation expressed
in code. This is the first gate that installs dependencies. It is also the first gate at which
this repository can define validation commands; until then, `CLAUDE.md` correctly states that
none exist.

**Not blocked.** [ADR-0008](adr/0008-provisional-application-stack.md) is accepted for the
prototype, and GATE 2 was previously blocked on a production hosting question it never depended on.

**Must be satisfied within this gate:** D15 (dependency and supply-chain resilience) and the
CI-enforced portability check required by ADR-0008 constraint 3. These are work inside the gate,
not preconditions for entering it.

## GATE 3 — Domain implementation

Domain model and eligibility/classification rules, behind ports, with tests. Simulated adapters
implement full port contracts including failure paths.

## GATE 4 — Prototype surface

Persian-first, RTL-native UI over the domain. Every non-`FUNCTIONAL` capability carries its
truth label at the point of use.

**Exit criterion:** the truth matrix `Actual` column matches observable behaviour, verified by
walking each demo scenario.

## Gate discipline

- A gate's exit criteria may be tightened at any time. Loosening them requires an ADR.
- Discovering that a later gate's work is needed early is a signal to re-scope the gate, not to
  quietly start the work.
- Tests verify the implementation. Writing behaviour specifically to satisfy a test, rather than
  to satisfy the domain, is a defect regardless of whether the test passes.
