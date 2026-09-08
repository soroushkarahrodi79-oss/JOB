# ADR-0012 — Visual product language: the Evidence Margin

**Status:** Accepted · **Date:** 2026-09-07
**Scope:** the investor-facing functional prototype. This ADR makes no production or brand
commitment, and does not resolve D8 (product name and brand identity).

## Context

GATE 1.5 had to choose a visual language for a Persian-first, RTL-native flexible-work marketplace
whose central product claim is that a worker's record is **evidenced rather than asserted**
([../product/charter.md](../product/charter.md)).

The market's available visual languages all encode a claim this product rejects:

| Reference | Encodes | Contradicts |
| --- | --- | --- |
| Freelance marketplace card grid | People as browsable inventory with ratings | Principles 6 and 9; domain invariant 4 |
| Professional network | A profile you author about yourself | Domain invariant 1 — the Passport is computed |
| Gig dispatch app | Colour-coded work states, urgency | Principle 8 |
| Enterprise HR | Requisitions, pipelines, KPI tiles | Persona P2 is not a recruiter |
| Fintech | Balances, vaults, "secured" states | Charter non-goal; Q5; truth-matrix row 12 |
| Government portal | Institutional formality, bureaucratic register | Personas P1 and P2 |

Adopting any of them would make the interface argue against the product. The visual system therefore
had to be chosen for what it makes structurally easy to say, not for what it looks like.

Three directions were developed and assessed. They are recorded in full, with their risks, in
[../design/visual-language.md](../design/visual-language.md).

## Decision

**The selected direction is the Evidence Margin.**

A calm documentary content column, with a persistent **provenance margin** at the inline start of
every claim. The margin carries where a statement came from — self-declared, verified (simulated in
the prototype), observed, or derived — and the truth label where a capability is not `FUNCTIONAL`.

Four decisions follow, and they are the ADR:

**1. Provenance is a layout structure, not a decoration.** Every displayed claim occupies a row with
a margin position. A claim with nothing to put in the margin is a defect, not a plain row. This is
domain invariant 2 and design principle 6 expressed as geometry, which is the only form of them a
future contributor cannot quietly skip.

**2. Provenance is never encoded in hue.** The four provenance levels are distinguished by mark
form, by an always-present text label, and by position — never by colour. Colour carries semantic
*state*; it never carries where a fact came from. Consequence: the system passes the
colour-alone test for its most important distinction by construction rather than by review.

**3. The brand is ink, and the accent is nearly absent.** One dark accent, used only for
interactive affordance, focus and selection. No gradient token exists in the system. No large brand
fill exists. A product that colours its surfaces is asking to be trusted for its confidence; this one
asks to be trusted for its record.

**4. The system contains no primitive for asserting without evidence.** Specifically, and
enforceably: no score, gauge, star, tier, level, streak or percentile primitive; no network or graph
visualisation; no profile photograph or generated avatar; no file-upload control; no padlock,
shield, vault or safe icon; no gradient; no illustration asset; no animated numeric counter. Each
absence is traceable to a canonical rule, and each is listed with its reason in
[../design/visual-language.md](../design/visual-language.md).

## Typography and colour

Persian-first, self-hosted, semantic-role type scale, and a restrained ink palette with semantic
state roles held separate from brand. These are canonical in
[../design/typography.md](../design/typography.md) and [../design/color.md](../design/color.md) and
are not restated here.

One decision belongs in this record because it constrains a foundational technology
([README.md](README.md)): **the Persian text face is a self-hosted, redistributable open face, and
it is not fetched from any CDN.** This follows [ADR-0005](0005-persian-first-rtl-native-ui.md) and
[ADR-0008](0008-provisional-application-stack.md) constraint 4. The specific face is a
prototype-provisional default recorded as **D19**, `PENDING AUTHORISATION`, because its licence has
not been verified by anyone and an agent must not assert a licence fact.

## Consequences

- Every component specification is a specification of what its evidence rows contain. Component
  documents are canonical in [../design/components/](../design/components/).
- The prototype will look less impressive than its competitors' screenshots in exactly the places
  the charter says it should: no score, no photograph, no chart of a Work Graph, no escrow balance.
  This is the same trade [ADR-0004](0004-demo-truth-taxonomy.md) already made, applied visually.
- Decision 4's absences are enforceable at GATE 2: a system with no gradient token cannot grow a
  gradient by drift, and a token set is reviewable in a way a style guide is not.
- The margin costs horizontal space, which is scarcest on the worker's phone — the primary surface.
  The collapse rule (margin becomes a leading marker, never disappears) is specified in
  [../design/foundations.md](../design/foundations.md) and is the highest-risk detail in the system.
- Adding any primitive named in decision 4 requires a superseding ADR. This is deliberate: each one
  is individually reasonable and collectively they would reconstruct the product the charter
  rejects.

## Rejected alternatives

Assessed in full in [../design/visual-language.md](../design/visual-language.md).

- **Documentary Record**, without the margin — the same restraint, with provenance carried by prose
  qualifiers instead of structure. Rejected: a qualifier in prose is removable by a copy edit, and
  the honesty guarantee then depends on discipline rather than on the component.
- **Operational Card** — faster to read and the most conventional. Rejected: a card grid of people
  is the gig-marketplace form the charter and principle 9 rule out, and the four provenance levels
  have nowhere to live inside a card.
- **A dark, high-contrast "trust" theme** — considered and dropped early. It reads as fintech
  security theatre and it inverts the documentary metaphor the product depends on.
