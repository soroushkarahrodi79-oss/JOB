# Adversarial Review of the Visual System

> **Canonical for:** the GATE 1.5 adversarial audit — the questions asked, the findings, the
> corrections made, and the risks knowingly carried forward.
> **Not canonical for:** anything the corrections changed. Each correction is recorded in the
> document it belongs to; this document records that the audit happened and what it found.
> **Status:** Draft. Performed 2026-09-07 against the documents in this directory.

Thirteen audits, each run as an attempt to convict the system rather than to clear it. Findings that
were corrected are marked **corrected** and name the document the correction lives in. Findings that
could not be closed at a documentation gate are marked **carried**, and every one of them is
restated in the GATE 2 risk list at the end.

An audit with no findings is an audit that was not performed. Nine of the thirteen produced at least
one.

---

## 1 · Does this look like Fiverr?

**Verdict: no, after two corrections.**

The prosecuting case: a marketplace where employers browse people, ordered, with quality signals on
each row. That is structurally Fiverr, and structure is what a visual language either rescues or
confirms.

- **Corrected.** An early draft of E-04 carried a monogram avatar for each candidate. Removed
  entirely — no photograph, no generated avatar, no colour-coded person mark
  ([visual-language.md](visual-language.md)). A face is not evidence, no storage port exists, and a
  colour randomly assigned to a person is a dignity failure wearing a UI convention.
- **Corrected.** The candidate list is rows on a shared ground, `radius.none`, separated by hairlines
  — not cards. The card-grid-of-people form is the single most recognisable signal in this category
  and it was worth spending the anti-goal on.

Standing differences: no ratings, no stars, no reviews, no price ordering, no "top rated", no
packages, no gigs. Ordering is explained in named stages and can be argued with.

## 2 · Does this look like LinkedIn?

**Verdict: no, after one correction.**

- **Corrected.** The Worker Passport's first draft opened with an identity header at display size —
  a headline area, in effect. Reduced to `type.title` and one line of context, because a hero header
  is a profile convention and the Passport is not a profile
  ([components/worker-passport.md](components/worker-passport.md)).

Standing differences: no cover image, no headline, no endorsements, no connections, no feed, no
"who viewed you", no editable profile fields at all. The accent is a deep teal used only on
interactive affordance, which cannot be read as the professional-network blue because it never fills
anything.

## 3 · Does this look like cheap-labour software?

**Verdict: no, after three corrections.** This was the most productive audit.

- **Corrected.** Bulk selection of candidates was assumed and is now prohibited. A checkbox column
  beside a list of humans is the defining form of workforce-dispatch software; invitations are issued
  one at a time, each as its own act ([visual-language.md](visual-language.md)).
- **Corrected.** Availability had been drafted as a green/red pair. Both states are now `neutral`
  ([state-vocabulary.md](state-vocabulary.md)). Availability is a fact about a calendar; a red dot on
  a person is a judgement about them.
- **Corrected.** Internal identifiers (`WKR-01`) appeared in worker and employer surfaces in early
  drafts. They now appear only in operations and demo scaffolding. Referring to a person by a system
  identifier in front of the people who hire them is the tell this audit exists to find.

Standing: `NotEligible` is `neutral`, never red and never a cross; excluded candidates are not
dimmed; operations does not get a denser row mode.

## 4 · Does this look like enterprise HR?

**Verdict: no, after two corrections.**

- **Corrected.** The neutral ramp was cool in the first draft. It is now warm. This sounds like a
  taste question and is not: cool neutrals plus dense rows *is* the enterprise-HR signal, and the
  drift is one palette revision away, so the warmth is fixed in token values rather than left to
  implementation ([color.md](color.md)).
- **Corrected.** E-01 had acquired a counts strip. Removed. E-01 is a queue of what is waiting on
  this employer and how long it has waited — design principle 3 rules out dashboards as a default,
  and a counts strip is a dashboard with fewer pixels ([navigation.md](navigation.md)).

Standing: no requisitions, no pipeline stages, no saved searches, no candidate funnel, no reports, no
filters row on operations.

## 5 · Does this look like fintech or crypto?

**Verdict: no.** The strongest result, and it is structural rather than stylistic.

The icon set contains no padlock, shield, vault or safe. The token set contains no gradient. There is
no balance, no wallet, no held-funds figure, and no progress bar on the payment chain. The surface
has no primitive capable of expressing custody, so the honest rendering is also the only available
one ([components/payment-surface.md](components/payment-surface.md)).

- **Noted, not corrected.** `type.amount` at 24px with tabular figures is a fintech-adjacent device.
  It is retained because pay is genuinely the dominant fact on an opportunity card, and it is
  constrained to one use per surface. A screen with several large figures would fail this audit.

## 6 · Does this look like a government portal?

**Verdict: no, after one correction and one addition.**

