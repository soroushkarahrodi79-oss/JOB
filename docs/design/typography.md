# Typography

> **Canonical for:** the type stack, the semantic type scale, and the rules for Persian, mixed
> Persian/Latin, numeric and monetary rendering.
> **Not canonical for:** the RTL and accessibility *requirements* this system satisfies (see
> [rtl-accessibility.md](rtl-accessibility.md)), storage of digits, ZWNJ or money (see
> [../architecture/data-model.md](../architecture/data-model.md)), or token names (see
> [tokens.md](tokens.md)).
> **Status:** Draft.

Persian is the source language. Every value below was chosen against Persian text and then checked
against Latin — never the reverse. A scale tuned on Latin and applied to Persian produces text that
is technically the right size and visually too small, because Persian's optical size at a given em
is smaller and its letterforms carry more of their identity below the baseline.

## The stack

Two families and no more. Every additional family is bytes the worker pays for (principle 7) and a
new set of Persian shaping behaviours to verify.

| Role | Family | Notes |
| --- | --- | --- |
| **Text** — everything | Persian UI face (D19) | Carries Persian and Latin. One family for both is a deliberate choice: a separate Latin face makes mixed-direction runs visibly stitched together. |
| **Identifier** — codes and technical identifiers only | Monospace face with unambiguous `0/O` and `1/l/I` | Used for the check-in code and, in operations only, entity identifiers. Nowhere else. |

**Both are self-hosted.** No font is fetched from a foreign CDN, at any point, for any reason —
[ADR-0005](../adr/0005-persian-first-rtl-native-ui.md) and
[ADR-0008](../adr/0008-provisional-application-stack.md) constraint 4. This is an availability
decision before it is a performance one.

> **Prototype-provisional default — D19, `PENDING AUTHORISATION`.** The specific faces are not
> selected here. The selection criteria are below; the candidates and the licence-verification
> obligation are recorded in [../open-decisions.md](../open-decisions.md). An agent may not assert
> that a font licence permits redistribution, so the choice is proposed and not applied.

### Selection criteria for the text face

Binding on whoever selects it. A face failing any of these is disqualified regardless of how it
looks.

1. **Redistributable under a licence permitting self-hosting**, verified by a person against the
   licence text — not inferred from a repository or a download page.
2. **Complete Persian coverage**, including the four Persian-specific letters (پ چ ژ گ) and correct
   contextual forms in all four positions.
3. **ZWNJ (U+200C) rendered as a true zero-width non-joiner**, not as a space and not dropped.
   Verify with a compound word, not a test string.
4. **Persian (Extended Arabic-Indic) digits present, and tabular.** This is the criterion most
   likely to fail silently and it is load-bearing — see *Numerals* below.
5. **At least three weights** in a single family, with a genuine weight difference at body size in
   Persian. Persian weight differences that read clearly in Latin often close up in Persian counters.
6. **A Latin companion in the same family** with compatible x-height and vertical metrics.
7. **Subsettable to woff2** at an acceptable size against the font budget below.

### Font budget

**≤ 200 KB total font payload on first load**, across every family and weight, compressed and
subset. Persona P1 pays for these bytes and may be on a metered connection.

Consequences: three text weights maximum; the monospace face is subset to digits, Latin uppercase
and the hyphen; no italic file is loaded, ever (see *Emphasis*); `font-display: swap` with a
metrically-adjusted fallback so a reflow does not move the fold.

### Fallback stack

Ordered, and each entry is there for a reason:

1. The self-hosted Persian face.
2. `Tahoma` — the most reliably present Persian-shaping face on the Windows machines still common in
   the target market. It is unlovely and it is correct, which is the right order of priorities in a
   fallback.
3. The platform Arabic-script system face.
4. `sans-serif`.

A fallback stack that ends at a Latin-only face is not a fallback; it is a rendering failure that
happens to have a name.

---

## Scale by semantic role

Roles, not sizes. A component asks for `type.body`, never for a pixel value, and a role's value may
change without every consumer being revisited — token rule 2 in
[design-system.md](design-system.md).

