# Design System Principles

> **Canonical for:** design-system governance — tokens, primitives, composition, and what may be built.
> **Not canonical for:** product design values (see [design-principles.md](design-principles.md)) or
> RTL and accessibility rules (see [rtl-accessibility.md](rtl-accessibility.md)).
> **Status:** Draft. **No design system exists.** These are the rules the future one must satisfy.

## Approach

Build the smallest set of primitives the demo scenarios actually require, and extract components
only when the same pattern appears a third time. A component library assembled in advance encodes
guesses about screens that have not been designed.

## Token rules

1. **Tokens are the only source of visual values.** No hard-coded colour, spacing, radius, shadow
   or type value in components.
2. **Tokens are semantic, not literal.** `color.text.muted`, not `color.gray.400`. A literal token
   is a hard-coded value with extra steps.
3. **Spacing and sizing are directional-agnostic.** `start` / `end`, never `left` / `right`.
   Non-negotiable — see [rtl-accessibility.md](rtl-accessibility.md).
4. **Typography tokens are defined against the Persian type stack first**, then verified for Latin.
   Persian and Latin have different optical sizes, line-height needs and cap-height behaviour;
   type scales tuned on Latin look wrong in Persian.
5. **Type scale is anchored to a readable body size on a phone**, not to a desktop composition.
6. Contrast is a token constraint, not a review finding.

## Primitive rules

1. A primitive owns its accessibility semantics. Consumers cannot break them.
2. Primitives carry no domain knowledge. A `Badge` never knows what a Worker Passport is.
3. Primitives compose. A primitive that only fits one screen is not a primitive.
4. Every interactive primitive supports keyboard operation and a visible focus state from its first
   commit. Retrofitting accessibility is more expensive and usually incomplete.
5. Loading, empty, error and partial states are part of a component's definition, not variants added
   later. Empty states matter especially here: a new worker's Passport *is* an empty state, and it
   is a core moment of the product (scenario S2).

## Truth-label affordance

The design system must include a **first-class primitive for truth labelling** — the visual
mechanism that marks a `SIMULATED` or `MOCK` capability at the point of use.

It is a design-system primitive, not per-screen decoration, because it is a governance guarantee.
Making it ad-hoc makes it omittable, and an omittable honesty mechanism is not one.

## Not decided

Visual identity, colour palette, typeface selection, dark mode, iconography and motion. All
deferred to product design work at GATE 1. Choosing them now would be visual design without a
product to design for.