- **Corrected.** E-02's step sequence had a percentage-complete indicator. Removed. Named steps are
  fine; a completion percentage on a form is administrative-portal furniture, and this system renders
  no percentages at all ([typography.md](typography.md)).
- **Added.** The register rule in [visual-language.md](visual-language.md). This audit's real finding
  is that a government portal is made of *language* before it is made of colour: bureaucratic Persian
  — nominalised, passive, honorific — would defeat every typographic decision in this system. Plain
  active second-person Persian is now a binding rule rather than a copy preference.

Standing: no crest, no seal, no full-width institutional colour bar, no dense tabular forms as the
default, no institutional green or blue.

## 7 · Does Persian content break hierarchy?

**Verdict: not in the specification. Two risks carried into implementation.**

Corrections already folded into [typography.md](typography.md), each from a specific failure:

- Body set at 17/1.75 rather than a Latin-tuned 16/1.5, because Persian's optical size at a given em
  is smaller.
- `letter-spacing: 0` on Persian, mandatory — positive tracking breaks cursive joining and is the
  most visible "built by someone who does not read Persian" defect available.
- No synthesised italic, no case transform, no `justify`.
- Bold prohibited below `type.detail`, because Persian counters fill in.
- No type role below 15px anywhere, so provenance can never become fine print.
- **Corrected** in [state-vocabulary.md](state-vocabulary.md): chips wrap to two lines and never
  truncate. «بدون پاسخ کارفرما تأیید شد» does not fit a Latin-sized chip and is not compressible,
  and a fixed-height chip is exactly how a Latin-tuned component breaks in Persian.

**Carried — R1.** Persian tabular figures. `font-variant-numeric: tabular-nums` is applied by many
faces to Latin lining figures only and silently does nothing to Extended Arabic-Indic digits. Every
money column, every ratio and the whole payment record depend on this. Verification at GATE 2 must be
a rendered comparison, not a declaration that the property is set.

**Carried — R2.** Persian weight separation. The scale assumes a usable 400/600/700 in the selected
face. Weight differences that read clearly in Latin often close up in Persian at body size. If the
selected face fails, hierarchy has to be rebuilt from size and space alone.

## 8 · Is any state communicated only by colour?

**Verdict: no.** Audited state by state.

Every state in [state-vocabulary.md](state-vocabulary.md) renders label + mark + role, and the label
is never an abbreviation. Provenance — the system's most important distinction — carries no hue at
all. Marks are glyphs, so they survive forced-colors substitution. The one permitted chart carries
every value in text and is fully readable with the bar removed.

- **Corrected.** The truth chip's hatch was load-bearing in an early draft. The chip's meaning is now
  its border and its text; the hatch is an enhancement that may be lost in forced-colors mode without
  anything being lost ([color.md](color.md)).

**Carried — R3.** The doubled border marking epistemically qualified content may collapse to a single
border under forced colors, losing the reserved signal. Mitigated by the header stating «فرضیه» in
words, which is the actual carrier; the border is recognition, not meaning. GATE 2 must confirm the
header cannot be visually separated from the panel it heads.

## 9 · Are badges being used where evidence should be?

**Verdict: no, after one correction and one structural prohibition.**

- **Corrected.** A "verified" chip without source and date existed in the first Passport draft. Now
  prohibited: a verified row states what was checked, by whom, when, and its `SIMULATED` chip
  ([components/worker-passport.md](components/worker-passport.md)).
- **Structural.** A chip may only render a state from the state vocabulary. It may never render a
  judgement, a tier, an achievement, or a summary — so «کارگر مطمئن» is not a design choice that was
  rejected, it is a rendering the component cannot produce
  ([state-vocabulary.md](state-vocabulary.md) rule 5).
- Dispute findings render as full sentences with their recorded basis, never as chips. A finding
  compressed into a badge becomes a verdict about a person, which is precisely what the Platform
  declines to issue.

## 10 · Is worker dignity preserved?

**Verdict: yes, after two corrections.** The audit that found the subtlest defect in the system.

- **Corrected.** `ApprovedByNonResponse` was `warning` everywhere, including on the *worker's*
  record. That put a caveat colour on her record for something an employer failed to do. The role now
  follows whose behaviour the state describes; the label does not change, so the fact is not softened
  ([state-vocabulary.md](state-vocabulary.md)). The rule generalises to `Cancelled` and `Contested`.
- **Corrected.** W-01's count of opportunities the worker is not eligible for (D9's default) had been
  drafted as a bare count, which is a running tally of rejection on the worker's home screen. It now
  renders as an actionable statement naming the requirement most often missing, with the route to
  what would satisfy it — never as a count of refusals.

