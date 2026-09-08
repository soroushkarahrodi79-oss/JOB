# Opportunity Card

> **Canonical for:** the Opportunity Card's content, hierarchy, variants, behaviour and
> anti-patterns.
> **Not canonical for:** what an Opportunity is (see
> [../../domain/domain-model.md](../../domain/domain-model.md)), the screens it appears on (see
> [../../product/screen-inventory.md](../../product/screen-inventory.md)), state rendering (see
> [../state-vocabulary.md](../state-vocabulary.md)), or match explanation (see
> [explanation.md](explanation.md)).
> **Status:** Draft.

The card is the worker's decision surface. Persona P1 is on a phone, in transit, with minutes. The
card's job is to let her decide whether this shift is worth opening — and, on W-02, whether it is
worth accepting — **without tapping anything to find out a term.**

It appears on W-01 (feed), inside W-02 as the terms block, on E-04 as the header the candidate list
is about, and in SH-03 beside an invitation.

## Required content

Every item below is rendered on every card, at every width, without interaction. Nothing on this list
is behind a disclosure, a hover, an expansion, a second screen, or a scroll on `compact`.

| # | Content | Notes |
| --- | --- | --- |
| 1 | **Eligibility state for this worker** | The margin marker on the card. `Eligible`, `Conditional` or `NotEligible`, per [../state-vocabulary.md](../state-vocabulary.md) |
| 2 | **What the work is** | The employer's own words, not a category label |
| 3 | **Who the employer is** | Business name, with its verification provenance mark |
| 4 | **When** | Jalali date, weekday, start–end, and duration as one unit |
| 5 | **Where** | Neighbourhood, and distance with its `SIMULATED` chip |
| 6 | **Pay** | Amount in Toman, its unit, and its basis (per shift, per hour) |
| 7 | **Requirements** | Each named, each marked met or unmet, each with the basis that satisfies it |
| 8 | **Positions** | Filled of total, as «X از Y» |
| 9 | **Acceptance mode** | Invite-only or open acceptance. It changes what the action does |

Item 7 is the card's distinguishing content and the reason the card is taller than a marketplace
listing would be. Requirements are the product; a card that summarises them as a count has removed
the thing the worker is being asked to trust.

Where the card cannot fit all requirements, it renders the unmet ones in full, the met ones as
«۳ شرط برآورده شده» with the list one tap away — never the reverse. An unmet requirement is never
summarised.

## Optional content

Rendered when the data exists, omitted silently when it does not. Never a placeholder, never a dash.

- The employer's payment reliability, as the three-question subset from
  [employer-trust-profile.md](employer-trust-profile.md).
- A prior-relationship line, where one exists ([explanation.md](explanation.md)).
- The employer's note about the work.

## Hierarchy at `compact`

Reading order in Persian is right to left, then down. The vertical order is:

```
[margin marker: eligibility]  عنوان کار
                              نام کارفرما  ⟨provenance mark⟩
                              ─────────────────────────────
                              پنجشنبه ۱۵ شهریور · ۱۶:۰۰ تا ۲۲:۰۰ · ۶ ساعت
                              سعادت‌آباد · ۴٫۲ کیلومتر  ⟨SIMULATED⟩
                              ─────────────────────────────
                              ۹۸۰٬۰۰۰ تومان          ← type.amount
                              برای کل شیفت
                              ─────────────────────────────
                              شرایط:  ⟨each with its mark and basis⟩
                              ─────────────────────────────
                              ۱ از ۲ جایگاه پر شده · فقط با دعوت
                              [ action ]
```

**Pay is the largest element on the card** (`type.amount`, once per surface). Time is second. This
order is not obvious and it is deliberate: a worker filters on whether she can *be there* before she
evaluates the money, but she remembers the card by the money — so time is read first in the layout
flow and pay dominates optically.

**The eligibility marker sits in the margin, at the top**, so a column of cards is scannable by
eligibility down the inline-start edge without reading any of them.

## Variants

### Eligible

As above. One primary action.

### Conditional

Identical, plus a line naming the condition and what satisfies it: «برای پذیرش، احراز هویت لازم
است». The action is present and leads to W-03; it is not disabled. A disabled action with an
explanation elsewhere is the pattern this card exists to avoid.

### Not eligible

