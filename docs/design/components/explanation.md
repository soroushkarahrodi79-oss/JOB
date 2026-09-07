# Match Explanation and Prior Relationship

> **Canonical for:** how the UI explains inclusion, ordering and exclusion, and how a prior
> relationship appears in a candidate decision.
> **Not canonical for:** the matching pipeline or the explanation content rules (see
> [../../product/experience/matching.md](../../product/experience/matching.md)), Preferred Crew's
> meaning (see [../../domain/domain-model.md](../../domain/domain-model.md)), or the Work Graph
> (same).
> **Status:** Draft.

The pipeline, its seven stages, their order and the three kinds of explanation are owned by
[../../product/experience/matching.md](../../product/experience/matching.md). This document decides
how they are rendered, and its whole job is to make an explanation **scannable** — because an
explanation nobody reads has the same effect as no explanation.

## The ladder

The explanation renders as a vertical ladder of the seven stages, in their fixed order, at the inline
start. It is the same component wherever a match is explained: E-04 rows, E-05, W-02, W-01.

Two visual kinds, and the distinction is the product:

| Kind | Rail | Meaning |
| --- | --- | --- |
| **Filter** — stages 1–3 | Solid | Decided whether this person is a candidate at all |
| **Ordering** — stages 4–7 | Dotted | Decided only where they sit |

A reader learns in one screen that solid rails are binary and dotted rails are not, which is domain
invariant 4 made visible. It is also what stops the ladder from reading as a scoring breakdown: the
two halves are visibly different kinds of statement, which is
[../../product/experience/matching.md](../../product/experience/matching.md)'s demonstration
requirement 3.

Each rung carries the stage name, its outcome as a sentence, and the provenance mark of the fact the
sentence names. Provenance travels with the reason — «کارت سلامت دارد (خوداظهار)» and «کارت سلامت
دارد (تأییدشده — شبیه‌سازی‌شده)» are different statements and are never rendered identically.

## Progressive disclosure, done honestly

A full seven-rung ladder on every candidate row would be unreadable. The rule that makes compression
safe:

**The top reason is always rendered. The ladder is what expands.**

- On an **E-04 row**: the eligibility state, plus one ordering sentence naming the stage that put
  this candidate here — «جلوتر به‌دلیل سابقهٔ همکاری — ۱ همکاری کامل‌شده با شما». Always visible,
  never behind hover.
- **«چرا این نتیجه؟»** expands the full ladder in place. It is a disclosure whose closed state states
  a fact rather than hiding one, which is the only kind this system permits
  ([opportunity-card.md](opportunity-card.md)).
- On **E-05** and **W-02**, the ladder is expanded by default. Those screens exist to be read.

## Exclusion

Rendered differently, and the difference is deliberate.

An excluded candidate's ladder shows **only the stage that excluded them**, with the single unmet
requirement and what would satisfy it. The passed stages are summarised as one line. There is no
expansion that reveals more.

This is not compression for space. Enumerating everything a person lacks is a dignity failure
(principle 9) and serves no decision — matching's explanation rule 3, applied as a structural
prohibition rather than a copy guideline. **The component is incapable of rendering a second
exclusion reason.**

Excluded candidates appear in a separate group on E-04 that is explicitly labelled as not ranked, is
not sorted by anything, and is not dimmed
([opportunity-card.md](opportunity-card.md), *Not eligible*).

The same explanation is shown to the worker on W-02 and W-01 (D9). It is the same text, from the same
evaluation. An explanation that changes depending on who is reading it is not an explanation, and
this is matching's honesty test.

### Exclusion on the worker's own home screen

W-01 shows that opportunities the worker is not eligible for exist, with a route to the reason (D9).
It renders as **an actionable statement naming the requirement most often missing**, with what would
satisfy it — «۴ فرصت دیگر هست که به کارت سلامت نیاز دارد» — and never as a bare count of exclusions.

A running tally of refusals on someone's home screen is a dignity failure (principle 9), and it is
the form this would take by default. The count is legitimate; the framing is the whole difference
between transparency and a scoreboard of rejection.

## Empty results

«هیچ نامزد واجد شرایطی وجود ندارد» is never rendered alone. It names **which requirement removed the
most people**, with the count, so the employer can act on it. Silence is the failure mode principle 2
exists to prevent, and an empty state is where it happens.

## Prior relationship and Preferred Crew

The Work Graph is a projection and has no visualisation
([ADR-0009](../../adr/0009-prototype-experience-architecture.md)). It is visible **only** through
effects on decisions, and this is the primary one.

A prior relationship renders as **rung 6 of the ladder**, not as a badge, not as a highlight on the
row, and not as a separate "your crew" section:

```
⟨ordering⟩  سابقهٔ همکاری
            ۱ همکاری کامل‌شده با شما · ۲۵ مرداد · تأییدشده
            ⟨observed⟩ → engagement
            برای دعوت دوباره علامت‌گذاری شده  ⟨employer's own act⟩
```

Four rules:

1. **It names the engagements, and they are openable.** A relationship that cannot be traced to
   completed work is an assertion, and this rung is where the product's compounding claim is actually
   made.
2. **A Preferred Crew marking is shown as the employer's own recorded act**, with its date — not as a
   property of the worker. The worker did not earn a badge; an employer recorded an intention.
3. **It orders and never introduces.** The rung sits in the ordering half of the ladder, below the
   solid rails, and the component cannot render it above them. Domain invariant 4 and F8.
4. **It is employer-specific and says so.** `WKR-06`'s Preferred Crew relationship with a different
   employer confers nothing at `EMP-01` and renders as nothing on `EMP-01`'s screens. A relationship
   rendered as a general property of a person would be the reputation-transfer claim the product does
   not make.

At beat B12 this rung is the entire demonstration of REHIRE: the same E-04 screen from stage 4,
changed only by what happened in between, with `WKR-01` leading on a reason that traces to the
engagement the audience just watched.

## Prohibited in every explanation surface

| Prohibited | Why |
| --- | --- |
| A percentage, score, star, or "fit" figure | No composite exists ([../../product/experience/matching.md](../../product/experience/matching.md) rule 4) |
| A bar, meter or gauge showing match strength | Same, wearing a chart |
| An ordering reason without a named fact | Rule 1: name the fact, not the score |
| A reason without its provenance | Rule 2 |
| More than one exclusion reason | Rule 3, and principle 9 |
| Explanation behind hover | Principle 3; the primary device has no hover |
| An employer-only explanation the worker cannot see | Matching's honesty test |
| "Recommended for you", "top pick", "you may also like" | No recommendation beyond eligibility and ordering exists |
| A Work Graph diagram, network view, or relationship map | [ADR-0009](../../adr/0009-prototype-experience-architecture.md) |
| A prior relationship rendered above the eligibility filters | Would make eligibility-first a slogan |
