# ADR-0007 — Legal claims carry explicit epistemic status

**Status:** Accepted · **Date:** 2026-09-07

## Context

The product touches employment classification, identity verification, payment facilitation and
personal data — in a jurisdiction where the project has obtained no legal review. Legal reasoning
written in confident prose becomes indistinguishable from validated conclusion within weeks, and is
then relied upon.

The specific risk is an investor-facing prototype implying a compliance position the project cannot
support.

## Decision

Every legal statement in the repository carries an explicit status: `VALIDATED`, `RESEARCHED`,
`HYPOTHESIS`, or `UNKNOWN`. The framework is canonical in
[../legal/legal-architecture.md](../legal/legal-architecture.md); the register is
[../legal/open-questions.md](../legal/open-questions.md).

No legal conclusion may be stated as fact without `VALIDATED` status and a dated reference to
qualified Iranian counsel. AI agents may identify and record legal questions; they may not resolve
them or upgrade their status.

## Consequences

- Everything in the repository today is `HYPOTHESIS` or `UNKNOWN`, and says so.
- Engagement classification is a signal with recorded factors, never a stored verdict — so a
  changed legal analysis reinterprets history rather than invalidating it.
- Investor and marketing materials inherit these labels.
- The product gives no legal advice and asserts no compliance.
- Some claims that would strengthen a pitch cannot be made. That is the point.
