# Evidence Chronology and the Dispute Review

> **Canonical for:** the chronology primitive, the Proof-of-Work capture and amendment patterns, and
> the OPS-02 case-review layout.
> **Not canonical for:** the proof mechanisms (see
> [../../product/experience/proof-of-work.md](../../product/experience/proof-of-work.md)), the
> dispute scenario or its findings (see
> [../../product/experience/disputes.md](../../product/experience/disputes.md)), or entity states
> (see [../../domain/state-transitions.md](../../domain/state-transitions.md)).
> **Status:** Draft.

## One primitive, six surfaces

The chronology is the second structural device in the system, after the provenance margin. It renders
on W-05, W-06, W-07, E-06, E-07 and OPS-02, and on band 3 of the Worker Passport — the same
component, filtered.

That reuse is the design answer to a real risk: if the dispute view were built as its own surface, it
would become an admin tool, and the evidence in it would look assembled for the occasion. It is
assembled from work the product was doing anyway, and it should look like the same record the worker
was reading during her shift, because it is.

### Structure

An append-only vertical list, strictly chronological, ascending, at the inline start. Each entry:

```
⟨provenance mark⟩   ۱۶:۰۳ · پنجشنبه ۱۵ شهریور
                    ورود ثبت شد
                    ثبت‌شده توسط سامانه  ⟨SIMULATED — قدرت تأیید⟩
```

- **Absolute Jalali date and clock time on every entry.** A relative time may be added on a live
  surface; it never replaces the absolute one, because a relative time is unusable as evidence
  ([../typography.md](../typography.md)).
- **Times recorded by `ClockPort` are annotated as system-recorded**, distinguishing them from
  anything either party typed. A time either party can edit is not evidence, and the annotation is
  where that becomes visible to a reader who does not know the architecture.
- **The actor is named on every entry.** Who did this is half of what an entry means.
- **Nothing is ever removed, edited, greyed or collapsed.** A correction is a new entry referencing
  the earlier one; both remain, both rendered at full weight.
- **Entries never group by type.** Order is the meaning. A chronology sorted into sections is a
  summary, and a summary is what a dispute cannot use.
- **Semantically a list**, so linearised reading preserves order
  ([../foundations.md](../foundations.md)).

### The amendment block

An amendment is not a row. It renders as a **bracketed block** inside the chronology, and it is the
only entry type given more weight than the others:

```
┌ اصلاح شرایط · ۱۸:۴۰ · ثبت‌شده توسط کارفرما
│  پایان شیفت:   ۲۲:۰۰  ←  ۲۳:۳۰
│  دامنهٔ کار:    ... ← ...
└ تأیید شد توسط کارگر · ۱۸:۴۴  ⟨observed⟩
```

Rendered as a **diff**: what the term was, what it became, who recorded it, who acknowledged it, and
when each happened. Never as prose, never as a notification, never as a message.

It is weighted because it is the decisive artifact in Story C, and it exists as structured evidence
because the product refused to build a chat
([../../product/experience/disputes.md](../../product/experience/disputes.md)). The visual
consequence of that decision should be visible in the record.

**At the moment of recording** (E-06), the surface states in plain words that an amendment is a
recorded change to agreed terms, that the worker must acknowledge it, and that it is visible in any
later case. An employer who does not understand that has been given a trap rather than a tool, and
the statement is in the composer, not in help text.

## Proof of Work capture

### Check-in (W-05)

The employer's screen shows the code; the worker enters it on arrival.

- **The code renders in `type.code`** — monospace, letter-spaced, grouped, Persian digits, at
  display size. It has to be readable across a counter in bad light on a cheap screen.
- **Entry accepts Persian, Arabic-Indic and ASCII digits** and normalises them
  ([../../architecture/data-model.md](../../architecture/data-model.md)). A worker whose keyboard
  produces one system must not fail because the field expected another.
- **Rejection is a first-class state, not an incidental error.** An invalid code and an
  already-used code have distinct, specific messages naming the correction
  ([../foundations.md](../foundations.md)). Both must be reachable in the demo — a simulated adapter
  that only accepts the happy path is `MOCK` and must be labelled `MOCK`.
- The arrival entry's `SIMULATED` chip attaches to the **attestation strength**, beside the strength,
  not to the screen. The check-in logic itself is `FUNCTIONAL` and is unmarked.
- **No QR, no camera, no geofence.** A code works on the cheapest phone with a poor camera in a badly
  lit storeroom, and an automatic geofenced check-in removes the worker's deliberate act, which is
  the thing that keeps this from being surveillance.

### Completion (W-06)

Structured fields defined by the employer, plus a free note. No media, no upload control, not even a
disabled one ([../visual-language.md](../visual-language.md)).

**The no-automatic-outcome rule is stated before the submit action**, in the flow, at `type.body` —
not after it, not in a confirmation, not in help. A worker should never learn by experiencing it
that employer non-response leaves proof unresolved and does not release payment.

Field count is capped by what can be answered honestly in under a minute by someone who wants to go
home. A long checklist gets straight-lined, and a straight-lined checklist is worse than none because
it looks like evidence.

