# Navigation Architecture

> **Canonical for:** navigation behaviour for each actor, and the destinations each actor's chrome
> contains.
> **Not canonical for:** the screens, their IDs or their transitions (see
> [../product/screen-inventory.md](../product/screen-inventory.md)), or responsive rules (see
> [foundations.md](foundations.md)).
> **Status:** Draft.

## The rule

**A navigation destination exists only if the screen inventory makes it an entry point.** Everything
else is reached from the work item it concerns.

This is [ADR-0009](../adr/0009-prototype-experience-architecture.md) decision 2 applied to chrome:
if a screen has to justify itself against a new decision or state transition, a *permanent link* to
it has to justify itself twice. Most conventional destinations — settings, help, search, saved items,
messages, a dashboard — fail that test here, and each is listed at the end with the reason.

The three actors get three different structures, because they are doing three different things.

---

## Worker

**A bottom bar with exactly three destinations.** Bottom because persona P1 is one-handed and in
transit; three because the inventory has three worker entry points and no more.

| Destination | Screen | Why it is chrome rather than a link |
| --- | --- | --- |
| «کار» | W-01 — feed and my work | The home. Discovery and her own engagements are one thing to a worker checking between shifts |
| «کارنامه» | W-08 — Worker Passport | The thing the product claims she owns. Reachable at all times or the claim is weaker |
| «پیام‌ها» | SH-03 — Notification Outbox | Where invitations arrive, and it carries its `MOCK` label |

Everything else is a push from W-01 or from a notification: W-02, W-03, W-04, W-05, W-06, W-07, W-09.
Each is about a specific opportunity or engagement and is meaningless without it, so none is a
destination.

**No tab for a profile, settings, search, or earnings.** W-08 is the profile. There are no settings in
the inventory. Search is not in the inventory and would be a different product — the worker is
invited or she browses an explained feed, and a search box would invite the keyword matching the
product replaces. Earnings live on the engagements they came from, because a detached earnings total
is a figure without provenance.

**Back points to the right** in Persian, because reading advances leftward
([foundations.md](foundations.md), directional icons).

The bar hides on no screen and is never replaced by a full-screen flow. There is no wizard, no step
counter, and no screen a worker can be stuck in.

---

## Employer

**A slim rail at the inline start** at `wide` and `regular`, collapsing to a top bar at `compact`.
Three destinations and one action.

| Item | Screen | Kind |
| --- | --- | --- |
| «کارها» | E-01 — employer home | Destination |
| «نمایهٔ اعتماد» | E-08 — Employer Trust Profile | Destination |
| «پیام‌ها» | SH-03 | Destination |
| «فرصت جدید» | E-02 | **Action**, not a destination |

E-04, E-05, E-06, E-07 and E-09 are never in the chrome. Each is about a specific opportunity or
engagement; a candidate list with no opportunity is not a screen.

**E-01 is a queue, not a dashboard.** It lists what is waiting on this employer and how long it has
been waiting. Design principle 3 rules out dashboards as a default, and the concrete consequence is
that E-01 has no KPI row, no charts, no counts strip, and no "welcome back".

`attention` is applied **only to submitted proof decisions awaiting explicit employer action** —
and not to every open item. An employer home in which everything is ochre is an employer home in
which nothing is, and it also misrepresents a live engagement proceeding normally as something
demanding a response.

**E-08 is in the chrome deliberately.** An employer's own trust profile placed behind a work item
would be findable only when something had gone wrong. Putting it beside the queue is what makes the
reciprocity structural rather than technically available.

---

## Operations

**No navigation chrome.** One destination and a breadcrumb.

OPS-01 is the queue. OPS-02 is entered from a case; OPS-03 from OPS-02; both exit back to OPS-01. A
case has one path through it and the chrome should say so.

This is the strongest anti-console statement available and it is cheap to hold: the screen inventory
rejected the audit view and the system-health console explicitly, and a rail with room for future
destinations is how one of them would arrive.

The operator's context — which case, which parties, which engagement — renders as a breadcrumb that
is a trail, not a menu. Nothing in operations is reachable except through a case.

---

## Shared

### The demo bar — SH-01

Actor switching is demo scaffolding, not a product feature (truth-matrix row 21), and the chrome has
to say so without being told.

It renders as a **distinct bar pinned to the block start**, using the hatched treatment reserved for
truth labelling ([color.md](color.md)). It is visually not product chrome: different ground,
different edge, and a standing label naming it as a demo mechanism that does not exist in a real
deployment.

It is the one place internal identifiers appear outside operations, because it is the one place they
are the working reference.

### The truth ledger — SH-02

**Not a navigation destination in any actor's chrome.** It is reached from *any* truth chip, and that
is the mechanism the screen inventory specifies: a reviewer who notices a `SIMULATED` label goes from
that label to the full picture. A menu entry would be a weaker path and would make the chip
decorative.

It is also reachable from the demo bar, for the operator opening or closing the demo.

---

## Destinations deliberately absent

Recorded so that adding one is visibly a decision.

| Absent | Why |
| --- | --- |
| Settings / preferences | Not in the inventory. No setting in the prototype changes behaviour |
| Help / support | Not in the inventory. WCAG 2.2 3.2.6 requires consistent help *where help exists*; inventing a help surface to satisfy it would be building an unspecified product surface |
| Search | Not in the inventory, and keyword search over people is the mechanism eligibility-first matching replaces |
| Saved / favourites / hidden opportunities | Not in the inventory; and hiding an opportunity would make the explained feed unexplainable |
| Messages / chat | Deliberately not built ([ADR-0009](../adr/0009-prototype-experience-architecture.md) decision 4). The outbox is `MOCK` and is not a conversation |
| Employer dashboard / analytics | Principle 3; E-01 is a queue |
| Preferred Crew roster | Rejected in the inventory: the effect on a candidate list is stronger evidence than a list page |
| Work Graph view | Rejected in the inventory; presents a projection as a feature |
| Operations audit console | Rejected in the inventory; the case event history is the audit view |
| Account / deletion | Deliberately undefined — D7's recorded gap, not an oversight. A control implying it works would be worse than its absence |
