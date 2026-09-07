# ADR-0006 — Single-source-of-truth documentation

**Status:** Accepted · **Date:** 2026-09-07

## Context

This repository is the durable source of truth for the project. Documentation sets that restate the
same concept in several places diverge — and when they do, nobody knows which copy is authoritative.
The risk is higher with AI agents, which readily generate plausible restatements of existing content.

## Decision

Every project concept has exactly one canonical document. Other documents reference it and do not
restate it. Ownership is recorded in [../README.md](../README.md), together with the deliberate
non-overlaps between documents that would otherwise duplicate.

Every canonical document declares what it is and is not canonical for.

## Consequences

- Adding documentation begins by checking the ownership map.
- Duplication is a reviewable defect, not a style preference.
- Some reading requires following a link rather than finding everything in one place. Accepted:
  a correct pointer beats a stale copy.
- `CLAUDE.md` routes to canonical sources rather than restating project knowledge — otherwise the
  agent instruction file becomes the largest duplication in the repository.
- A duplication and contradiction audit is an exit criterion of every gate that changes documentation.