### Employer decision (E-07)

Approve or contest, with the submitted proof and the remaining window both rendered.

- **The contest path requires a stated reason** and shows, before it is taken, what contesting does:
  it opens a case, it does not cancel the obligation, and the Platform will not decide it.
- Approve and contest are **not styled as a positive and a negative**. Both are legitimate; styling
  contest as destructive would discourage a legitimate act and styling approve as the safe default
  would encourage a careless one.
- The Preferred Crew marking sits immediately after approval, phrased as a recorded intention rather
  than a rating ([explanation.md](explanation.md)).

## The dispute review — OPS-02

The visual priority is claim versus counterclaim, then timeline, then evidence, then trust history.
Designed at `wide`; must remain complete at `compact`.

### Region 1 — The two accounts

Side by side. **Equal width, equal typographic weight, equal prominence.** Each labelled with the
party and when their account was recorded.

Neither is the default. The party who raised the case is not rendered first-by-privilege, is not
given more space, and is not framed as the reporter of a problem — that framing decides the case
before the record is read. At `compact` they stack, adjacently and equally, never with one below a
fold from the other.

### Region 2 — The chronology

Full width. The same component from the worker's own shift screen, unfiltered, with the amendment
block in its normal weight — which is already the heaviest thing in it.

Nothing here is highlighted as suspicious, decisive, or relevant. The operator decides what is
decisive; an interface that pre-highlights has made a recommendation.

### Region 3 — Evidence

Each item traceable to the event that produced it: terms as accepted, arrival attestation, the
amendment and its acknowledgement, the completion submission and its timestamps, recorded times.

**There is no free-text field on this screen.** Evidence cannot be typed here, at all. This is F7 —
evidence is assembled, not re-entered — expressed as the absence of a control, and it happens also to
be WCAG 2.2, 3.3.7. The demo requirement is that no evidence is typed in during the review; the
design guarantee is that it cannot be.

### Region 4 — Both parties' records

Worker Passport and Employer Trust Profile, rendered read-only in place, **side by side, equal
area**.

Equal area is the reciprocity guarantee made a layout rule. Story C's decisive move is that the
employer's own amendment pattern complicates the employer's own claim, and a layout that gave the
worker's record more space would quietly restore the asymmetry the model exists to prevent.

Read-only in place, with no route to an editable surface — routing an operator to an editable profile
mid-case is how records get quietly corrected.

Data minimisation applies most sharply here (persona P3): outcomes and events only, never underlying
verification evidence, which is not stored.

### No resolution action on this screen

The commissioning brief for this gate placed the resolution action at the end of OPS-02. The locked
screen inventory separates it: **OPS-03 is a different screen**, because every consequential
operations action is attributed and recorded, and putting the decision on the same surface as the
evidence invites deciding while scrolling.

The inventory is canonical. OPS-02 ends in a transition to OPS-03, not in a decision control.

### What OPS-02 does not have

No suggested outcome, no recommendation, no risk score, no confidence figure — a recommendation
engine here would be an unexplainable judgment about people, which is the thing the product refuses
to build.

No KPI tiles, no case counts, no charts, no filters row, no bulk actions, no system-health panel.
Each of those is what turns a case review into an admin console, and the screen inventory rejected
the console explicitly.

## OPS-03 — Recording the outcome

- **Findings render as full sentences**, each with what it means and its payment consequence
  ([../../product/experience/disputes.md](../../product/experience/disputes.md)). Never as chips,
  never as a select of short labels. A finding compressed into a badge becomes a verdict about a
  person.
- **`RecordInconclusive` is rendered with the same weight as every other finding**, never as a
  fallback, an "other", or a last option. An operations tool that cannot say "I do not know" will
  manufacture certainty.
- The screen states, in the operator's own view, that the Platform records the outcome and does not
  enforce it.
- The attribution — who recorded this, when — is rendered as part of the finding, not in a log
  elsewhere.
- After resolution, neither party acquires a badge, a flag, or a score change. The dispute appears in
  band 3 of both records as an event with its outcome, at ordinary weight.

## Anti-patterns

| Anti-pattern | Why |
| --- | --- |
| A chronology entry edited, removed, greyed or superseded | Destroys the credibility of everything derived from it |
| Grouping the chronology by event type | Order is the meaning |
| Relative times in place of absolute ones in evidence | Unusable as evidence |
| An amendment rendered as a message or a notification | It is a change to agreed terms, and the distinction is the whole argument |
| A free-text evidence field on OPS-02 | F7; WCAG 2.2 3.3.7 |
| Highlighting "key" evidence for the operator | A recommendation wearing an emphasis |
| Unequal space for the two accounts, or for the two records | Decides the case by layout |
| Approve styled as safe, contest styled as destructive | Both are legitimate acts |
| A photograph or file-upload affordance anywhere | D17; prefer absence over a dead control |
| A resolution control on OPS-02 | Deciding while scrolling |
| Findings as chips or short labels | Turns a finding about a record into a verdict about a person |