| Role | Compact (worker phone) | Wide | Line height | Weight | Used for |
| --- | --- | --- | --- | --- | --- |
| `type.display` | 28 | 32 | 1.35 | 700 | The subject of a screen. At most once per screen. |
| `type.title` | 21 | 22 | 1.45 | 700 | Section heading. |
| `type.subtitle` | 18 | 18 | 1.55 | 600 | Sub-section; the employer name on an opportunity card. |
| `type.body` | **17** | 17 | **1.75** | 400 | The anchor of the whole scale. Everything else is derived from it. |
| `type.body-strong` | 17 | 17 | 1.75 | 600 | The one fact in a paragraph that carries the decision. |
| `type.detail` | 15 | 15 | 1.7 | 400 | Provenance labels, timestamps, denominators, margin text. |
| `type.label` | 15 | 15 | 1.5 | 600 | Form labels and state labels. |
| `type.numeric` | inherits | inherits | inherits | 600 | Money, times, counts, ratios. Tabular figures. |
| `type.amount` | 24 | 24 | 1.3 | 700 | The pay figure on an opportunity card, and nowhere else. |
| `type.identifier` | 15 | 15 | 1.5 | 500 | Monospace. Check-in code, operations identifiers. |
| `type.code` | 28 | 28 | 1.2 | 600 | Monospace, letter-spaced. The check-in code display only. |

**`type.body` at 17px is the decision the rest of the scale hangs on.** 16px Persian at 1.5 line
height is legible in a design review and tiring on a bus. 17/1.75 is the smallest setting that stays
comfortable for a reader with variable literacy on a low-resolution screen, which is persona P1's
actual condition.

**`type.detail` at 15px is a floor, not a small size.** Provenance is not fine print. Nothing in this
system renders below 15px — there is no caption role, no footnote role, and no "meta" role, because
every one of them would become the place honest qualifications go to be unread.

### Heading semantics

The visual scale and the heading hierarchy are independent. `type.display` does not mean `<h1>`.
Every screen has exactly one `<h1>` naming what the screen is about; sections nest without skipping
levels; a heading is never chosen for its size. A visually prominent line that is not a section
heading is `type.title` on a non-heading element.

---

## Persian typesetting rules

Non-negotiable. Each names what it prevents.

1. **`letter-spacing` is zero on Persian text, always.** Positive tracking breaks cursive joining and
   renders the word as disconnected glyphs — the single most visible "this was built by someone who
   does not read Persian" defect available. Tracking is permitted only on `type.code` and
   `type.identifier`, which are Latin and monospaced.
2. **No synthesised italic, ever.** Persian has no italic tradition and browser oblique transforms
   distort the letterforms. Emphasis is weight and colour only.
3. **No case transforms.** Persian has no case. `text-transform` is prohibited system-wide, so that
   a Latin-derived habit cannot arrive through a shared component.
4. **`text-align: start`. Never `justify`.** Browser justification of Persian stretches word spaces
   instead of applying kashida, producing rivers and an uneven grey that reads as broken.
5. **Bold below `type.detail` is prohibited.** Persian counters fill in at small sizes and heavy
   weights; the result is a dark smudge that is less legible than the regular weight it was meant to
   emphasise.
6. **Measure is capped at roughly 65 Persian characters.** Persian sets denser per character than
   Latin; a comfortable Latin measure is a long Persian one.
7. **ZWNJ is preserved in rendering and in copy.** Its storage treatment is
   [../architecture/data-model.md](../architecture/data-model.md)'s; its presentation obligation is
   that no component may normalise, trim, or collapse it. Compound words are the common case, not an
   edge case.
8. **Line breaking never separates a number from its unit**, a name from its honorific, or a
   Jalali day from its month. Bind them with a word joiner rather than hoping.

### Mixed Persian and Latin

Latin runs inside Persian text — a technical identifier, a code — are wrapped in `<bdi>` and carry
`lang` and `dir` for their own run. Without isolation, trailing punctuation migrates to the wrong end
of the line. That defect is invisible to a non-Persian reviewer and reads as illiteracy to a Persian
one, which is why [rtl-accessibility.md](rtl-accessibility.md) rule 4 exists and why this document
does not restate it further.

Two rules this system adds on top:

