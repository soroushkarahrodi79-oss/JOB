# ADR-0002 — Pragmatic modular monolith

**Status:** Accepted · **Date:** 2026-09-07

## Context

The project needs an architecture that supports an investor-grade prototype now without damaging a
future production MVP. Distributed architectures are frequently adopted early for anticipated scale
that never arrives, at high and immediate operational cost.

There is currently no scale requirement, no independent-deployment requirement, and no team-boundary
requirement.

## Decision

A pragmatic modular monolith: one deployable unit, internally partitioned by domain module, with
enforced inward dependency direction.

Explicitly rejected for now: microservices, service meshes, message brokers, CQRS, event sourcing as
infrastructure, and pre-defined module boundaries ahead of evidence.

## Consequences

- Cheap refactoring while the domain is still being learned.
- Module boundaries are extracted when a seam appears, not designed in advance.
- Extracting a service later requires an ADR — and is made feasible by
  [ADR-0003](0003-provider-ports-and-adapters.md).
- Layering rules live in [../architecture/system-architecture.md](../architecture/system-architecture.md).
- From GATE 2, dependency direction is enforced in CI. A documented-only rule decays.

## Rejected alternatives

- **Microservices** — cost with no corresponding requirement.
- **Unstructured monolith** — the domain/vendor separation is the project's core constraint and
  cannot be left to discipline alone.
