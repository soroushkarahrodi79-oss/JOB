# RTL and Accessibility Principles

> **Canonical for:** RTL and accessibility requirements.
> **Not canonical for:** design values (see [design-principles.md](design-principles.md)) or
> token/component governance (see [design-system.md](design-system.md)).
> **Status:** Draft. Decision recorded in [ADR-0005](../adr/0005-persian-first-rtl-native-ui.md).

## RTL is a foundation, not a mode

The product is Persian-first. RTL is the **default**, not a transformation applied to an LTR
design. This is a structural decision because the alternative — building LTR and mirroring —
produces a permanent tax: every new screen must be re-checked, and the failures are subtle enough
to ship.

### Non-negotiable rules

1. **CSS logical properties only.** `margin-inline-start`, `padding-inline-end`, `inset-inline`,
   `border-start-start-radius`. Physical `left` / `right` properties are prohibited in layout.
2. **`dir` is set at the document root** and inherited. Direction is never hard-coded per component.
3. **Icons are classified as directional or non-directional.** Directional icons (back, next,
   progress) flip. Non-directional icons (clock, camera, checkmark) do not. Flipping everything is
   as wrong as flipping nothing.
4. **Mixed-direction content is handled explicitly.** Latin brand names, URLs, email addresses,
   phone numbers, and numerals inside Persian text need isolation (`bdi`, `unicode-bidi: isolate`).
   Without it, punctuation migrates to the wrong end of the line — a defect that reads as
   illiteracy to a Persian reader.
5. **Numerals are rendered as Persian digits.** Input accepts whatever the user types. Storage is
   not a presentation concern and is governed by
   [../architecture/data-model.md](../architecture/data-model.md).
6. **The Persian type stack comes first**, with a system fallback that does not break Persian
   shaping. Fonts must not be a runtime dependency on a foreign CDN — that is both a performance
   and an availability problem in the target market.
7. **ZWNJ (U+200C) is rendered and never collapsed to a space.** Stripping or normalising it away
   changes word meaning in Persian. Its storage treatment is governed by
   [../architecture/data-model.md](../architecture/data-model.md).
8. **Jalali calendar in all date presentation**, including weekday and weekend conventions. The
   Iranian week does not end on Sunday, and a UI that assumes it does is visibly foreign.
9. **Latin-only review is not review.** Any layout signed off on Latin placeholder text has not
   been reviewed.

## Accessibility

Baseline: **WCAG 2.2 Level AA**, treated as a floor.

1. Semantic HTML first. ARIA only where semantics are genuinely absent.
2. Full keyboard operability, logical focus order, visible focus indicators.
3. Contrast enforced through tokens.
4. Touch targets sized for one-handed phone use.
5. Every form control has a programmatically associated label. Placeholders are not labels.
6. Errors are identified in text, associated with their field, and describe the correction.
7. Content is operable at 200% zoom and at 320 CSS pixels wide.
8. Motion respects `prefers-reduced-motion`.
9. Information is never conveyed by colour alone — this includes truth labels, which must carry text.
10. `lang` is set correctly, and on any element whose language differs from the document.

### Accessibility in the Persian context

- Screen reader support for Persian is weaker than for English. Do not assume equivalent behaviour;
  verify rather than infer.
- Low digital literacy (persona P1) means clear language matters as much as technical conformance.
  A conformant interface that is not understood has failed.
- Assume small, low-cost devices and constrained networks.

## Verification

Automated checks catch a minority of accessibility defects and almost no RTL defects. From the gate
that introduces UI, review includes real Persian content — never Latin placeholders — and manual
keyboard and screen-reader passes. Conformance is not claimed until it is tested; per
[legal-architecture.md](../legal/legal-architecture.md) discipline, an untested claim is not made.
