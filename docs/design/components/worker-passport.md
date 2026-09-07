# Worker Passport — Surface Specification

> **Canonical for:** how the Worker Passport is presented — its structure, its empty state, its
> provenance rendering, and what visibly changes after an engagement.
> **Not canonical for:** what the Passport contains (see
> [../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md)), what it
> *is* (see [../../domain/domain-model.md](../../domain/domain-model.md)), or its screen's purpose
> (see [../../product/screen-inventory.md](../../product/screen-inventory.md) W-08).
> **Status:** Draft.

**This document decides presentation only.** Contents are owned elsewhere and are referenced, never
restated. Where a section below names an element, it is naming where that element sits — not
defining it.

## Why this is not a profile

A profile is authored by its subject. The Passport is computed from events and cannot be authored
(domain invariant 1). Every presentation decision below follows from that one difference, and the
surface has to make it visible without a caption explaining it.

Three consequences:

- **The organising structure is provenance, not topic.** The bands below are ordered by where a fact
  came from. A worker scrolling her own Passport reads it in order of increasing evidential weight,
  which is the argument the product is making.
- **Nothing on the surface is an editable field.** Routes exist to author *attestations*; nothing
  writes the projection. The visual difference is real: the Passport has no form controls in it, only
  links out to the places attestations are made.
- **There is no photograph and no avatar** ([../visual-language.md](../visual-language.md)). A person
  is identified by name and, where disambiguation is genuinely needed, an ink monogram. No generated
  colour, no illustration.

## Structure — four bands

Bands appear in this order, always, and are never interleaved. Each opens with its provenance name
and one sentence saying what that provenance means — because "self-declared" is a distinction the
worker herself needs to understand before she can trust that the rest of it is different.

### Band 0 — Identity context

Name, city, languages, and how long she has been on the Platform. Verification outcomes appear here
as marks with their source and date; the underlying identifier does not exist in the system and is
therefore not absent from the screen, it is absent from the product.

Not a hero section. No cover area, no large type, no headline field. `type.title`, one line of
context, and the bands begin.

### Band 1 — «خوداظهار» · Self-declared

Skills, availability pattern, travel boundary, languages. Every row carries the hollow provenance
mark.

**Corroboration is annotated, never promoted.** Where observed history supports a declared skill, the
row keeps its hollow mark and gains a second line: «۳ همکاری کامل‌شده در این مهارت» linking into
band 3. It does not become a verified row and it does not change mark. Promotion would collapse the
distinction that the four layers exist to keep apart, and it is the single most tempting shortcut on
this surface.

### Band 2 — «تأییدشده» · Verified

Identity and certificate outcomes. Each row: what was checked, by whom, when, and the `SIMULATED`
truth chip on the outcome.

Scope is stated on the row, in words: a verified identity outcome says what it establishes and, by
its narrowness, what it does not. A verification badge with no stated scope is the badge-without-
evidence failure in its most common form.

Empty state for a worker with no verification: a sentence and the route, not a prompt styled as a
deficiency. «هنوز چیزی تأیید نشده است.» — not «۰ تأییدیه» and not a warning.

### Band 3 — «ثبت‌شده» · Observed history

The engagement record. Completed engagements with employer, date and duration; arrival records
against schedule; cancellations with actor and lead time; amendments received and acknowledged;
disputes with their recorded outcomes; employers worked with; employer feedback attestations.

Rendered as an evidence chronology ([evidence-chronology.md](evidence-chronology.md)), most recent
first, **every row linking to the engagement it came from.** A row that cannot link does not belong
in this band, and its presence is a defect rather than a display choice.

This band is where `Declined`, `Expired` and `Cancelled` appear, each with the annotation
[../state-vocabulary.md](../state-vocabulary.md) requires. An unannotated «پیشنهاد رد شد» on a
person's record will be read as a black mark whatever the domain intends.

### Band 4 — «محاسبه‌شده» · Derived

Completion, on-time arrival, cancellation by lead time, repeat hire, offer response time.

- Rendered on `surface.recessed` — the only place in the product that uses it — so the computed
  material is visibly downstream of the recorded material above it.
- **Every figure is «X از Y» in Persian digits. No percentage exists**
  ([../typography.md](../typography.md)).
- Every figure carries a bracket provenance mark and a link to the rows in band 3 it was computed
  from. A derived number that cannot be opened into its inputs is an assertion.
- A metric with no computable value renders **a sentence, never a zero**:
  «هنوز قابل محاسبه نیست». `۰ از ۰` and `—` are both prohibited; the first is false and the second is
  unreadable.

## No score, and what the surface does instead

