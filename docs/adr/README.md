# Architecture Decision Records

An ADR records **that a decision was made, why, and what it rules out**. It is not the reference
manual for the thing it decided — that lives in the canonical document named in the ADR's
Consequences.

## When an ADR is required

- Changing a module or layer boundary.
- Adding, removing or redefining a port.
- Changing the truth taxonomy or the truth level of a capability.
- Adopting or replacing a foundational technology.
- Changing how legal uncertainty is represented.
- Reversing or materially amending any accepted ADR.

## When one is not

Naming, formatting, copy, internal refactors that preserve boundaries, and anything already
determined by an accepted ADR.

## Rules

1. **Accepted ADRs are immutable.** They are superseded by a new ADR, never edited in place.
2. Superseded ADRs stay in the repository with a `Superseded by` link. The reasoning is the value.
3. `Proposed` ADRs are not binding and must not be built on.
4. An agent may not change an accepted ADR's status without explicit human instruction.

## Status vocabulary

`Proposed` · `Accepted` · `Superseded by ADR-XXXX` · `Rejected`

## Index

| ID | Title | Status |
| --- | --- | --- |
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-pragmatic-modular-monolith.md) | Pragmatic modular monolith | Accepted |
| [0003](0003-provider-ports-and-adapters.md) | External capabilities behind ports and adapters | Accepted |
| [0004](0004-demo-truth-taxonomy.md) | Explicit demo truth taxonomy | Accepted |
| [0005](0005-persian-first-rtl-native-ui.md) | Persian-first, RTL-native UI | Accepted |
| [0006](0006-single-source-of-truth-documentation.md) | Single-source-of-truth documentation | Accepted |
| [0007](0007-legal-claims-carry-epistemic-status.md) | Legal claims carry epistemic status | Accepted |
| [0008](0008-provisional-application-stack.md) | Provisional application stack | **Proposed** |
