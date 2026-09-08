# Visual Language — Direction, Decision and Non-Goals

> **Canonical for:** the visual direction, the directions rejected, and the visual and product ideas
> deliberately excluded from the prototype.
> **Not canonical for:** design values (see [design-principles.md](design-principles.md)),
> typography (see [typography.md](typography.md)), colour (see [color.md](color.md)), state
> rendering (see [state-vocabulary.md](state-vocabulary.md)), or design-system governance (see
> [design-system.md](design-system.md)).
> **Status:** Draft. Decision recorded in [../adr/0012-visual-product-language.md](../adr/0012-visual-product-language.md).

## What the visual language has to do

Three qualities, communicated through structure rather than assertion. No screen says
"trustworthy" anywhere, in any language.

| Quality | Expressed as | Failure mode it must avoid |
| --- | --- | --- |
| **TRUSTWORTHY** | Every claim shows where it came from, at the same visual priority as the claim itself. | Confidence styling — polish read as credibility. |
| **FAST** | The decision a screen exists for is answerable without scrolling, expanding or hovering. | Density read as capability. |
| **DIGNIFIED** | A person is a record with a history, never a tile, a score, or a colour. | Efficiency read as permission to compress people. |

These are in tension. Provenance costs space, and space costs speed. The resolution is stated once
and every component follows it: **provenance is compressed, never removed.** On a phone the margin
becomes a leading marker and a short label. It never becomes a tooltip, and it never disappears.

---

## The three directions

Each was developed far enough to be judged, against the same screen — E-04's candidate list, which
[../product/investor-narrative.md](../product/investor-narrative.md) calls the most persuasive
surface on the path.

### Direction A — Documentary Record

Ink on warm paper. Hairline rules instead of shadows, typographic hierarchy instead of containers,
tabular alignment as a first-class device. The reference is a well-set reference work or a ledger —
not a dashboard.

- **Emotional tone.** Considered, unhurried; institutional in the library sense rather than the
  ministry sense.
- **Strengths.** Restraint is cheap to render and cheap to load (principle 7). Hierarchy is built
  from size and space, so it survives Persian. Nothing in it can be mistaken for a fintech or gig
  aesthetic.
- **Risks.** Two, both severe. Warm neutrals drifting cool turn this into enterprise HR within one
  palette revision. And provenance has to live in prose — "verified (simulated)" as a qualifier
  after a claim — which a copy edit can delete. The honesty guarantee becomes discipline.
- **TRUSTWORTHY / FAST / DIGNIFIED.** High / medium-high / high.
- **Persian and RTL.** Excellent. Persian wants generous leading and clear rules, and a documentary
  layout has no Latin-tuned grid to break.
- **Worker and employer.** Good for the employer's reading task. Adequate, not strong, for the
  worker's phone, where the task is comparison under time pressure.
- **Investor demo.** Sober and distinctive, and carries a real risk of reading as unfinished to an
  audience that equates polish with progress.
- **Long-term.** Very good. It ages well and absorbs new content types without new visual devices.

### Direction B — Operational Card

Discrete card objects with clear edges, large touch targets, colour-coded work states, bold numerals
for time and money. The reference is a transit app or a kitchen ticket rail.

- **Emotional tone.** Immediate, tool-like, slightly urgent.
- **Strengths.** Fastest to scan on a phone. Most familiar to both personas. Cheapest route to a
  competent-looking demo.
- **Risks.** It is the gig-marketplace form. A grid of cards representing people is inventory
  presentation, which principle 9 rules out in terms. Colour-coded states collide with the
  colour-alone prohibition and invite a palette that grows one hue per new state. There is no place
  inside a card for four provenance levels, so provenance becomes badges — and badges without
  provenance are precisely what principle 6 rules out.
- **TRUSTWORTHY / FAST / DIGNIFIED.** Medium / very high / medium-low.
- **Persian and RTL.** Adequate. Cards are direction-agnostic; the risk is fixed card heights
  breaking on long Persian state labels.
- **Worker and employer.** Strong for the worker's feed, weak for the employer's evidence reading,
  actively wrong for operations casework.
- **Investor demo.** Immediately legible and completely undifferentiated. A reviewer places it in a
  known category within seconds, which is the outcome this product most needs to avoid.
- **Long-term.** Poor. Every new fact type wants a new badge.

### Direction C — Evidence Margin

Direction A's substrate plus one structural device: a persistent **provenance margin** at the inline
start of every claim. The margin carries the provenance mark, its text label, and the truth label
where the capability behind the claim is not `FUNCTIONAL`. The content column stays calm; the margin
does the honesty work.

- **Emotional tone.** Annotated, examined, deliberate. A record someone has checked, rather than a
  record someone is presenting.
- **Strengths.** The product's central claim becomes a layout invariant. A row with an empty margin
  is visibly wrong, so omitted provenance is a rendering defect rather than a copy oversight. It also
  makes four provenance levels legible without four colours, which resolves the colour-alone problem
  for the distinction that matters most.
- **Risks.** The margin degrades into decoration if anything else is allowed into it — so nothing
  else is. It costs horizontal space on the smallest screen, which is the primary surface; the
  collapse rule is therefore the highest-risk detail in the system and is specified rather than left
  to implementation. And an over-marked interface reads as suspicious of itself, so the system caps
  marking at one mark per claim and forbids a mark on a mark.
