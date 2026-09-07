# ADR-0008 — Provisional application stack

**Status:** **Proposed** — not binding, must not be built upon · **Date:** 2026-09-07

## Context

The project anticipates Next.js, React, strict TypeScript, pnpm, PostgreSQL, Drizzle ORM, Tailwind
CSS, Zod, Vitest and Playwright. This is a coherent and defensible stack. It is recorded as
`Proposed` rather than `Accepted` because an unresolved tension has not been examined, and marking
it Accepted would hide that.

## The tension

The charter requires provider portability and the avoidance of critical runtime dependency on
foreign-only services. The provisional stack depends on foreign infrastructure at several layers:

1. **Package registries.** The npm registry is a foreign dependency of the *build*, and can be
   restricted at either end.
2. **Hosting.** Next.js is most commonly deployed to foreign platforms. Self-hosting is possible but
   is a deliberate choice with real cost, not a default.
3. **Asset and font CDNs.** A runtime dependency on a foreign CDN is an availability risk in the
   target market. Mitigated by self-hosting (ADR-0005), but the pattern must be actively avoided.
4. **Data residency.** Where PostgreSQL physically runs may be a legal question, not only an
   operational one — Q8.
5. **Sanctions and export controls.** May affect the use of foreign services and dependencies — Q11.

None of these invalidates the stack. All of them mean it should be adopted knowingly.

## Decision (proposed)

Adopt the stack above at GATE 2, conditional on:

- an explicit hosting and data-residency decision (D4),
- a deployment target that does not require a foreign managed platform,
- self-hosted fonts and assets with no foreign CDN in the critical path,
- a dependency policy that keeps the build reproducible without live foreign registry access.

## Consequences if accepted

- The stack constrains the UI layer only. The domain and ports layers remain framework-independent
  by [ADR-0002](0002-pragmatic-modular-monolith.md) and
  [ADR-0003](0003-provider-ports-and-adapters.md), so a framework change would not reach the domain.
- Drizzle is an infrastructure concern and stays behind the persistence boundary.
- Zod contracts belong at boundaries, not inside the domain, whose invariants are domain code.

## Status note

This ADR moves to `Accepted` only when D4 is resolved. Until then, GATE 2 is blocked — which is the
intended effect, not an obstacle to route around.