Standing: no photographs or avatars; no dimming of excluded people; `NotEligible` in `neutral`; one
exclusion reason and the component cannot render two; `Declined` and `Expired` annotated as not
reliability signals; no leaderboards, streaks, levels or scores; no animated counters; no bulk
selection of people; the worker sees exactly what the employer sees; empty Passport framed by what
verification unlocks rather than by what is missing.

## 11 · Is employer trust reciprocal?

**Verdict: yes, after one correction.**

- **Corrected.** The employer's trust profile was initially reachable only from a work item. It is
  now in the employer's own chrome ([navigation.md](navigation.md)). A profile findable only when
  something has gone wrong is not reciprocity, it is a complaints surface.

Standing: E-08 has equal rigour to W-08 with a different structure, and the structural difference is
justified by the reader's question rather than by the subject's status; OPS-02 gives both parties
equal area, which is a layout rule rather than an intention; W-02 renders three employer trust
questions inline rather than behind a link; submitted proof awaiting employer action is explicit and
does not imply approval or release; there is no employer-facing control that suppresses, softens or
contextualises any element of the profile.

The commercial tension — that an employer might prefer a product that records none of this — is
recorded rather than designed around
([components/employer-trust-profile.md](components/employer-trust-profile.md)).

## 12 · Are simulated capabilities visually honest without dominating?

**Verdict: yes, and this audit produced the collapse rule.**

The tension is real: [ADR-0004](../adr/0004-demo-truth-taxonomy.md) requires labelling at the point
of use, and W-07's payment chronology would otherwise become a column of identical annotations, which
trains the eye to skip them.

- **Corrected.** The collapse rule ([color.md](color.md)): consecutive identical chips within one
  chronology collapse to a single chip on the containing block, with the level still named in each
  entry's own text and the chip still linking to SH-02. Point-of-use labelling survives in words; what
  is removed is visual repetition.
- **Guarded.** The rule applies only within one chronology, only to identical consecutive levels, and
  never across a screen. It is not a licence to label once per screen, which is the failure
  [ADR-0004](../adr/0004-demo-truth-taxonomy.md) rejects by name.
- `FUNCTIONAL` is unmarked, so the honest majority of the product is quiet.
- Truth chips are ink, not alarm colour. They read as annotation, not as warning.

**Carried — R4.** The hatch texture at chip size on a low-DPI screen may read as noise or moiré. The
border and label carry the meaning, so the failure is cosmetic — but it is on the product's most
important honesty signal, and GATE 2 must test it on a cheap device rather than a design monitor.

## 13 · Does the system work without gradients, illustrations or decorative charts?

**Verdict: yes, by construction.**

There is no gradient token, no illustration asset, and exactly one permitted chart form which is
optional, labelled, and redundant with its text. Empty states are typographic sentences — a decision
that also serves principle 7, since illustration is weight persona P1 pays for.

- **Corrected.** Skeleton loading states were assumed and are now prohibited: drawing four rows
  before knowing there are four is a small lie, and the empty Passport is a core product moment
  rather than a loading artefact ([visual-language.md](visual-language.md)).

The system's entire visual interest comes from typography, rules, marks and alignment. That is a
narrow base and it is the correct one for a product whose argument is a record.

---

## Risks carried into GATE 2

Every one of these is a verification task, not an open design question. None blocks this gate; all
must be discharged before the visual system is built on.

| # | Risk | Discharged by |
| --- | --- | --- |
| **R1** | Persian tabular figures may be absent from the selected face, silently misaligning every money column | A rendered comparison of a Persian figure column, on the selected face — not a CSS declaration |
| **R2** | Persian weight separation may be insufficient at body size, collapsing hierarchy | Rendered comparison at `type.body` and `type.detail` |
| **R3** | The doubled border may not survive forced-colors mode | Confirm the epistemic header carries the meaning and cannot be separated from its panel |
| **R4** | The truth chip's hatch may read as noise at chip size on a low-DPI screen | Test on a low-cost device, not a design monitor |
| **R5** | The provenance margin's collapse at 320px with long Persian provenance labels is unverified | Build the longest real case — «تأییدشده — شبیه‌سازی‌شده» on a wrapping claim — at 320px |
| **R6** | 17/1.75 plus the margin makes the opportunity card tall; fewer cards per screen slows comparison | Measured, on a real device, against a worker comparing three shifts. The trade is accepted; its size is not known |
| **R7** | OPS-02's four regions at `compact` are a long scroll | Confirmed as complete-but-slow rather than partial. Nothing decision-critical may be dropped |
| **R8** | D19 — the typeface is unselected and no licence has been verified | Human selection against the seven criteria in [typography.md](typography.md), including a person reading the licence |

R8 is the only one that is not purely a verification task, and it is recorded as a
prototype-provisional default `PENDING AUTHORISATION` in
[../open-decisions.md](../open-decisions.md) rather than decided here. An agent may not assert that a
font licence permits redistribution.
