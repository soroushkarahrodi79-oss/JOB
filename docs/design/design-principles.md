# Design Principles

> **Canonical for:** product design values and the decision rules derived from them.
> **Not canonical for:** tokens and component governance (see [design-system.md](design-system.md)),
> RTL and accessibility requirements (see [rtl-accessibility.md](rtl-accessibility.md)).
> **Status:** Draft.

Principles are only useful when they can settle an argument. Each one below states what it rules
out.

## 1. Honesty over polish

If a capability is simulated, it says so where it is used.

*Rules out:* a convincing screenshot of a fake bank connection; a disclaimer parked on an About page.

## 2. Explain the decision

When the system includes, excludes, or ranks someone, it states why in the user's language.

*Rules out:* opaque match scores; silent filtering; "no results" without a reason.

## 3. Legible under pressure

The primary users are on a phone, in a hurry, possibly on site. Scanability beats density.

*Rules out:* dashboards as a default; multi-column layouts as the mobile baseline; information
that requires comparison across scroll positions.

## 4. Persian-first, not translated

Persian is the source language. Layout, typography and content structure begin from Persian.

*Rules out:* designing in English and mirroring; layouts that only work at Latin text lengths;
Persian as a language toggle over a Latin-shaped product. See [rtl-accessibility.md](rtl-accessibility.md).

## 5. Earned effort

Ask for effort only where the user can see the return. Verification is incremental, deferrable,
and visibly connected to what it unlocks.

*Rules out:* mandatory full verification at signup; long forms before any value is delivered.

## 6. Evidence over assertion

Show the record, not a claim about the record. Show what was verified, by whom, and when.

*Rules out:* badges without provenance; a single trust score standing in for a history;
five-star averages with no basis.

## 7. Respect the cost of the connection

Data and battery cost the user money. Weight is a design decision.

*Rules out:* decorative media; heavy font payloads; blocking spinners over slow networks.

## 8. No dark patterns

The Platform mediates income. Manipulation here has material consequences.

*Rules out:* artificial urgency; obstructed cancellation or deletion; pre-checked consent;
consequential actions styled as trivial ones.

## 9. Dignity

Workers are not inventory. Employers are not marks.

*Rules out:* leaderboards; punitive-toned status language; presenting a person primarily as a score.

## Conflict resolution

When principles collide, the order is: **1 (honesty) → 8 (no dark patterns) → 9 (dignity) →
2 (explain) → everything else.** Honesty is never traded away, including for investor appeal.
