# Product Charter

> **Canonical for:** the problem, the thesis, scope boundaries, non-goals, success criteria.
> **Not canonical for:** actors (see [personas.md](personas.md)), capabilities (see
> [../demo-truth-matrix.md](../demo-truth-matrix.md)), legal posture (see
> [../legal/legal-architecture.md](../legal/legal-architecture.md)).
> **Status:** Draft.

## Naming

The product has no confirmed name. Documents refer to it as **the Platform**. The repository
name `JOB` is incidental and is not a product name. See [../open-decisions.md](../open-decisions.md) D8.

## Problem

Short-duration work in Iran is coordinated informally: personal networks, messaging groups,
walk-ins, and word of mouth. This produces three failures.

1. **Workers cannot carry their record.** Reliability demonstrated at one employer is invisible
   to the next. Every engagement restarts trust from zero, so the worker is repeatedly priced
   as an unknown.
2. **Employers cannot assess suitability before committing.** Screening cost is high relative to
   a short engagement, so employers under-hire, over-rely on known contacts, or accept bad matches.
3. **Neither side has a durable record of what happened.** Attendance, completion and payment are
   contested from memory.

## Thesis

The Platform is **flexible-work infrastructure**, not a listings board and not a bidding
marketplace.

Its distinguishing bet is that a **portable, verified work record** — the Worker Passport —
plus **eligibility-first matching** produces better matches at lower screening cost than either
open listings (which push cost onto employers) or price bidding (which pushes quality down).

Two consequences follow, and both are load-bearing:

- Matching starts from **eligibility**, not from price or from relevance ranking. A worker who
  cannot lawfully, physically, or temporally perform an engagement is not shown as a weaker
  candidate; they are not a candidate.
- The record is only worth carrying if it is **evidenced**. This is why Proof of Work exists,
  and why identity and business verification are structural rather than cosmetic.

## Why Iran first

Iran is chosen deliberately, not incidentally. The market has significant informal short-duration
labour, high mobile penetration, and weak portable-reputation infrastructure. It also has
constrained access to foreign payment, identity, and cloud providers.

This constraint is treated as an architectural input, not an obstacle: it forces
**provider portability** from the first day. See [../architecture/provider-boundaries.md](../architecture/provider-boundaries.md).

## In scope for the prototype

Demonstrating the concept end-to-end with realistic Iranian demo data, at the truth levels
declared in [../demo-truth-matrix.md](../demo-truth-matrix.md).

## Explicit non-goals

The Platform is **not**:

- a general freelance marketplace competing on price,
- a staffing agency or employer of record,
- a payroll or tax-filing product,
- a payment institution, escrow agent, or holder of third-party funds,
- a background-check or credit-scoring bureau,
- a full-time recruitment product.

The prototype is additionally **not**:

- a production system,
- evidence of regulatory compliance,
- connected to any real provider, registry, or payment rail.

## Success criteria for the prototype

The prototype succeeds if a competent, sceptical reviewer can:

1. traverse the demo scenarios end-to-end without being misled about what is real,
2. state, from the product itself, why a given worker was or was not eligible,
3. see a Worker Passport whose contents are traceable to recorded events rather than asserted,
4. identify which capabilities are simulated, without being told,
5. conclude that replacing a simulated provider with a real one is an adapter change, not a rewrite.

Criterion 4 is the honesty test. Criterion 5 is the architecture test. Both are gate-blocking.

## What would falsify the thesis

Recorded here so the project can be wrong in a useful way:

- Employers screen on price and availability and ignore the Passport.
- Workers will not complete verification for short-duration work; the Passport stays empty.
- Eligibility rules are so employer-specific that a shared model is worthless.
- Proof of Work is felt as surveillance and suppresses supply.
