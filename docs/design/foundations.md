# Design Foundations

> **Canonical for:** the provenance margin, spacing, density, radius, borders, elevation,
> iconography, motion, focus and keyboard behaviour, content hierarchy, and the responsive strategy.
> **Not canonical for:** typography (see [typography.md](typography.md)), colour (see
> [color.md](color.md)), states (see [state-vocabulary.md](state-vocabulary.md)), token names (see
> [tokens.md](tokens.md)), or the RTL and accessibility *requirements* these choices satisfy (see
> [rtl-accessibility.md](rtl-accessibility.md)).
> **Status:** Draft.

Every value below has a product reason. Values invented for completeness are the failure mode this
document is written against, so where a scale has fewer steps than expected, that is the decision.

## The provenance margin

The system's one structural device
([ADR-0012](../adr/0012-visual-product-language.md)). It is defined here because every component
depends on it.

**Definition.** Each *evidence row* — a row that states a fact about a person, an engagement or a
transaction — is composed of a margin at the inline start and a content column. The margin carries
the provenance mark and label, and the truth chip where one applies. Nothing else may enter it: not
avatars, not actions, not icons for the content, not counts, not decoration.

**Widths.**

| Width | Margin | Behaviour |
| --- | --- | --- |
| `wide` | A rail of fixed width at the inline start of the content column | Mark and label stacked; the rail aligns across every row in a section, which is what makes provenance scannable down a column |
| `regular` | Same rail, narrower | Mark and label on one line |
| `compact` | **No rail.** The mark becomes a leading marker on the claim's own first line, with its label immediately following | The claim wraps beneath, indented to clear the marker |

**The collapse rule is the highest-risk detail in the system.** Two prohibitions make it safe:

1. **The margin never becomes a tooltip, a hover, a popover, or an expandable.** At every width the
   provenance label is rendered text.
2. **The margin never becomes an unlabelled icon.** A marker without its words is a badge, which is
   the failure [../design/design-principles.md](design-principles.md) principle 6 names.

**Alignment is logical.** `inline-start`, never `right`. In Persian the margin is on the right; in a
future LTR locale it is on the left; no component knows or cares. This is
[ADR-0005](../adr/0005-persian-first-rtl-native-ui.md) as geometry.

---

## Spacing and density

A 4px base with seven steps. Seven, not twelve, because a scale with twelve steps is a scale nobody
uses consistently.

`4 · 8 · 12 · 16 · 24 · 32 · 48`

Three semantic aliases sit on top of it, because these three relationships appear on every screen and
naming them keeps them consistent: the gap inside a control, the gap between an evidence row and the
next, and the gap between sections.

**Density is set per actor, and it is a real difference, not a preference.**

| Surface | Row rhythm | Rationale |
| --- | --- | --- |
| Worker | Generous. Vertical space between rows is never below the touch-target minimum, even for non-interactive rows. | Persona P1: one hand, in transit, variable literacy. Scanability beats density (principle 3). |
| Employer | Moderate. Tighter rows, but never below the point where a Persian descender from one row touches the next. | Persona P2 is comparing candidates; comparison needs adjacency. |
| Operations | Moderate. Same rhythm as employer. | Persona P3 reads a case, and a case read at spreadsheet density gets skimmed. |

**Operations does not get its own denser mode.** An admin surface with its own compressed density is
how an evidence-first case review becomes a spreadsheet with a decision button, which is the outcome
the screen inventory rejects.

## Radius

Three values. The anti-goal is the uniformly-rounded card, which reads as consumer-app default and
carries no meaning.

| Token | Value | Used for |
| --- | --- | --- |
| `radius.none` | 0 | Rules, rails, evidence rows, the margin. Anything documentary. |
| `radius.control` | 6px | Buttons, inputs, chips. Things you touch. |
| `radius.surface` | 10px | The two overlay surfaces only — dialog and bottom sheet. |

Evidence rows have **no** radius, deliberately. A record is not a card. This is the single cheapest
visual difference between this product and every marketplace it must not resemble.

## Borders

Borders do the work shadows do elsewhere.

| Token | Weight | Used for |
| --- | --- | --- |
| `border.hairline` | 1px | Separating rows and sections. The default. |
| `border.emphasis` | 2px | The current row, a selected control, the block a state banner qualifies. |
| `border.doubled` | 1px + 1px with a gap | **Reserved.** Epistemically qualified content only ([color.md](color.md)). Nothing else may use it. |

## Elevation

**Two levels, and one of them is zero.**

`elevation.flat` — everything. `elevation.overlay` — a dialog and a bottom sheet, which are the only
two things in the system that float, and which need it to establish that the surface beneath is
inert.

