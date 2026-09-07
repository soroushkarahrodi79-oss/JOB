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

### Prototype non-goals — features deliberately excluded

Each of these is a feature that would make the prototype look richer and the thesis weaker. They
were evaluated individually rather than dismissed as a class; several are plausible and one is a
close call.

| Excluded | Why |
| --- | --- |
| **Social feed** | Attention product mechanics on an income product. Serves no decision in any story, and pulls toward the "mini LinkedIn" failure the experience must avoid. |
| **Career coaching** | A different product with a different buyer. The thesis is that a portable record removes the need to re-argue competence, not that the Platform develops it. |
| **Training marketplace** | Plausible adjacency and a real revenue idea — and it makes the Platform a party to what a worker can do, which entangles the neutral-intermediary posture (Q6) for no demo gain. |
| **Chat / messaging between parties** | The closest call. Rejected because the narrower alternative produces **better** evidence: a structured, acknowledged amendment to agreed terms rather than an argument to interpret. This is what decides the dispute in Story C. Notifications go to a `MOCK` outbox instead. |
| **Full payroll, tax filing, invoicing** | Charter non-goal above; Q10 `UNKNOWN`. |
| **Real banking or payment rails** | Charter non-goal; Q5 `UNKNOWN` and severe; D11 unresearched. |
| **Any Platform-held balance or escrow** | Charter non-goal; holding third-party funds is likely regulated (Q5). Present in the truth matrix as a permanent `MOCK` so its absence can be shown honestly. |
| **Real KYC or identity rails** | Q3 `UNKNOWN`. Verification stays `SIMULATED` and stores outcomes only. |
| **Legal verdicts or compliance guidance** | [ADR-0007](../adr/0007-legal-claims-carry-epistemic-status.md). The classification signal is a hypothesis with recorded factors and nothing more. |
| **Machine-learned matching or an AI score** | Destroys success criterion 2 — an unexplainable ranking cannot state why someone was excluded, and cannot be audited for unfair exclusion (Q9). |
| **Hundreds of job categories** | Breadth without depth. A small curated taxonomy for the demo scenarios only (D5's recorded default). |
| **Nationwide coverage** | One city, named neighbourhoods. Claiming national coverage in a prototype with synthetic geography would be an overclaim of exactly the kind the truth matrix exists to prevent. |
| **Evidence media for Proof of Work** | Photographs would be the most persuasive thing in the demo and the least defensible: a new port, an unanswered consent basis (Q4), an unanswered retention rule (Q7), and a moderation surface. Recorded as D17. |
| **Composite trust score, ratings, badges, levels** | Collapses the provenance the four-layer record exists to keep apart, and presents a person primarily as a number. Design principles 2, 6 and 9. |
| **Worker-to-worker features, referrals, growth loops** | No decision, no state, no thesis. |
| **Employer applicant-tracking features** | Persona P2 is not a recruiter and will not operate a pipeline. |
| **Real notifications over SMS or any carrier** | `MOCK` outbox only. No message leaves the system. |
| **Multi-language toggle** | Persian is the source language, not an option ([ADR-0005](../adr/0005-persian-first-rtl-native-ui.md)). A toggle would imply a Latin-shaped product underneath. |

Adding any of these to the prototype requires a decision recorded here, and — where it introduces a
port or changes a truth level — an ADR.

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
