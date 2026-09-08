# Colour and Semantic Roles

> **Canonical for:** the colour strategy, the separation of brand from semantic state, the semantic
> role set, and how truth states are represented chromatically.
> **Not canonical for:** which state uses which role (see
> [state-vocabulary.md](state-vocabulary.md)), token names (see [tokens.md](tokens.md)), or the
> contrast and colour-alone *requirements* (see [rtl-accessibility.md](rtl-accessibility.md)).
> **Status:** Draft.

## The strategy in one rule

**Colour carries semantic state. It never carries identity, provenance, or emphasis.**

Everything follows from that. Brand is almost absent from the interface. Provenance — the product's
most important distinction — is not hue-coded at all
([ADR-0012](../adr/0012-visual-product-language.md) decision 2). Emphasis is weight and space.
What is left for colour to do is exactly one job, so it can do it unambiguously.

## Brand

Two values, and the first is doing most of the work.

| Token | Role | Where it appears |
| --- | --- | --- |
| `brand.ink` | A near-black with a warm-navy cast. The dominant visual identity of the product. | Body text, headings, rules, marks, the identity mark. |
| `brand.accent` | A deep teal, dark enough to sit at AA on paper at body size. | Links, focus ring, selected state, the identity mark. Nothing else. |

**`brand.accent` never fills a large area.** No coloured header bar, no coloured button field wider
than a control, no coloured section background, no gradient. The product's chromatic identity is
that it barely has one.

This is a positioning decision as much as an aesthetic one. Deep teal used sparingly cannot be read
as the professional-network blue, the fintech neon, the AI violet, or the institutional green a
government portal would use — and a product that colours its surfaces is asking to be trusted for
its confidence. This one asks to be trusted for its record.

### The ground

Warm off-white paper, not cool grey. The distinction is small in a swatch and decisive in a build:
cool neutrals plus dense rows is enterprise HR, and the drift is one palette revision away. The
warmth is specified in the token values and is not a matter of taste at implementation time.

Surfaces are distinguished by **rule weight and tint, never by shadow**. There are exactly three
surface levels — canvas, raised (a hairline and a barely-perceptible tint), and recessed (a tint
inward, used for derived material). Elevation is covered in
[foundations.md](foundations.md).

---

## Semantic roles

Eight roles. Each has a foreground, a background and a border value, and each is defined by *what it
means*, not by its hue — so a role can be rehued without a component changing.

| Role | Means | Hue family | Never used for |
| --- | --- | --- | --- |
| `neutral` | A fact with no valence. The default. | Ink greys | Anything the reader should act on |
| `info` | A recorded fact about system progress. | Slate blue | Anything positive or negative |
| `positive` | Something completed as intended, confirmed by an act. | Deep green | Anything the platform only heard about |
| `attention` | Something is waiting on **the reader**. | Ochre | A property of the object being read |
| `warning` | Something about the object is degraded, thin, or came about by silence. | Clay | Anything requiring the reader's action |
| `critical` | A failure. | Deep red | Exclusion, cancellation, decline, or dispute |
| `verification` | Provenance. **Rendered in ink, not in hue.** | — | Any state |
| `truth` | Demo truth labelling. **Rendered in ink with a hatched edge.** | — | Any state |

Four of these definitions carry a product decision and are worth stating plainly.

**`attention` and `warning` are genuinely different**, and separating them is what keeps the
interface from shouting. `attention` means *you have something to do* — an unanswered proof review
with its window running. `warning` means *this fact is weaker than it looks* — a rate over a sample
of one, an uncaptured classification factor, an approval that happened because nobody responded.
A reader learns that ochre is a queue and clay is a caveat.

**`critical` is reserved for failure, and exclusion is not a failure.** A worker who does not meet a
requirement is not an error state. Rendering `NotEligible` in red would make an ordinary, explainable,
non-pejorative fact look like something has gone wrong with the person — which is domain invariant 4
inverted and design principle 9 broken. Exclusion is `neutral`. So are `Declined`, `Expired` and
`Cancelled`. In the whole prototype, `critical` appears in exactly one place: `SettlementFailed`.

**`positive` requires an affirmative human act.** `Approved` is positive because an employer approved.
`ApprovedByNonResponse` is `warning`, because nobody did. `SettlementReported` is `info`, not
positive, because the Platform was told something and does not know it. This is
[../product/experience/payment.md](../product/experience/payment.md)'s wording discipline expressed
as colour, so the two cannot drift apart.