There is no card shadow, no hover lift, no layered depth. Excessive shadow is a named anti-goal, and
the deeper reason is that shadow implies a stack of objects; this product's content is a record, and
a record is flat.

## Iconography

**Icons are never alone.** Every icon in the product has adjacent text. There is no icon-only button,
no icon-only state, no icon-only navigation destination. This removes a whole class of accessibility
and comprehension failure and it costs almost nothing, because the icon set is small.

**Style.** Monoline, drawn on the same optical grid, no fill except where a mark's fill *is* its
meaning (the provenance marks). Stroke weight matches `border.emphasis` so icons and rules look like
one system.

**Direction.** Classified once, per [rtl-accessibility.md](rtl-accessibility.md) rule 3, and the
classification is part of each icon's definition rather than a per-use decision:

- **Directional — flips with `dir`.** Back, forward, next, previous, progression, indent, expand
  toward a side. In Persian, "back" points to the **right**, because reading advances leftward.
- **Non-directional — never flips.** Clock, calendar, location pin, check, warning triangle, person,
  document, currency mark, every provenance mark.

The failure mode is a mirrored clock or a mirrored check, which is as wrong as a back arrow that
points the wrong way and is much easier to ship.

**Absent from the set**, enforced by the set not containing them: padlock, shield, vault, safe, star,
trophy, medal, flame, rocket, chart-of-any-kind-as-decoration, camera, paperclip, upload. Each traces
to a rule in [visual-language.md](visual-language.md).

## The one permitted chart

A **stacked proportion bar**, and nothing else. It is permitted only where a distribution changes a
decision — an employer's cancellation lead times on E-08 — and only under three conditions:

1. Every segment is labelled with its value in text, adjacent to the bar.
2. The same information is fully readable with the bar removed. The bar is an accelerant, never the
   carrier.
3. Segments are distinguished by position and label, not only by tint.

No line chart, no pie, no sparkline, no trend arrow, no gauge. A decorative chart in a trust surface
is a claim wearing the costume of a measurement.

## Motion

**No motion in this system conveys information.** Everything motion does here could be removed
entirely and nothing would become unclear. That is the design constraint, not a summary of it.

- Three durations: instant (0ms), short (~120ms), medium (~200ms). Nothing is slower.
- Motion is permitted for: an overlay entering or leaving, a disclosure opening, a focus ring
  settling. Nothing else.
- **`prefers-reduced-motion: reduce` sets every duration to zero.** Not "reduces"; zero. There is no
  motion in the product whose absence loses meaning, so there is no reason to preserve a diminished
  version.
- **No entrance animation on data.** Records do not fade in. A Passport that animates into place
  performs its own significance.
- **No animated numeric counters**, per [visual-language.md](visual-language.md).
- **No motion on state change in an evidence record.** A row that flashes when it updates draws the
  eye to recency, and the chronology's meaning is order, not recency.

## Focus and keyboard

- **Focus is always visible**, on every interactive element, in every state. There is no
  `:focus-visible`-only affordance for controls reachable by keyboard.
- **The focus ring is two-tone** — an inner ring in `brand.accent` and an outer ring in the canvas
  colour — so it holds contrast against any surface it lands on, including a tinted or bordered one.
- **Focus order follows the visual order in the logical direction**, which in Persian is right to
  left, then down. It is never re-sequenced by absolute positioning.
- **Focus is never obscured** (WCAG 2.2, 2.4.11). This is a live risk in exactly one place: the
  sticky primary action on the worker's decision screens. The rule is that a sticky bar reserves
  scroll padding equal to its own height, so a focused control never lands beneath it.
- **Every interactive element is reachable and operable by keyboard from its first commit**
  ([design-system.md](design-system.md) primitive rule 4). Retrofitting is more expensive and usually
  incomplete.
- **No interaction depends on dragging** (WCAG 2.2, 2.5.7). The system has no slider, no drag-reorder
  and no swipe-only action. Where a swipe exists as an accelerant, the same action has a visible
  control.
- **No cognitive-function test in any authentication or verification step** (WCAG 2.2, 3.3.8). W-03
  is a simulated identity check; it must not acquire a puzzle because the flow looked too short.
- **Nothing already recorded is re-entered** (WCAG 2.2, 3.3.7). This coincides exactly with F7: on
  OPS-02 and on the case-response screens, evidence is selected from the record, never typed again.

## Touch targets

