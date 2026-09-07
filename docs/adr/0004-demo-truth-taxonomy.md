# ADR-0004 — Explicit demo truth taxonomy

**Status:** Accepted · **Date:** 2026-09-07

## Context

The prototype mixes functional logic, simulated integrations and mocked responses. Prototypes shown
to investors routinely blur this line. That blurring is a credibility risk, an ethical problem, and
a factual misrepresentation to people making financial decisions.

The project also needs the distinction internally: without it, "we'll make it real later" quietly
becomes "we assumed it was real".

## Decision

A four-level truth taxonomy — `FUNCTIONAL`, `SIMULATED`, `MOCK`, `PLANNED` — governs every
demonstrable capability. Definitions and per-capability status are canonical in
[../demo-truth-matrix.md](../demo-truth-matrix.md).

No `SIMULATED` or `MOCK` capability may be presented as a real integration, in the product or in any
external material. Labelling is at the point of use.

## Consequences

- The design system must provide a truth-label primitive
  ([../design/design-system.md](../design/design-system.md)), so honesty is a component guarantee
  rather than per-screen discipline.
- The matrix is updated in the same pull request that changes a capability's behaviour.
- Some screens will look less impressive. This is the intended trade.
- Changing a capability's truth level requires an ADR.
- The anti-gaming clause prevents `SIMULATED` from being used to dignify a hard-coded demo path.

## Rejected alternatives

- **A single global "this is a prototype" disclaimer** — does not tell a reviewer *which* parts are
  real, which is the only question that matters.
- **Two levels (real / fake)** — collapses the meaningful distinction between an adapter that models
  provider behaviour and one that returns a constant.