- **A Latin run never sets its own type role.** It inherits the surrounding role and gets its
  metrics from the same family, so a mixed line has one baseline and one colour of text.
- **Latin runs are rare by design.** The absent-behaviour rule against showing internal identifiers
  exists partly for this reason: every Latin run in Persian prose is a bidirectional risk, so the
  cheapest mitigation is not to have one.

---

## Numerals

The rule is [rtl-accessibility.md](rtl-accessibility.md) rule 5: Persian digits in presentation,
whatever the user types accepted on input, ASCII in storage. What follows is how that is rendered.

**Persian digits everywhere a quantity is displayed** — amounts, times, dates, counts, denominators,
the check-in code. Not "mostly"; a screen mixing ۱۲ and 12 reads as unfinished.

**ASCII digits only inside a Latin technical identifier**, where the digits are part of a string
rather than a quantity: `OPP-01` in an operations view. Converting those would corrupt the
identifier. They are isolated per the mixed-content rule above.

### Tabular alignment

Every column of figures aligns on its digits. In practice this needs Persian tabular figures in the
face itself, because `font-variant-numeric: tabular-nums` is applied by many faces to Latin lining
figures only and silently does nothing to Extended Arabic-Indic digits.

**This is the most likely silent failure in the whole type system.** Selection criterion 4 exists for
it, and verification at GATE 2 must be a rendered comparison of a Persian figure column — not a
declaration that the property is set. Recorded as an implementation risk in
[adversarial-review.md](adversarial-review.md).

Where tabular figures turn out to be unavailable in the chosen face, the fallback is fixed-width
numeric cells with each digit in its own advance — not abandoning alignment. A misaligned money
column in a payment record is the defect this rule exists to prevent.

### Money

Money is the highest-consequence text in the product, and
[../architecture/data-model.md](../architecture/data-model.md) identifies a Rial/Toman confusion as
the most likely data defect in the project. Presentation rules follow from that:

1. **Every amount carries its unit, in the same block, always.** There is no context in which the
   unit is obvious enough to omit, and no size at which it may be smaller than `type.detail`.
2. **Toman is the only unit ever displayed.** Rial appears in no interface, so it cannot be confused
   with Toman in one.
3. **Thousands are grouped**, with Persian digits, using the separator conventional in Persian
   typesetting. An ungrouped seven-digit figure is unreadable at a glance and this product's figures
   are seven digits.
4. **An amount is never truncated, abbreviated, rounded for display, or rendered as a range**
   ("از ..."). The figure shown is the figure committed.
5. **`type.amount` is used once per surface** — the pay figure. Every other amount is
   `type.numeric` at body size. A screen with three large numbers has no hierarchy.

### Ratios and rates

**Ratios render as «X از Y» in Persian digits. No percentage is rendered anywhere in the
prototype.**

This is stricter than [../product/experience/trust-profiles.md](../product/experience/trust-profiles.md),
which requires a denominator with every rate, and it is compatible with it. The stricter rule is here
because a percentage is a denominator-free form: once it exists as a rendering option, the
denominator becomes something a layout can drop under pressure. Removing the form removes the
pressure, and it costs nothing — «۱۲ از ۱۳» is not harder to read than "۹۲٪".

It also forecloses the composite score by the back door. A percentage looks like a measurement; the
product has none.

### Dates and times

Jalali, per [rtl-accessibility.md](rtl-accessibility.md) rule 8. Presentation rules this system adds:

- **A date carries its weekday** wherever a shift is being decided on. "Which day is that" is the
  first question a worker asks and the calendar is not on the screen.
- **A time window renders as a single unit** — start, end, and duration — never as two separate
  facts a reader must subtract. The duration is what the worker is actually deciding about.
- **A relative time never replaces an absolute one** in the evidence record. "۲ ساعت پیش" is
  permitted as an addition on a live surface; the chronology and every dispute-relevant timestamp
  render the absolute Jalali date and clock time, because a relative time is unusable as evidence.
- **The week ends on Friday.** A Gregorian-shaped week in a calendar or an availability grid is the
  defect [rtl-accessibility.md](rtl-accessibility.md) rule 8 names.
