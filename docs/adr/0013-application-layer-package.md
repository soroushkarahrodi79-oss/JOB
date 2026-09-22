# ADR-0013 — Realise the application layer as a workspace package

**Status:** Accepted · **Date:** 2026-09-22
**Scope:** where use cases live, and what may depend on what. It decides nothing about product
behaviour, persistence, or any port.

## Context

[../architecture/system-architecture.md](../architecture/system-architecture.md) names five layers
and GATE 2 built four of them as workspace packages: `@platform/tokens`, `@platform/domain`,
`@platform/adapters`, `@platform/ui`, plus the `@platform/web` host. The **Application (use cases,
orchestration)** layer was named in the diagram and never realised — GATE 3 was scoped to domain
rules, ports and adapters, and had no caller.

GATE 4's first employer slice (E-01 → E-02 → E-03) is the first work that needs one. It has to
compose things that exist but are not joined up: construct an `Opportunity` from employer input,
validate it, record a payment commitment, derive classification factors from the terms, and drive
`transitionOpportunity`. None of that is domain logic — the domain owns the rules, not the sequence
— and none of it may live in a React component, because
[../architecture/system-architecture.md](../architecture/system-architecture.md) rule 5 is that the
UI reaches adapters only through use cases.

Two placements were available.

**Inside `apps/web`.** Cheapest, and it is where a use case ends up by default in a Next.js
application. It was rejected for one reason that is not aesthetic: the dependency direction in this
repository is enforced by ESLint per package path
([../adr/0002-pragmatic-modular-monolith.md](0002-pragmatic-modular-monolith.md) consequence). Use
cases living under `apps/web/**` inherit the app host's permissions — React, Next, the UI package —
so nothing would stop a use case importing a component, and the rule would go back to being review
discipline. That is the failure mode the enforcement exists to prevent.

**A workspace package.** One more `package.json`, and the boundary becomes mechanical.

[../../CLAUDE.md](../../CLAUDE.md) §5 asks whether the abstraction has a current architectural
purpose. It does, and the purpose is not foresight: the rule it protects is already written, already
enforced for three other packages, and about to acquire its first opportunity to decay.

## Decision

**1. The application layer is realised as `@platform/application`.** It holds use cases, the
read models a screen renders, and the prototype's demo-session state. It is the layer
[../architecture/system-architecture.md](../architecture/system-architecture.md) already defines;
this ADR places it, and adds nothing to the architecture.

**2. Its dependency direction is enforced, not documented.** `@platform/application` may import
`@platform/domain` and `@platform/adapters`. It may not import React, Next, `@platform/ui`,
`@platform/tokens`, or the app host. This is added to `eslint.config.mjs` beside the three existing
boundaries.

**3. No port is added, removed or redefined.** The layer consumes the ports GATE 3 declared
(`ClockPort` and `IdGeneratorPort` in this slice) and declares none of its own.
[ADR-0003](0003-provider-ports-and-adapters.md) is untouched.

**4. Adapters are selected at composition time in the app host**, per
[../architecture/system-architecture.md](../architecture/system-architecture.md) rule 4. The
application layer takes its dependencies as arguments and knows no adapter by name.

**5. Module granularity inside the package is not decided here.** It stays one package with one
public surface until the domain shows a seam, per that document's *Deliberately not decided*.

## Consequences

- `system-architecture.md`'s layer list is now fully realised in code. The document is canonical for
  the rules; this ADR only says which package holds the layer.
- A use case is unit-testable without a DOM, and is picked up by the existing
  `packages/*/src/**/*.test.ts` runner without changing the test configuration.
- The Next.js app keeps rendering and wiring and stops being a place where domain sequencing can
  accumulate unnoticed.
- One more package to install and typecheck. That is the whole cost.

## What this rules out

- Use cases in `apps/web`. A screen that needs new behaviour adds it to the application package.
- The application layer importing a component, a token, or the app host — mechanically, not by
  convention.
- Treating this as licence to pre-build a use case for a screen that does not exist. Use cases are
  added when a gate builds the surface that calls them.
