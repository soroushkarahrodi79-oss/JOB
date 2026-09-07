# Design Tokens

> **Canonical for:** the token architecture — the groups, the naming rules, and what may not become a
> token.
> **Not canonical for:** the values' rationale (see [foundations.md](foundations.md),
> [typography.md](typography.md), [color.md](color.md)), or the token *governance* rules (see
> [design-system.md](design-system.md)).
> **Status:** Draft. **No token file exists.** This specifies the one GATE 2 will author.

Token rules 1–6 in [design-system.md](design-system.md) govern. This document adds the architecture
and the anti-explosion rule, and does not restate them.

## Two layers, not three

**Primitive values are not tokens.** A three-layer architecture — primitive, semantic, component —
is the conventional answer and it is the wrong one here, because a `color.teal.700` layer is a
literal token wearing a namespace, which token rule 2 rules out.

| Layer | What it is | Who may use it |
| --- | --- | --- |
| **Raw values** | Hex, px, ms. Held in one file, referenced by nothing but the token layer. Not exported. | The token layer only |
| **Semantic tokens** | The whole public API of the design system | Every component |

A component-level layer is added only when a component genuinely needs a value no semantic token
expresses — and that has to be argued, because it is usually a sign the semantic set is missing a
role.

## Naming

`group.role[.variant][.state]` — in English, in the codebase, describing intent.

- **Intent, never appearance.** `color.fg.muted`, not `color.gray.500`. `state.warning.fg`, not
  `state.amber.fg`.
- **Logical direction only.** `start` and `end`. A token containing `left` or `right` is a defect,
  not a preference — [rtl-accessibility.md](rtl-accessibility.md) rule 1 and
  [ADR-0005](../adr/0005-persian-first-rtl-native-ui.md).
- **No numeric appearance names for anything but the spacing scale.** Spacing keeps a numeric scale
  because the relationship between its steps *is* the meaning; nothing else does.

## The groups

Approximate counts. They are budgets, not inventories — the point of stating them is that exceeding
one is a signal to look at the design rather than at the token file.

| Group | ~Count | Contents |
| --- | --- | --- |
| `color.surface` | 3 | canvas · raised · recessed. Three, because [foundations.md](foundations.md) defines three |
| `color.fg` | 4 | default · muted · accent · on-accent. `muted` is still ≥ 7:1 |
| `color.border` | 3 | hairline · emphasis · focus |
| `color.state.*` | 6 × 3 | The six coloured roles from [color.md](color.md), each with fg, bg, border. `verification` and `truth` are ink and take no colour tokens |
| `type.*` | 11 roles | Each bundling family, size, line-height, weight and tracking. A component asks for a role, never for a size |
| `type.family` | 2 | text · mono |
| `space.*` | 7 + 3 | The scale, plus `gutter`, `row`, `section` |
| `radius.*` | 3 | none · control · surface |
| `border.width.*` | 2 | hairline · emphasis |
| `elevation.*` | 2 | flat · overlay |
| `motion.duration.*` | 3 | instant · short · medium |
| `motion.easing.*` | 2 | standard · exit |
| `breakpoint.*` | 3 | compact · regular · wide |
| `target.*` | 2 | comfortable (44) · minimum (24) |
| `focus.*` | 3 | ring width · offset · the two-tone pair |

**Roughly 90 tokens.** That is the whole system.

## Density is a token set, not a token

Worker, employer and operations differ in row rhythm ([foundations.md](foundations.md)). That is
expressed as **one alias set rebound per surface** — `space.row`, `space.gutter`, `target.*` — not as
a `density` token that components branch on.

A component that reads a density flag and changes its layout is two components. A component that
consumes `space.row` and gets a different value in a different context is one component that works
everywhere, which is the difference between a design system and a theme.

## What may not become a token

| Not a token | Because |
| --- | --- |
| Gradients | None exist ([ADR-0012](../adr/0012-visual-product-language.md)). A gradient token is how one would arrive |
| Shadows beyond `elevation.overlay` | Card shadows are a named anti-goal |
| A `brand.*` colour beyond ink and accent | The palette is the decision; extending it is a new decision |
| Per-status colours | Statuses take a **role**. A `status.disputed.color` token is a new visual treatment per status, which [state-vocabulary.md](state-vocabulary.md) rule 4 forbids |
| Opacity for text | Opacity produces unverifiable contrast. Muted text is its own colour token, contrast-checked |
| `left` / `right` anything | [ADR-0005](../adr/0005-persian-first-rtl-native-ui.md) |
| Font sizes independent of a type role | Would let a component set 13px Persian, which [typography.md](typography.md) prohibits |
| A `z-index` scale | Two elevation levels need no scale |
| Icon sizes | Icons scale with their text role |

## Contrast pairing is fixed in the token layer

Foreground and surface tokens are published as **verified pairs**, and a component composes a pair
rather than two independent tokens. This is what makes token rule 6 — contrast is a token constraint,
not a review finding — actually true rather than aspirational: an unverified pairing is not
expressible.

The pair table is generated and checked at GATE 2, not asserted here.

## The anti-explosion rule

**A token is added when a value appears in a third place**, and not before —
[design-system.md](design-system.md)'s extraction rule applied to values.

A token added in advance encodes a guess about a screen that has not been designed, and the cost is
not the token: it is that the next contributor finds a plausible name and uses it for something
adjacent. That is how a 90-token system becomes a 400-token system in which nobody can tell which
token is correct.

## Themes

The token layer is semantic, so a dark theme is an alternative binding of the same names. Nothing in
this architecture precludes it; nothing in the prototype provides it
([visual-language.md](visual-language.md)).

The one obligation on GATE 2 is that no component reads a raw value, so that a theme is possible
without touching a component. That is already token rule 1; it is repeated here because it is the
rule a theme requirement would expose.
