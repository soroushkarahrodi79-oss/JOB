# ADR-0008 — Prototype application stack

**Status:** Accepted · **Date:** 2026-09-07
**Scope:** the functional prototype. This ADR makes no production commitment.

**Revision note:** an earlier `Proposed` revision of this record coupled stack acceptance to the
unresolved production hosting and data-residency decision. That coupling was incorrect and is
corrected here. The record was never `Accepted` and was never built upon, so it is revised in place
rather than superseded — immutability binds accepted ADRs only ([README.md](README.md)). The
filename retains its original slug so existing links stay valid.

## Context

The earlier revision treated six distinct concerns as one, and blocked the entire engineering gate
on the most distant and least resolvable of them. Separating them:

| # | Concern | Horizon | Resolvable now? |
| --- | --- | --- | --- |
| 1 | Development / application stack | Prototype | Yes |
| 2 | Runtime portability | Prototype and production | Yes, as a constraint |
| 3 | Dependency supply-chain availability | Build time, all gates | Partially; mitigated, not solved |
| 4 | Prototype deployment | Prototype | Yes |
| 5 | Production hosting topology | Production | No |
| 6 | Production personal-data residency | Production | No — depends on Q8 |

Concerns 1, 2 and 4 do not depend on 5 and 6. The prototype processes **synthetic demo data only**
([../product/demo-scenarios.md](../product/demo-scenarios.md)), so no personal-data residency
obligation attaches to it. Blocking the stack on concern 6 therefore blocked the domain layer, the
ports, and the tests — none of which touch hosting — on a question that cannot be answered until
legal review exists.

## Decision

**Accepted for the functional prototype:** Next.js, React, strict TypeScript, pnpm, PostgreSQL,
Drizzle ORM, Tailwind CSS, Zod, Vitest, Playwright.

Acceptance is bound by the following constraints. They are the decision, not commentary on it.

1. **No proprietary host is selected.** Vercel or any other managed platform is neither chosen nor
   excluded. Selecting one is a separate decision (D13) requiring its own ADR.
2. **Generic deployability is a standing requirement.** The application must build and run on a
   generic Node.js runtime and in a plain Docker container, with PostgreSQL reachable over a
   standard connection string.
3. **No platform-specific runtime coupling without a new accepted ADR.** This covers, at minimum:
   platform edge runtimes, platform-managed KV/blob/queue services, platform image-optimisation
   services, and any deployment-platform SDK. Portability is verified by a build-and-run check in
   CI from the gate that introduces CI, not by review discipline.
4. **No foreign CDN in the critical path.** Fonts and assets are self-hosted
   ([ADR-0005](0005-persian-first-rtl-native-ui.md)).
5. **Prototype data is synthetic and demo-only**, per the demo-data policy in
   [../product/demo-scenarios.md](../product/demo-scenarios.md). That policy is a precondition of
   this acceptance, not a style preference: real data would attach a residency obligation the
   project cannot currently discharge.
6. **Drizzle stays behind the persistence boundary.** The domain layer imports no ORM type
   ([ADR-0003](0003-provider-ports-and-adapters.md)). Schema authoring is deferred to GATE 3, after
   the domain exists, so that persistence is derived from the domain rather than the reverse.
7. **Zod validates at boundaries.** Domain invariants are domain code, not schema assertions.

## What this ADR does not decide

Production hosting topology (D13) and production personal-data residency (D14) remain unresolved
and **must not be inferred** from this acceptance. Choosing a prototype stack is not a production
architecture commitment. D14 constrains D13; neither is answerable until Q8 and Q11 are.

## Supply chain: mitigated, not solved

The npm registry is a foreign dependency of the **build**. This is a software supply-chain
availability and integrity concern. It is not, by itself, a production runtime or data-residency
concern, and the earlier revision was wrong to treat it as one.

It is also not solved. Recorded as D15, with these resilience requirements to be satisfied within
GATE 2:

- A committed lockfile pinning exact versions and integrity hashes.
- A build that is reproducible from a known-good dependency set without live registry access.
- A dependency budget: each direct dependency is justified, because every one enlarges this surface.

Sanctions and export-control exposure on foreign registries and services is Q11 and is not resolved
by any of the above.

## Consequences

- **GATE 2 is unblocked.** It was blocked on a production question it never depended on.
- Constraint 3 shifts the real risk from "wrong framework" to "incremental proprietary coupling",
  which is where it always was. Framework gravity pulls toward the managed platform by default;
  constraint 3 makes that a decision instead of a drift.
- The stack constrains the UI and persistence layers only. Domain and ports stay
  framework-independent by [ADR-0002](0002-pragmatic-modular-monolith.md) and
  [ADR-0003](0003-provider-ports-and-adapters.md).
- Adopting a managed platform later remains possible, as an explicit ADR, not as an accident.
