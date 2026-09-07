# ADR-0005 — Persian-first, RTL-native UI

**Status:** Accepted · **Date:** 2026-09-07

## Context

The initial market is Iran. Persian is the users' language and RTL is their reading direction. The
common approach — build LTR, then add RTL support — produces persistent defects: mis-mirrored icons,
broken bidirectional punctuation, Latin-tuned type scales, and Gregorian week assumptions. These
defects are subtle enough to ship and are read by native users as carelessness.

## Decision

Persian is the source language and RTL is the default direction, from the first line of UI code.
Layout uses CSS logical properties exclusively. Direction, numerals, calendar and typography rules
are canonical in [../design/rtl-accessibility.md](../design/rtl-accessibility.md).

## Consequences

- Physical `left` / `right` layout properties are prohibited and enforced in linting from GATE 2.
- Design tokens use `start` / `end` semantics.
- Type scale is tuned on Persian first.
- Any UI reviewed only with Latin placeholder text is considered unreviewed.
- Adding LTR locales later is a smaller change than the reverse would have been.
- Fonts are self-hosted, not fetched from a foreign CDN — availability as much as performance.

## Rejected alternatives

- **LTR-first with RTL support added later** — the failure mode this ADR exists to prevent.
- **Bidirectional-neutral design** — avoids committing to either direction and serves neither well.
