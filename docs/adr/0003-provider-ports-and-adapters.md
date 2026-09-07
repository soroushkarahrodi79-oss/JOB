# ADR-0003 — External capabilities behind ports and adapters

**Status:** Accepted · **Date:** 2026-09-07

## Context

Every external capability the product needs — identity verification, payment, messaging,
geolocation, business verification, authentication — must be simulated during the prototype and
later replaced by an Iranian provider that has not been selected and has not been researched.

Provider replacement is therefore certain, and the providers' concepts are unknown. A domain that
absorbs a specific provider's model would have to be rewritten, not adapted.

## Decision

All external capabilities are reached through ports declared in domain vocabulary and implemented
by adapters. The domain layer imports no vendor SDK, HTTP client, ORM, or environment variable.
Adapters are selected at a single composition point.

Port contracts include failure modes — rejection, timeout, partial success, unknown outcome — as
domain-level outcomes.

## Consequences

- `MockPaymentProvider` → `SimulatedPaymentProvider` → `RealPaymentProvider` is an adapter change.
- Some indirection where a direct call would be shorter. Accepted deliberately.
- Ports are only created for capabilities with genuine substitution or determinism risk. A port with
  neither is unnecessary indirection and is not created.
- Adding a port requires an ADR.
- Catalogue and rules live in
  [../architecture/provider-boundaries.md](../architecture/provider-boundaries.md).

## Note on the actual risk

The failure mode this ADR is really guarding against is not "we forgot an interface". It is a port
whose *shape* was derived from the convenient mock — typically one that models only success. Such a
port passes review and still forces a rewrite at real integration. Hence the explicit failure-mode
requirement.
