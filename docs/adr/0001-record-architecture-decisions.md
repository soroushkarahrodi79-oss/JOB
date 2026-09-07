# ADR-0001 — Record architecture decisions

**Status:** Accepted · **Date:** 2026-09-07

## Context

The project will be developed over time by humans and AI agents. Without a decision record,
established boundaries erode silently: an agent or a contributor makes a locally reasonable choice
that contradicts an earlier one, and nobody notices until the contradiction is expensive.

## Decision

Architectural decisions that materially change established boundaries are recorded as ADRs in
`docs/adr/`. Accepted ADRs are immutable and are superseded rather than edited.

## Consequences

- Reversing a decision requires stating why, in writing.
- `CLAUDE.md` and `AGENTS.md` require agents to check ADRs before changing boundaries.
- Some overhead on genuine architectural changes. Accepted: this is a small cost against silent drift.
- Governance rules are detailed in [README.md](README.md).

## Rejected alternatives

- **Decisions in commit messages** — unsearchable and unreviewable as a set.
- **A single running decision log** — accumulates edits, losing the immutability that gives the
  record its value.