**The same card. Not greyed out.**

Contrast minimums apply unchanged — dimming an excluded person's opportunity, or an excluded worker
on E-04, is a dignity failure that also breaks contrast. What changes is:

- the margin marker becomes the `NotEligible` rule mark, `neutral`;
- **one** unmet requirement is named, with what would satisfy it (D9, and
  [../../product/experience/matching.md](../../product/experience/matching.md) explanation rule 3);
- the primary action is replaced by a route to what the requirement means. It is not a disabled
  button.

On E-04 the excluded candidates appear in a separate, explicitly non-ranked group, per the screen
inventory. They are not sorted, not scored, and not positioned as weaker — they are a category.

### Invitation

On SH-03 and at the top of W-02 when the worker was invited. Adds the response window as an
`attention` state, and states what happens when it elapses **before** the action, not after.

## Collapsed and expanded

**There is no accordion on this card.** The feed card is complete for the decision it supports —
whether to open the opportunity — and W-02 is the expanded form. It is a screen, not a disclosure.

The reason is persona P1. A worker comparing three shifts on a phone should not also be managing
three accordion states, and an accordion's closed state is where terms go to be unread. The screen
inventory makes the same call by folding the eligibility explanation into W-02 rather than splitting
it.

The one disclosure the card permits is the met-requirements list described above, and only because
its closed state states a fact («۳ شرط برآورده شده») rather than hiding one.

## Mobile behaviour

- Full width, `radius.none`, separated by `border.hairline`. Not a floating card in a scroll — a row
  in a record.
- The provenance margin collapses to leading markers ([../foundations.md](../foundations.md)).
- The primary action is inline on the feed card. On W-02 it may be sticky, and if it is, the sticky
  bar reserves scroll padding equal to its height so a focused control is never obscured
  (WCAG 2.2, 2.4.11).
- Touch targets 44 × 44. The whole card is not a tap target: the title is the link, so the card can
  contain other controls without ambiguity.

## RTL behaviour

- The margin is at `inline-start` — the right edge in Persian — and every offset is logical.
- The distance figure, the amount and the duration are Persian digits with tabular figures.
- The Latin-run isolation rule applies to any technical string; on worker and employer surfaces there
  should be none, because internal identifiers are not shown to them.
- The date, the time range and the duration are bound so a line break cannot separate a number from
  its unit.
- Long Persian work titles wrap to a second line. The title never truncates and the card never sets
  a fixed height. A fixed-height card is how this component would break in Persian.

## Status treatment

The card carries at most **one** state at banner weight, and it is the eligibility state. Everything
else — positions remaining, acceptance mode, response window — is `inline`.

The `SIMULATED` chip on distance is the only truth chip on a normal card. It attaches to the distance
figure, not to the card.

## Actions

**One primary action per card.** On W-01 it opens W-02. On W-02 it accepts, and the accept action
sits *below* the full terms and requirements — never above them (principle 8; see
[../foundations.md](../foundations.md) content hierarchy).

Secondary actions are text links, not buttons. There is no share, no save, no favourite, no hide, no
report: none is in the screen inventory, and each would be a navigation destination added by
convention.

## Anti-patterns

Each has been seen in this product category and each is prohibited here.

| Anti-pattern | Why |
| --- | --- |
| Any term behind hover or a tooltip | Hover does not exist on the primary device; principle 3 |
| Pay shown as a range, a "from", or an estimate | The figure is the committed figure ([../typography.md](../typography.md)) |
| Pay or requirements truncated with an ellipsis | Never truncate a term or an amount |
| A match percentage, a fit score, or a star rating | Domain: no composite exists ([../../product/experience/matching.md](../../product/experience/matching.md)) |
| A greyed-out ineligible card | Dignity failure and a contrast failure |
| Urgency framing — "۳ نفر در حال مشاهده", a countdown | Principle 8 |
| An employer logo dominating the card | The employer's record is the signal, not their brand |
| Card shadows and full rounding | Reads as marketplace listing; [../foundations.md](../foundations.md) |
| Requirements summarised as a count when any is unmet | The unmet requirement is the decision |
| The whole card as one tap target | Ambiguous with any control inside it |
| Fixed card height | Breaks on Persian |
| An "apply" action on a card the worker is not eligible for | Invites effort that will be refused |
