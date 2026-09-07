# Provider Boundaries

> **Canonical for:** the port catalogue, adapter naming, and substitution rules.
> **Not canonical for:** layering rules (see [system-architecture.md](system-architecture.md)) or
> truth status (see [../demo-truth-matrix.md](../demo-truth-matrix.md)).
> **Status:** Draft. Decision recorded in [ADR-0003](../adr/0003-provider-ports-and-adapters.md).

Every external capability is reached through a port. No exceptions, including ones that look
trivial today.

## Port catalogue

| Port | Abstracts | Gate 0 intent | Substitution risk |
| --- | --- | --- | --- |
| `IdentityVerificationPort` | Establishing that a person is who they claim | `SIMULATED` | **High.** Real Iranian identity rails are state-linked; data-handling obligations are unknown. |
| `BusinessVerificationPort` | Establishing that an employer is a real, registered business | `SIMULATED` | **High.** Registry access model unknown. |
| `PaymentPort` | Initiating and settling a transfer | `SIMULATED` | **High.** Rails, settlement timing and failure semantics differ sharply by provider. |
| `MessagingPort` | Delivering a message to a person (SMS or in-app) | `MOCK` | Medium. Delivery guarantees vary. |
| `GeolocationPort` | Places, distance, and address resolution | `SIMULATED` | Medium. Coverage and administrative divisions vary by provider. |
| `AuthenticationPort` | Establishing a session for a returning user | `SIMULATED` | Medium. Coupled to `MessagingPort` if OTP-based. |
| `ClockPort` | Current time | `FUNCTIONAL` | None. Exists for determinism and testability, not portability. |
| `IdGeneratorPort` | Identifier generation | `FUNCTIONAL` | None. Same reason. |

`ClockPort` and `IdGeneratorPort` are the only ports that abstract nothing external. They are
included because non-determinism in the domain makes both tests and demos unreliable. Every other
port earns its place by abstracting a real substitution risk.

## Adapter naming

`Mock…`, `Simulated…`, `Real…` — the prefix is the truth level from
[../demo-truth-matrix.md](../demo-truth-matrix.md). Example:
`MockPaymentProvider` → `SimulatedPaymentProvider` → `RealPaymentProvider`.

The name must make an untruthful demo obviously untruthful in the codebase. A `Simulated` prefix
that has quietly become real, or vice versa, is a defect.

## Rules

1. **Ports are defined in domain vocabulary.** `PaymentPort.settle(engagementId, amount)` — not
   `gatewayCallbackToken`. If a port's interface mentions a vendor's concept, the boundary has
   already failed.
2. **No adapter type escapes its adapter.** Vendor DTOs are translated at the boundary.
3. **Failure is part of the contract.** Every port declares its failure modes — rejection, timeout,
   partial success, unknown outcome — as domain-level outcomes. This is the part usually skipped,
   and the part that causes a real integration to become a rewrite: a domain that never modelled
   "the payment outcome is unknown" cannot be given a real payment provider.
4. **Simulated adapters implement the full contract, including failure paths.** See the anti-gaming
   clause in the truth matrix.
5. **Simulated adapters use unmistakably fictional provider identities.** No real bank, registry,
   carrier, or map provider is named anywhere.
6. **Adding a port requires an ADR.** Ports are architectural surface.
7. **No credentials, endpoints or provider accounts exist in this repository at any gate before a
   real integration is formally approved.**

## Non-ports

Not everything external deserves a port. A port for a capability with no substitution risk and no
determinism problem is unnecessary indirection. Logging, for example, gets no port until there is
a reason.

## Open

Which real Iranian providers are candidates for each port is **not decided and not researched**.
Recording candidate vendors now would be speculation. Tracked as D11 in
[../open-decisions.md](../open-decisions.md), and as Q3, Q5 and Q11 in
[../legal/open-questions.md](../legal/open-questions.md).
