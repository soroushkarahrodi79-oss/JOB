# System Architecture

> **Canonical for:** layering, module boundaries, dependency direction, and what is forbidden.
> **Not canonical for:** the port catalogue (see [provider-boundaries.md](provider-boundaries.md)),
> persistence rules (see [data-model.md](data-model.md)), domain concepts (see
> [../domain/domain-model.md](../domain/domain-model.md)).
> **Status:** Draft. Decisions recorded in [ADR-0002](../adr/0002-pragmatic-modular-monolith.md),
> [ADR-0003](../adr/0003-provider-ports-and-adapters.md), [ADR-0008](../adr/0008-provisional-application-stack.md).

No code exists. This document constrains code that does not yet exist, which is the only time such
constraints are cheap.

## Shape

A **pragmatic modular monolith**: one deployable unit, internally partitioned by domain module,
with enforced dependency direction.

Not microservices. The project has no scale problem, no independent-deployment requirement, and no
team-boundary problem. Distributing this system would buy operational cost and distributed-failure
modes in exchange for nothing. If that changes, it changes by ADR.

## Layers

```
┌─────────────────────────────────────────────┐
│ UI / Presentation                           │  Persian-first, RTL-native
├─────────────────────────────────────────────┤
│ Application (use cases, orchestration)      │
├─────────────────────────────────────────────┤
│ Domain (entities, invariants, rules)        │  ← depends on nothing outward
├─────────────────────────────────────────────┤
│ Ports (interfaces owned by the domain side) │
├─────────────────────────────────────────────┤
│ Adapters (mock / simulated / real)          │  ← depends inward only
└─────────────────────────────────────────────┘
```

## Dependency rules

1. **Dependencies point inward.** Domain depends on nothing but itself.
2. **The domain layer never imports a vendor SDK, HTTP client, ORM, or environment variable.**
3. **Ports are declared on the domain side and implemented on the adapter side.** A port's
   interface is expressed in domain vocabulary, never in a vendor's.
4. **Adapters are selected at composition time**, in one place. Nothing else knows which adapter
   is live.
5. **The UI never talks to an adapter directly.** It goes through application use cases.
6. Cross-module access is through a module's public surface, not its internals.

Rule 3 is the one that actually protects the project. A port named after what a vendor happens to
offer is a vendor dependency wearing an interface.

## Why this matters more here than usual

Provider replacement in this project is not hypothetical. Every external capability is currently
simulated and will later be replaced by an Iranian provider not yet chosen. If provider concepts
leak into the domain, that replacement becomes a rewrite. The layering above exists for that single
reason.

## Enforcement

Documented rules that are not mechanically checked decay. From GATE 2, dependency direction is
enforced by tooling in CI, not by review discipline. The specific mechanism is chosen at GATE 2.

## Deliberately not decided

- Module granularity. Premature module boundaries are as damaging as premature services. Modules
  are extracted when the domain shows a seam, not in advance.
- Event bus, CQRS, message queue. The engagement event record (see
  [../domain/domain-model.md](../domain/domain-model.md)) is an append-only record inside one
  transactional boundary. It does not need infrastructure to be that.
- Caching, background workers, rate limiting. No evidence of need.
- Multi-tenancy model. See [data-model.md](data-model.md).

## Known architectural tension

The provisional stack ([ADR-0008](../adr/0008-provisional-application-stack.md)) is built on
foreign infrastructure — package registries, font and asset CDNs, and hosting platforms — which
sits in tension with the charter's provider-portability constraint. The tension is real,
unresolved, and tracked as D4. It is recorded rather than smoothed over.
