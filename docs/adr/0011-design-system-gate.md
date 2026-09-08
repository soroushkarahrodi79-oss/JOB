# ADR-0011 — A design gate between product definition and engineering

**Status:** Accepted · **Date:** 2026-09-07
**Scope:** the gate map. This ADR decides sequencing and numbering. It decides nothing visual —
that is [ADR-0012](0012-visual-product-language.md).

## Context

Work on the visual product language was commissioned by explicit human instruction, positioned
between GATE 1 (product and interaction definition) and the engineering gate, and given the verdict
vocabulary `DESIGN_SYSTEM_LOCKED` / `DESIGN_SYSTEM_NOT_READY`.

The gate map in [../acceptance-gates.md](../acceptance-gates.md) had no such gate. It ran
GATE 1 → GATE 2 (engineering skeleton) → GATE 3 (domain implementation) → GATE 4 (prototype
surface).

GATE 1's own output had already begun writing as though a design gate existed, and had named it
GATE 2 — the number the engineering gate already held:

| Location | Says | Meaning intended |
| --- | --- | --- |
| [../product/screen-inventory.md](../product/screen-inventory.md) | "colour, type, spacing, iconography and component structure are GATE 2 work" | design |
| [../../CLAUDE.md](../../CLAUDE.md) §1 | "Screens are *defined* at this gate and *designed* at GATE 2" | design |
| [../product/experience/proof-of-work.md](../product/experience/proof-of-work.md) | "QR is a presentation option for GATE 2" | design |
| [../acceptance-gates.md](../acceptance-gates.md) | "GATE 2 — Engineering skeleton" | engineering |
| [../architecture/system-architecture.md](../architecture/system-architecture.md) | "From GATE 2, dependency direction is enforced by tooling in CI" | engineering |
| [ADR-0002](0002-pragmatic-modular-monolith.md), [ADR-0005](0005-persian-first-rtl-native-ui.md), [ADR-0008](0008-provisional-application-stack.md) | CI enforcement, linting, supply-chain work "at GATE 2" | engineering |

So the repository already carried two incompatible meanings for the same gate number, introduced at
GATE 1 and not caught by that gate's contradiction audit. This ADR resolves that, and it is the
reason the design work could not simply begin.

Additionally, [../design/design-system.md](../design/design-system.md) deferred visual identity,
palette, typeface, iconography and motion "to product design work at GATE 1" — a gate that
explicitly forbade choosing visual styling. That reference was stale in both directions.

## Decision

**1. A design gate is inserted, and it is numbered `GATE 1.5 — DESIGN SYSTEM AND VISUAL PRODUCT
LANGUAGE`.** Its exit criteria and verdict vocabulary are canonical in
[../acceptance-gates.md](../acceptance-gates.md).

**2. No existing gate is renumbered.** GATE 2 remains the engineering skeleton, GATE 3 the domain
implementation, GATE 4 the prototype surface.

**3. The three GATE 1 documents that used "GATE 2" in the design sense are corrected to
"GATE 1.5"** in the same change. This is a correction of a defect, not a change of meaning: each
already meant the design gate.

**4. The visual system is implemented across two later gates, not one.** Tokens, primitives and
their accessibility semantics land at GATE 2 alongside the workspace and the linting that enforces
[ADR-0005](0005-persian-first-rtl-native-ui.md). Screens land at GATE 4. Nothing in this ADR moves
domain work, which stays at GATE 3.

## Why `1.5` rather than renumbering

Renumbering GATE 2 → 3, 3 → 4, 4 → 5 would require editing ADR-0002, ADR-0005 and ADR-0008, all
`Accepted`. [README.md](README.md) rule 1 makes accepted ADRs immutable; they are superseded, never
edited. Superseding three foundational ADRs to change a number in a consequence line would destroy
more reasoning than it repaired, and would leave every external reference to those records stale.

A fractional gate is also not a novelty here. GATE 0.1 was inserted the same way, for the same class
of reason, and is recorded in the gate history.

The cost is that the gate map now has a fractional entry, and that the commissioning instruction
called this gate "GATE 2". Renaming it later is a documentation change and requires no ADR; it does
require deciding what the engineering gate is then called.

## Consequences

- The gate map gains an entry; no existing gate definition changes.
- [../design/design-system.md](../design/design-system.md) stops deferring to GATE 1 and routes to
  the documents produced at GATE 1.5. It remains canonical for design-system *governance*; it
  becomes canonical for none of the visual decisions.
- [../README.md](../README.md)'s ownership map gains the GATE 1.5 documents. Every visual concept
  acquires exactly one owner, per [ADR-0006](0006-single-source-of-truth-documentation.md).
- The GATE 1 contradiction audit is now known to have missed a contradiction it should have caught.
  That is recorded here rather than in a gate report, because gate reports are not read again.

## Rejected alternatives

- **Renumber the later gates.** Rejected: requires editing accepted ADRs.
- **Fold visual design into GATE 2.** Rejected: GATE 2 installs dependencies and writes code. A gate
  that both decides a visual language and implements it removes the review point between them, which
  is the point of having gates at all.
- **Fold visual design into GATE 4.** Rejected: GATE 2's linting enforces logical properties and
  GATE 2's workspace carries the token layer. Both need the design decisions to exist first.
- **Leave the collision and let context disambiguate.** Rejected: it is exactly the drift
  [ADR-0006](0006-single-source-of-truth-documentation.md) exists to prevent, and it had already
  produced three documents pointing at the wrong gate.