- **TRUSTWORTHY / FAST / DIGNIFIED.** Highest / high / highest.
- **Persian and RTL.** Strongest of the three, for a structural reason. The margin belongs at the
  inline start, which in Persian is the right edge. Defined in logical terms from the first line, it
  is not a mirrored Western sidebar — it is a device with no physical direction at all. This is
  [ADR-0005](../adr/0005-persian-first-rtl-native-ui.md) made visible rather than merely obeyed.
- **Worker and employer.** The same device at two densities: one marker per row on the phone, a full
  margin rail on the desktop. Operations gets the same rail again, which is why the case review is
  not a separate visual language.
- **Investor demo.** Highest. The device *is* the thesis, so the screens argue the pitch without the
  narration having to.
- **Long-term.** Good. A new fact type needs a provenance level, not a new visual treatment — and
  there are exactly four provenance levels, owned by the domain rather than by design.

---

## Decision

**Direction C — Evidence Margin — is selected.**

Direction A is retained as its typographic and chromatic substrate: C is A with one structural
addition, not a different aesthetic. Direction B contributes exactly two things — its touch-target
minimums and its numeric prominence — applied to the worker's mobile surfaces only.

The deciding argument is not appearance. A and B both make honesty a matter of author discipline;
C makes it a matter of structure. In a product whose first hard rule is *never present a simulated
capability as real*, a visual system in which the honest thing is also the structurally easy thing
is worth more than one that merely permits it.

**"Evidence Margin" is a design-system term.** It is not a product name, not a brand, and not
something the interface ever says to a user. D8 stays open.

---

## Visual non-goals

Recorded so that each absence is a decision with a reason, and so that reintroducing one is visibly
a reversal rather than an addition. Anything below requires a superseding ADR.

### Absent primitives

| Absent | Why | Rule it would break |
| --- | --- | --- |
| Score, gauge, star rating, tier, level, percentile | Collapses provenance into one number and presents a person as a number | Principles 2, 6, 9; [../product/experience/trust-profiles.md](../product/experience/trust-profiles.md) |
| Streaks, achievement badges, leaderboards | Gamifies income | Principle 9 |
| Network or graph visualisation | Would present a projection as a claimed feature | [ADR-0009](../adr/0009-prototype-experience-architecture.md), and the screen-inventory rejection record |
| Profile photograph; generated or colour-coded avatar | A face is not evidence; there is no storage port; a colour-randomised person is a dignity failure | [ADR-0003](../adr/0003-provider-ports-and-adapters.md), D17, principle 9 |
| File-upload control, including a disabled one | Prefer absence over a dead affordance | [../demo-truth-matrix.md](../demo-truth-matrix.md); proof-of-work demonstration requirement 5 |
| Padlock, shield, vault, safe iconography | Implies custody of funds or of secrets, neither of which exists | Charter non-goal; Q5; truth-matrix row 12 |
| Balance, wallet or "available funds" surface | Same | Same |
| Gradient tokens of any kind | No product meaning, and the generic AI/fintech gradient is the most dated signal available | Principle 7; positioning |
| Illustration and decorative imagery | Weight the user pays for, carrying meaning it does not have | Principle 7 |
| Animated numeric counters | Dramatises a metric that should be read, not performed | Principles 6, 9 |
| Confetti, celebration, success animation | Income is not a game | Principles 8, 9 |
| Countdown urgency and scarcity cues | Manufactured pressure on someone deciding about income | Principle 8 |
| Skeleton screens that mimic content that may not exist | Drawing four rows before knowing there are four is a small lie, and the empty Passport is a core moment | Principle 1; scenario S2 |
| Marketing surfaces, landing pages, onboarding illustration | Not in the screen inventory | [../product/screen-inventory.md](../product/screen-inventory.md) |

**Dark mode** is not on that list, because it is not rejected on the merits. It is out of prototype
scope. The token layer is semantic, so a dark theme is a token-set addition rather than a redesign;
deciding it now would be design without a user to design for.

### Absent behaviours

- **No hover-dependent disclosure** of any term, requirement, amount, time or state. Hover does not
  exist on the worker's primary device and is not an accessible interaction. Hover may change
  emphasis on something already legible; it may never reveal.
- **No bulk selection of people.** Candidates are invited one at a time, each as its own act. A
  checkbox column beside a list of humans is the cheap-labour-software form, and E-04's own rationale
  is that the evidence justifying an invitation is already on the row.
- **No truncation** of a state label, a requirement, an amount, or a unit. If it does not fit, the
  container changes, not the content.
- **No internal identifier shown to a worker or an employer.** `WKR-01`, `OPP-01` and their kind
  appear only in operations surfaces and demo scaffolding, where they are working references.
- **No composite anything.** If two facts cannot be shown separately, they are not shown combined.

### Absent language

The Persian register is plain and direct — one competent adult addressing another. It is not
bureaucratic-administrative, not service-industry deferential, and not the compressed
English-derived product voice that reads as translated. Concretely: active voice, second person for
actions the reader takes, no honorific inflation, and no nominalised administrative constructions.

This is a visual decision as much as a copy one. Bureaucratic Persian is the fastest available route
to looking like a government portal, and no amount of typography survives it.