**A dispute is `attention`, never `critical`.** A case is a process that is open, not a fault that
has occurred. Colouring it as failure would make the interface pass a judgement the Platform
explicitly declines to pass ([../product/experience/disputes.md](../product/experience/disputes.md)).

## Contrast

- Body text and every state foreground: **≥ 7:1** against its surface. AA requires 4.5:1; the floor
  is set higher because persona P1 reads on a low-quality screen, outdoors, on a phone that may be
  scratched. Meeting AA on a design monitor is not the same as meeting it on a bus.
- Non-text elements that carry meaning — marks, rules that separate evidence, control borders:
  **≥ 3:1**.
- Disabled controls are exempt from contrast minimums in WCAG and **not exempt here**: a disabled
  control still has to be readable to explain why it is disabled. The system prefers not to render a
  control at all over rendering an unexplained dead one.
- **Contrast is a token constraint, not a review finding** — [design-system.md](design-system.md)
  token rule 6. Pairings are fixed in the token layer, and a component cannot compose an
  unverified pair.

## Colour is never alone

Every state renders as **label + mark + role colour**, in that order of importance. Remove the colour
and the state is still fully legible; that is the test, and it is run in
[adversarial-review.md](adversarial-review.md) rather than assumed.

Two consequences that are easy to miss:

- **Forced-colors mode must not lose meaning.** Marks are glyphs and borders, never background
  images or CSS-drawn shapes that vanish when the platform substitutes its own palette. The truth
  chip's hatch is an enhancement; its border and its text are the meaning.
- **The one permitted chart form carries its values in text.** See
  [foundations.md](foundations.md).

---

## Truth states

`FUNCTIONAL`, `SIMULATED`, `MOCK` and `PLANNED` are defined in
[../demo-truth-matrix.md](../demo-truth-matrix.md). This section decides only how they look, and it
has to solve a specific tension: [ADR-0004](../adr/0004-demo-truth-taxonomy.md) requires labelling at
the point of use, while the demo has to remain an ordinary product experience rather than a
disclaimer surface.

**The truth label is a chip in ink with a hatched inline-start edge.** No hue, no fill, no alarm
colour. It reads as a technical annotation in a margin — which is exactly what it is.

| Level | Rendered as | Where |
| --- | --- | --- |
| `FUNCTIONAL` | **Nothing.** No mark, no chip, no absence-of-chip implication. | — |
| `SIMULATED` | Chip: hatched edge, label «شبیه‌سازی‌شده» | In the margin, beside the specific claim the port produced |
| `MOCK` | Chip: denser hatch, label «ساختگی» | Same, plus one banner on a screen that is entirely mock (SH-03) |
| `PLANNED` | Not rendered as a control at all | Prefer absence over a dead affordance |

Five rules govern how much of this a user sees.

1. **The chip attaches to the claim, not to the screen.** A screen-level banner does not discharge
   the obligation and a footer never does.
2. **`FUNCTIONAL` is unmarked.** Marking it would make the honest majority of the product noisy and
   would train the eye to skip chips.
3. **Consecutive identical chips in one list or chronology collapse to one chip on the containing
   block**, with the level still named in each entry's own text. This is what keeps W-07's payment
   chronology from becoming a column of identical annotations, without weakening point-of-use
   labelling — the words are still on every entry, and the entry is still one tap from SH-02.
4. **Every chip is a link to SH-02**, filtered to its row. This is the mechanism the screen inventory
   requires, and it is why the chip is a control and not decoration.
5. **The hatch texture appears nowhere else in the system.** One texture, one meaning. A hatched edge
   anywhere else would dilute the only visual signal in the product whose job is honesty.

### Epistemic qualification is a different mark

`HYPOTHESIS` and `UNKNOWN` ([../legal/legal-architecture.md](../legal/legal-architecture.md)) are not
truth levels and must not use the truth chip. They render as a **doubled hairline border** around the
qualified content plus a header naming the status in words.

The doubled border is reserved system-wide for epistemically qualified content, and nothing else may
use it. A reader learns one thing from it: *the Platform is telling you it does not know.* It appears
on E-03's classification signal and nowhere else in the prototype.
