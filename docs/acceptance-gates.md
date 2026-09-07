# Acceptance Gates

> **Canonical for:** gate definitions, exit criteria, and the current gate.
> **Not canonical for:** capability truth status (see [demo-truth-matrix.md](demo-truth-matrix.md)).
> **Status:** Draft.

Work proceeds in gates. A gate is not "mostly done". Each gate ends with an explicit verdict.
Work belonging to a later gate is not started early, even when it looks cheap.

## Current gate

**GATE 0 — FOUNDATION.**

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

**Blocked on:** every entry in [open-decisions.md](open-decisions.md) whose *Blocks* column names GATE 1. That register is canonical; this document does not restate the list.

## GATE 2 — Engineering skeleton

Workspace, strict TypeScript, linting, test runners, and the domain/ports separation expressed
in code. This is the first gate that installs dependencies. It is also the first gate at which
this repository can define validation commands; until then, `CLAUDE.md` correctly states that
none exist.

**Blocked on:** the GATE 2 entries in [open-decisions.md](open-decisions.md) — principally D4 — and [ADR-0008](adr/0008-provisional-application-stack.md) moving from Proposed to Accepted.

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
