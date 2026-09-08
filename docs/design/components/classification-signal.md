# Engagement Classification Signal — Surface Specification

> **Canonical for:** how the classification signal and its factors are rendered.
> **Not canonical for:** how factors are collected or what may and may not be said (see
> [../../product/experience/classification.md](../../product/experience/classification.md)), the
> factor model (see
> [../../domain/engagement-classification.md](../../domain/engagement-classification.md)), or
> epistemic status labels (see [../../legal/legal-architecture.md](../../legal/legal-architecture.md)).
> **Status:** Draft — the surface renders a hypothesis. Nothing about it is legally validated.

`HYPOTHESIS` · This document describes a presentation of recorded signals. It states no legal
conclusion, and no rendering it specifies may imply one. Q1, Q2 and Q6 are `UNKNOWN`.

Appears on E-03 and nowhere else in the employer flow.

## The design problem

The surface has to communicate two things that pull against each other: that the Platform has
something useful to say about how this engagement is organised, and that the Platform has no idea
what it means legally.

Most interface conventions available for the first destroy the second. A score implies measurement.
A gauge implies calibration. A traffic light implies a threshold someone validated. A confidence
percentage attaches a number to an unvalidated hypothesis and manufactures certainty that does not
exist ([../../product/experience/classification.md](../../product/experience/classification.md)).

So the panel is built from a device that exists for exactly this and nothing else.

## The doubled border

The whole panel sits inside `border.doubled`, which is **reserved system-wide for epistemically
qualified content** ([../color.md](../color.md)). It appears here and nowhere else in the prototype.

A reader learns one thing from it, and only needs to learn it once: *the Platform is telling you it
does not know.*

The panel header carries the status in words — «فرضیه — این یک تعیین حقوقی نیست» — with a route to
what is unresolved. The status is text, not a chip and not an icon, because it is a sentence about
knowledge rather than a state of an object.

## The signal itself

**A named position on a named spectrum.** Segmented, with both ends labelled in the employer's own
vocabulary, the current segment marked, and **the segment named in words beside the marker**. The
words are the content; the segments are an aid to reading them.

Prohibited renderings, each because of what it implies:

| Prohibited | Implies |
| --- | --- |
| A gauge with a needle | Calibrated measurement |
| A score, a number, a percentage | Precision, and a threshold |
| A traffic light, or red/amber/green segments | A validated pass/fail |
| A trend or comparison to other opportunities | A norm the project has not established |
| A recommendation, or a way to "improve" the signal | Optimising the factor model to produce a preferred answer, which is a governance violation |

The spectrum's segments use `neutral` throughout. **No segment is coloured as good or bad**, because
neither end is, and colouring one would be the legal position the Platform cannot take.

## Factors

Below the signal, one evidence row per contributing factor. Each carries its value and its
provenance, using the same margin as everywhere else:

| Factor source | Mark | Row states |
| --- | --- | --- |
| Derived from what the employer already entered | derived bracket | the value, and **which field it came from** |
| Answered at E-03 | self-declared hollow | the value as answered |
| Answered «هنوز مشخص نیست» | self-declared hollow | recorded as undecided, not as a negative |

The factor set is owned by
[../../domain/engagement-classification.md](../../domain/engagement-classification.md) and is not
listed here.

## Uncaptured factors

A separate sub-list headed «ثبت‌نشده», naming each uncaptured factor.

**Uncaptured factors are rendered at equal visual weight to captured ones.** Not dimmed, not
collapsed, not smaller, not behind a disclosure, not below a fold on any width.

This is the uncomfortable requirement — classification's demonstration requirement 3 — and it is the
one a designer will reflexively want to soften because the panel looks incomplete with it. The panel
*is* incomplete, and a classification screen with no visible gaps would be exactly the overclaim the
whole mechanism exists to avoid.

«ثبت‌نشده» and «پاسخ: خیر» are never rendered in the same way, in any density. "Not asked" and
"answered no" are different facts and the surface has to keep them different, because they are stored
differently and a later legal analysis will need to tell them apart.

## Non-blocking, structurally

The publish action **sits outside the panel**, before it in the flow, and is never disabled by the
signal (D3).

This is layout as guarantee. An action inside the panel, or one whose enabled state the panel
controls, would make the signal appear to gate publication — and blocking would presume an answer to
an open legal question, which
[ADR-0010](../../adr/0010-prototype-provisional-defaults.md) safeguard 7 makes unavailable regardless
of who approves it.

> **Prototype-provisional default — D3.** The signal informs and does not block. D3 stays OPEN; the
> provisional value and its revisit trigger are in [../../open-decisions.md](../../open-decisions.md),
> and the reason blocking is unavailable is in
> [../../product/experience/classification.md](../../product/experience/classification.md).

The panel is marked at the point of use as operating under a prototype-provisional default
([ADR-0010](../../adr/0010-prototype-provisional-defaults.md) safeguard 3), in the same plain
sentence as everything else on it.

## The permanent footer

Inside the panel, always rendered, at `type.body` and never smaller:

«پلتفرم مشاورهٔ حقوقی نمی‌دهد و دربارهٔ وضعیت حقوقی این همکاری اظهار نظری نمی‌کند.»

It is not fine print, not `type.detail`, not collapsible, and not below a fold at any width
([../foundations.md](../foundations.md)). A disclaimer that has to be found is
[ADR-0004](../../adr/0004-demo-truth-taxonomy.md)'s rejected alternative in a different register.

Beside it, the route to what is unresolved.

## Truth labelling

The mechanism is `FUNCTIONAL` (row 9) and is therefore unmarked. Its **legal validity** is `PLANNED`
(row 18), which is not a capability a user operates and is not rendered as a truth chip — it is what
the doubled border and the header state in words.

That distinction matters: the panel is not saying "this feature is simulated". It is saying "this
feature works and nobody has checked whether its answer means anything". Those are different
admissions and the surface makes the second one.

## Anti-patterns

| Anti-pattern | Why |
| --- | --- |
| A confidence percentage | Manufactures certainty ([../../product/experience/classification.md](../../product/experience/classification.md)) |
| Any wording that states or implies what the engagement *is* | [ADR-0007](../../adr/0007-legal-claims-carry-epistemic-status.md) |
| «مطابق قانون», «ایمن», «بدون ریسک», or any compliance framing | Same; and the marketing-inheritance rule |
| A suggestion to restructure the work to change the signal | Governance violation |
| Uncaptured factors dimmed, collapsed, or omitted | Demonstration requirement 3 |
| The doubled border used anywhere else in the product | Dilutes the only epistemic signal in the system |
| The signal panel gating the publish action | Presumes an answer to Q1 and Q6 |
| The legal footer at `type.detail` or in a collapsible | Turns a required statement into fine print |
