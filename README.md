# JOB — Flexible-Work Marketplace (Prototype)

An investor-grade functional prototype of flexible-work infrastructure for Iran, connecting people
seeking short-duration work with businesses that need reliable workers.

## Status

**GATE 4 — PROTOTYPE SURFACE (in progress).** GATE 3 closed `DOMAIN_IMPLEMENTATION_LOCKED` on
2026-09-09. GATE 4 entry is ready on explicitly human-authorised, **prototype-only** defaults for
D16 (acceptance mode) and D18 (employer response window); both decisions remain **OPEN** and
neither default is a production or pilot policy. See
[docs/acceptance-gates.md](docs/acceptance-gates.md) and
[docs/open-decisions.md](docs/open-decisions.md).

**What exists today:**

- The domain model, eligibility and classification rules, and provider ports, implemented and
  tested (GATE 3).
- Deterministic **simulated** and **mock** adapters behind those ports, and reproducible synthetic
  demo data. No adapter contacts a real external service.
- A pnpm workspace, strict TypeScript, linting, test runners, a self-hosted font, and the token and
  design-system-primitive layers (GATE 2 / GATE 1.5).

**What does not exist yet:** product screens. GATE 4 — composing the primitives into a
Persian-first, RTL-native prototype surface over the domain — has not been built. There is still
no database; the prototype's data is synthetic and in-repo.

## Start here

| If you want to know… | Read |
| --- | --- |
| What the product is and is not | [docs/product/charter.md](docs/product/charter.md) |
| What the prototype demonstrates, screen by screen | [docs/product/screen-inventory.md](docs/product/screen-inventory.md) |
| What the investor demo looks like | [docs/product/investor-narrative.md](docs/product/investor-narrative.md) |
| What it looks like, and why | [docs/design/visual-language.md](docs/design/visual-language.md) |
| Where every concept is documented | [docs/README.md](docs/README.md) |
| What is real, simulated, mocked or planned | [docs/demo-truth-matrix.md](docs/demo-truth-matrix.md) |
| Why the architecture looks like this | [docs/adr/](docs/adr/README.md) |
| What has deliberately not been decided | [docs/open-decisions.md](docs/open-decisions.md) · [docs/legal/open-questions.md](docs/legal/open-questions.md) |

## Two things to know before reading anything else

1. **Nothing here is a real integration.** Identity verification, business verification and
   location matching are `SIMULATED`; payment settlement and messaging/SMS are `SIMULATED` or
   `MOCK` — deterministic in-repo stand-ins with no connection to a real provider, bank, registry
   or carrier. No funds move and no message leaves the system. Truth levels are defined and tracked
   per capability in [docs/demo-truth-matrix.md](docs/demo-truth-matrix.md); nothing in this
   repository may be presented as a real integration.
2. **Nothing here is validated legal advice.** The project holds no legal conclusions. Every legal
   statement carries an explicit epistemic status.

## Contributing

Read [CLAUDE.md](CLAUDE.md) first — it applies to human and AI contributors alike.
