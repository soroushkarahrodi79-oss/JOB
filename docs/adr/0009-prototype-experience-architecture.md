# ADR-0009 — Prototype experience architecture

**Status:** Accepted · **Date:** 2026-09-07
**Scope:** the investor-facing functional prototype. This ADR makes no production commitment.

## Context

GATE 1 must define the complete prototype experience before visual design or engineering begins.
Three failure modes were available and all three are common:

1. **Three disconnected demo worlds** — a worker story, an employer story and an operations story
   built on separate fixtures. Each looks fine; together they prove nothing, because the accumulating
   record that the thesis rests on
   ([../product/charter.md](../product/charter.md)) never actually accumulates.
2. **Screen inflation** — every domain concept gets a screen, the demo runs thirty minutes, and no
   individual screen carries a decision.
3. **Capability drift** — the demo needs a photograph, a chat message, an escrow balance, and each
   is added because it is small, until the prototype quietly asserts capabilities the project has
   explicitly ruled out.

## Decision

**1. One world, three stories.** The prototype has a single coherent synthetic dataset. Story A
(worker), Story B (employer) and Story C (trust/operations) are three traversals of that one world
and cross-reference the same workers, employers, opportunities and engagements. Story C's disputed
engagement is created by Story B. Narratives are canonical in
[../product/demo-scenarios.md](../product/demo-scenarios.md).

**2. Screens justify themselves.** A screen exists only if it creates a new user decision, a new
system state transition, or a distinct investor understanding. A screen that only displays what an
adjacent screen already displays is folded into it. The inventory and the rejection record are
canonical in [../product/screen-inventory.md](../product/screen-inventory.md).

**3. Derived state is seeded as events, never as values.** The demo dataset seeds engagement events.
Worker Passport, reputation, employer trust profile and the Work Graph are computed from them at
demo time. Seeding a reputation figure directly would contradict domain invariant 1 and would make
the prototype's central claim — that the record is evidential — false in the one artifact meant to
demonstrate it.

**4. The following stay out of the prototype**, and their absence is designed rather than pending:
free-form messaging, evidence media (photograph or file) for Proof of Work, any platform-held
balance, any composite trust score, and any machine-learned ranking. Each is replaced by a
narrower mechanism that produces better evidence: a structured engagement amendment instead of
chat, structured completion fields instead of photographs, a recorded employer commitment instead
of escrow, component metrics with visible sample sizes instead of a score, and deterministic rule
evaluation instead of a model.

**5. New truth-matrix rows** covering the Work Graph projection, the in-product truth ledger, the
notification outbox surface, structured engagement amendment, and the demo scaffolding are added in
this change, per the change-control rule that assigning a capability's truth level requires an ADR.
Statuses are canonical in [../demo-truth-matrix.md](../demo-truth-matrix.md). No previously
recorded target truth level is changed by this ADR.

## Consequences

- The dataset is a build input with a generator, not a fixture file. Its specification is
  [../product/demo-dataset.md](../product/demo-dataset.md).
- Because reputation is computed, a demo whose numbers look wrong is evidence of a domain defect
  rather than a content edit. This is intended.
- Decision 4 costs the demo some visual appeal. A photograph of completed work is more persuasive
  than three structured fields. It is also a storage port, a retention question (Q7), a consent
  question (Q4), and a moderation surface — none of which the project can currently discharge.
- Decision 2 means some concepts in the domain model have no screen of their own. Preferred Crew is
  demonstrated by its effect on a later candidate list, not by a roster page.
- The single-world constraint means changing one story's data changes the others. That coupling is
  the point; it is what makes the Work Graph observable.

## Rejected alternatives

- **Per-story fixtures** — simpler to build, and it would make the accumulation claim unfalsifiable.
- **A Work Graph visualisation screen** — visually striking, advances no decision, and would present
  a derived projection as a product feature the charter does not claim.
- **A generic admin console** — operations tooling is scoped to the case review Story C requires.
  Anything broader is speculative surface, and it is personal-data surface (persona P3).