There is no composite, no star average, no tier, no level, no percentile
([../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md)). The
design obligation that follows is not to leave a hole where a reviewer expects a number, but to make
the top of the surface answer the question a score would have answered.

It does that with **band 4's first three figures rendered adjacently**, each with its denominator and
its link. Three specific, openable ratios read faster than one opaque number and, unlike the number,
they can be argued with. A reviewer who asks where the score is has understood the product.

## The empty Passport

`WKR-01` before `OPP-01` is scenario S2, and this is a designed moment rather than a degraded one.

- Band 1 is populated — she declared skills and availability.
- Band 2: «هنوز چیزی تأیید نشده است» plus the route to W-03, framed by what verification unlocks
  (principle 5), not by what is missing.
- Band 3: «هنوز سابقهٔ ثبت‌شده‌ای وجود ندارد» and one sentence explaining that history accumulates
  from completed work rather than from filling in a profile — which is the product's answer to how a
  newcomer is hireable at all.
- Band 4: «هنوز چیزی برای محاسبه نیست».

Prohibited on the empty state: progress rings, completion percentages, "your profile is ۴۰٪
complete", a checklist of tasks, an illustration, or any framing in which the worker is behind.
Every one of them converts an honest thin record into a personal deficiency, and the whole point of
scenario S2 is that a thin record is not a disqualification.

## What visibly changes after the Golden Path engagement

Beat A10. The changes are enumerated in
[../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md); this is how
they are shown.

**A change ledger appears at the top of W-08**, headed «از آخرین بازدید شما چه چیزی تغییر کرد»,
listing each change as a row with its provenance mark and a link to the event that caused it:

| Band | What appears in the ledger |
| --- | --- |
| 1 | «مهارت‌های اعلام‌شده اکنون با سابقهٔ ثبت‌شده پشتیبانی می‌شوند» — and the mark stays hollow |
| 2 | The identity outcome, dated, with its `SIMULATED` chip |
| 3 | One completed engagement, one on-time arrival, one acknowledged amendment, one employer feedback attestation, one settled payment |
| 4 | Completion «۱ از ۱»; on-time arrival «۱ از ۱»; cancellations «۰ از ۱»; repeat hire «هنوز قابل محاسبه نیست» |

Five rules on the ledger, and they are what keeps this moment honest:

1. **It is a list, not an animation.** No counters, no reveal, no celebration
   ([../foundations.md](../foundations.md)).
2. **Every row links to its source event.** The ledger is a navigation aid into band 3, not a
   summary that replaces it.
3. **Repeat hire renders as "not yet computable", never as zero.** A zero here would be the first
   false number on the surface.
4. **The ledger is dismissible and then reachable.** It is not a permanent banner.
5. **It says nothing about how the Passport is now stronger.** The rows are facts; the reading is
   the worker's.

The honest description of the after state is *still thin, no longer empty, and every line of it
traceable*. The design must not improve on that. A Passport that looked impressive after one shift
would falsify the claim the whole product rests on, and this surface is where that falsification
would happen.

## The second change, and where it is visible

The engagement also makes `WKR-01` a prior-relationship candidate for `EMP-01` — and that is shown on
**E-04**, not here ([explanation.md](explanation.md)). The Passport does not claim it.

That separation is deliberate and worth protecting: the Passport's argument is that the record
becomes useful to someone other than its owner, and the only convincing place to demonstrate that is
on the other person's screen.

## Employer and operations views

The same component, rendered on E-05 and inside OPS-02.

- **Identical content and identical provenance marks.** There is no employer-only field, no
  employer-only summary, and no field the worker cannot see
  ([../../product/experience/matching.md](../../product/experience/matching.md) requirement 4).
- On OPS-02 it is read-only in place, with no route to an editable surface — the screen inventory's
  reason being that routing an operator to an editable profile mid-case is how records get quietly
  corrected.
- Data minimisation applies most sharply on the operations rendering (persona P3): the bands render
  outcomes and events, never underlying verification evidence, which is not stored.

## Anti-patterns

| Anti-pattern | Why |
| --- | --- |
| Any composite score, level, tier or star average | The product's central refusal |
| A verification badge without source, scope and date | Badge instead of evidence (principle 6) |
| Promoting a corroborated declaration to "verified" | Collapses the four layers |
| A percentage anywhere | [../typography.md](../typography.md) |
| Zero where a metric is not yet computable | A false number |
| Profile-completion progress, checklists, prompts framed as deficiency | Principles 5 and 9 |
| Photograph, avatar, colour-coded person mark | [../visual-language.md](../visual-language.md) |
| Editable fields on the Passport surface | Would suggest the projection is authored |
| A band 3 row that does not link to its engagement | An untraceable claim |
| Reordering bands so derived metrics appear first | Inverts the argument the structure makes |