| Context | Minimum |
| --- | --- |
| Worker, all surfaces | **44 × 44 px**, and the spacing scale is set so this is met without special-casing |
| Employer and operations, pointer-primary | **32 × 32 px** with 8px separation |
| Absolute floor, everywhere | **24 × 24 px** (WCAG 2.2, 2.5.8) |

## Errors and validation

- **Errors are text, associated with their field, and describe the correction** — not the violation.
  «کد وارد شده معتبر نیست. کد شش‌رقمی روی صفحهٔ کارفرما را دوباره وارد کنید» rather than «خطا».
- **Validation happens on blur and on submit, never on each keystroke.** Per-keystroke validation
  tells someone they are wrong before they have finished being right.
- **A submitted form that fails moves focus to a summary** naming every failed field as a link, and
  the summary is announced.
- **An error never removes what the user entered.**
- **`aria-invalid` and a programmatic description accompany every error**, and the error text is not
  the field's only label — placeholders are not labels
  ([rtl-accessibility.md](rtl-accessibility.md) rule 5).
- **The check-in code's rejection states are first-class**, not errors in the incidental sense: an
  invalid code and an already-used code have distinct, specific messages, because
  [../product/experience/proof-of-work.md](../product/experience/proof-of-work.md) requires the
  rejection to be visible in the demo.

## Screen-reader expectations for evidence and state

- **A state is announced with its label**, never as a decorative image and never as a colour.
- **A provenance mark is part of the accessible name of the claim it qualifies**, so the claim and
  its source are read as one statement. "Health certificate — self-declared" must not be reachable
  only by navigating to a separate element.
- **A truth chip announces its level and that it links to the truth ledger.**
- **The chronology is a list** with each entry an item, in document order, so the record's order —
  which is its meaning — survives linearisation.
- **Live regions are used only for the outcome of an action the user took**, at polite priority.
  Nothing in the product announces itself unprompted.
- Persian screen-reader support is weaker than English support and is verified rather than assumed
  ([rtl-accessibility.md](rtl-accessibility.md)). A conformant interface that is not understood has
  failed.

---

## Content hierarchy

Every screen answers, in this order, without interaction:

1. **What is this?** One `<h1>`, naming the subject in the user's words.
2. **What is the state of it?** At most one banner-form state.
3. **What do I need to decide?** The decision-critical facts, in the order the deciding person needs
   them — which is not the order the domain stores them.
4. **On what basis?** The evidence rows, each with its provenance.
5. **What can I do?** Actions, last, and never above the information that justifies them.

Ordering rule: **the primary action is never above the facts it commits the user to.** This is
design principle 8 as layout — an action placed before its terms is a consequential act styled as a
trivial one.

## Responsive strategy

Three breakpoints, named for the shape of the reading task rather than for a device.

| Breakpoint | From | Primary occupant |
| --- | --- | --- |
| `compact` | 320px | Worker. The design baseline for every shared component. |
| `regular` | 640px | An employer on a tablet or a narrow window. |
| `wide` | 1024px | Employer and operations. |

**Worker surfaces are designed at `compact` first and are never designed at `wide` and reduced.**
Employer and operations surfaces are designed at `wide` and must remain fully usable at `compact` —
usable, not equivalent: a case review on a phone is a legitimate thing to do badly-but-completely,
and an illegitimate thing to do partially.

`compact` is also the 400% zoom reflow target, which satisfies
[rtl-accessibility.md](rtl-accessibility.md) rule 7 without a separate layout.

### What may change with width

**May reflow.** Multi-column to single column. Side-by-side claims to stacked claims — stacked
adjacently, in equal width, never one above a fold from the other.

**May collapse.** The provenance rail to a leading marker (never further). A section of historical
rows to the most recent N *with the total stated as a number* — «۳ مورد از ۱۲» — never as "more".

**May defer.** The change ledger's detail behind its summary. The lead-time distribution bar, whose
values stay in text. A second-order explanation, provided the top reason stays rendered.

### What may never change with width

Decision-critical information is not a matter of screen size. At every width, on every surface, these
remain rendered without interaction:

- the pay amount and its unit;
- the time window and its duration;
- the location and its distance, with the distance's `SIMULATED` chip;
- eligibility state and, where not eligible, the unmet requirement;
- every provenance mark and label;
- every truth chip that applies to a rendered claim;
- the statement that the Platform does not hold funds, wherever a commitment is shown;
- the response window and the non-response rule, before proof is submitted;
- the `HYPOTHESIS` qualification on the classification signal;
- the obligation-survives sentence beside `SettlementFailed`;
- the denominator on every derived figure.

A layout that cannot fit this list at 320px is a layout defect. It is never resolved by dropping an
item from it.
