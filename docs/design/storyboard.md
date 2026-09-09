# Golden Path Visual Storyboard

> **Canonical for:** the mapping from each Golden Path view to the visual system, and the
> confirmation that supporting screens reuse it.
> **Not canonical for:** the path, its order, its timing or what each stage proves (see
> [../product/investor-narrative.md](../product/investor-narrative.md)), the screens (see
> [../product/screen-inventory.md](../product/screen-inventory.md)), or the beats (see
> [../product/demo-scenarios.md](../product/demo-scenarios.md)).
> **Status:** Draft.

**The flow is locked and is not modified here.** Where a stage was awkward to design, the design
changed. Fourteen views over thirteen surfaces, in the narrative's order.

Each entry states: the visual objective, the dominant information, the primary action, the thesis
element it carries, the component patterns used, and what must remain rendered **without any
interaction** — the last being the operative one, because it is what a reviewer watching over a
shoulder actually sees.

---

### 1 · Frame — SH-02 Truth Ledger

- **Visual objective.** Look like a document of record, not a legal notice and not a feature list.
- **Dominant.** The capability matrix, with its four levels legible as levels.
- **Primary action.** None. This view is read.
- **Thesis.** Honesty before demonstration.
- **Patterns.** Evidence rows; truth chips at their canonical size; the hatch texture introduced here
  and recognised everywhere after.
- **Without interaction.** Every capability, its target and actual levels, and the screens each is
  exercised on. Nothing behind a filter or a tab.

### 2 · NEED — E-02 Opportunity Creation

- **Visual objective.** Look like a form a café operator finishes in under a minute, not a
  requisition.
- **Dominant.** Need, time, place, pay, headcount. Requirements as step two, each a binary condition.
- **Primary action.** Publish — placed after the terms it commits to.
- **Thesis.** Eligibility-first does not mean slow.
- **Patterns.** The commitment block ([components/payment-surface.md](components/payment-surface.md));
  requirement rows with met/unmet marks; `type.amount` on the pay figure.
- **Without interaction.** Every entered requirement as a binary condition; the amount with its unit;
  **the no-custody sentence inside the commitment block**; the acceptance-mode choice with invite-only
  pre-selected (D16).

### 3 · NEED — E-03 Factors and Classification Signal

- **Visual objective.** The doubled border, seen for the first and only time. The audience should
  register that this surface is different before reading a word of it.
- **Dominant.** The signal as a named position on a named spectrum, then its factors.
- **Primary action.** Publish — **outside the panel**, never disabled by it.
- **Thesis.** A position on the hardest regulatory question in the category, without pretending to
  have answered it.
- **Patterns.** [components/classification-signal.md](components/classification-signal.md).
- **Without interaction.** The `HYPOTHESIS` header; at least one **derived** factor naming the field
  it came from; at least one **uncaptured** factor at full weight; the legal footer at `type.body`;
  D3's provisional-default marking.

### 4 · MATCH — E-04 Candidate List (`OPP-01`)

- **Visual objective.** A list of people that does not look like a list of products. Rows, ink,
  reasons — no cards, no photographs, no ratings, no checkboxes.
- **Dominant.** Each candidate's eligibility state in the margin, and one ordering sentence per row.
- **Primary action.** Invite — **one candidate at a time**, each its own act.
- **Thesis.** Exclusion is a category, not a low score. Charter success criterion 2.
- **Patterns.** [components/explanation.md](components/explanation.md) ladder;
  [components/opportunity-card.md](components/opportunity-card.md) as the header; the excluded group.
- **Without interaction.** Every candidate's eligibility state; the top ordering reason on each row;
  the excluded group, **not dimmed, not ranked**, with the single unmet requirement named; the
  `SIMULATED` chip on distance. No score anywhere on the screen, because none exists.

*The excluded candidate is the most persuasive element on the path and she must be visible in the
first paint. She is not below a fold, not behind a "show excluded" toggle, and not greyed.*

### 5 · TRUST — W-02 Opportunity Detail and Eligibility

- **Visual objective.** The same facts as stage 4, from the other side, in the same visual language —
  so the audience sees that there is one record.
- **Dominant.** Terms; then eligibility, requirement by requirement, each with its basis.
- **Primary action.** Continue to acceptance — below the terms, never above them.
- **Thesis.** Provenance, and reciprocal trust before anyone commits.
- **Patterns.** Opportunity card as terms block; the ladder, expanded by default; the employer's
  three trust questions inline
  ([components/employer-trust-profile.md](components/employer-trust-profile.md)).
- **Without interaction.** Full pay, time and location; every requirement with its mark; **the
  self-declared marker on the requirement met only by her own declaration**; the employer's payment
  reliability as an answered question with its ratio; the no-custody sentence.

*The self-declared marker is the moment to point at. It makes the Passport look weaker and it is the
reason the Passport is worth anything — so it is rendered at the same weight as the verified marks
beside it, not smaller.*

### 6 · TRUST — W-03 Verification, then acceptance

- **Visual objective.** A short, honest, skippable-looking step that is asked for at the moment it
  buys something.
- **Dominant.** What verification unlocks — stated **before** what it asks for.
- **Primary action.** Verify. Declining is a visible, unpenalised option.
- **Thesis.** Earned effort (principle 5).
- **Patterns.** Verification provenance mark; `SIMULATED` chip on the outcome; D2 marked as a
  provisional default at the point of use.
- **Without interaction.** What it unlocks; the `SIMULATED` label; that no identity number is stored;
  the decline route. Then, on W-04, the terms snapshot **identical** to stage 5's.

*The verification step must be able to fail visibly. An adapter that only succeeds is `MOCK`.*

### 7 · WORK — W-05 Engagement Detail, check-in and amendment

- **Visual objective.** The chronology, introduced. This is where the audience first sees the record
  being made rather than read.
- **Dominant.** The check-in code at `type.code`; then the arrival entry appearing in the chronology
  with a system-recorded time.
- **Primary action.** Check in; then acknowledge the amendment.
- **Thesis.** The event record everything downstream derives from.
- **Patterns.** [components/evidence-chronology.md](components/evidence-chronology.md); the amendment
  block as a diff.
- **Without interaction.** The recorded arrival time and that the system recorded it; the amendment
  as a **before → after diff** with both actors and both times; the `SIMULATED` chip on the
  attestation strength, beside the strength.

*"They did not build a messaging product, and the thing they built instead is evidence" is an
argument the amendment block makes visually. It must not look like a message.*

### 8 · PROOF — W-06 Completion Proof Submission

- **Visual objective.** Structured evidence, visibly not a photograph and visibly not a chat.
- **Dominant.** The employer's completion fields, and the note.
- **Primary action.** Submit.
- **Thesis.** Proof is captured, not asserted after the fact.
- **Patterns.** Structured fields; the no-automatic-outcome statement.
- **Without interaction.** **Employer non-response leaves proof unresolved and does not release
  payment, before the submit action.** No upload control anywhere on the screen, including a
  disabled one.

### 9 · PROOF — E-07 Proof Review: approve, rehire, then contest

- **Visual objective.** Two legitimate acts, neither styled as the safe one.
- **Dominant.** The submitted proof, and the remaining window in `attention`.
- **Primary action.** Approve or contest — equal weight, contest requiring a stated reason.
- **Thesis.** The employer's highest-consequence decision, and the entry to the unhappy path.
- **Patterns.** Chronology; the Preferred Crew marking as a recorded intention
  ([components/explanation.md](components/explanation.md)).
- **Without interaction.** What contesting does — opens a case, does not cancel the obligation, the
  Platform will not decide it — **before** the contest action, not in its confirmation.

### 10 · PAYMENT — W-07 Payment and Receipt: fail, retry, reported

- **Visual objective.** A failure that is plainly a failure, in a record that plainly survives it.
- **Dominant.** The chronology of payment states, with the failed attempt and the retry both present.
- **Primary action.** Acknowledge receipt — offered, not required.
- **Thesis.** The payment port models failure. The difference between a prototype that can take a
  real provider and one that must be rewritten to.
- **Patterns.** [components/payment-surface.md](components/payment-surface.md); the only `critical` in
  the product.
- **Without interaction.** Both attempts; **the obligation-survives sentence beside the failure**;
  the word «گزارش‌شده» on the settlement; the no-custody statement; the `SIMULATED` labelling on each
  port-produced state.

*The stage most likely to be cut under time pressure, and it should not be.*

### 11 · REPUTATION — W-08 Worker Passport

- **Visual objective.** Four bands, kept apart, visibly ordered by provenance. Thin, and honest about
  it.
- **Dominant.** The change ledger, then bands 3 and 4.
- **Primary action.** None. This view is read.
- **Thesis.** The record is computed from events, not authored, and it is honest about small samples.
- **Patterns.** [components/worker-passport.md](components/worker-passport.md).
- **Without interaction.** All four band headers with their provenance explained; «۱ از ۱» rather than
  a percentage; repeat hire as «هنوز قابل محاسبه نیست» rather than zero; the still-hollow mark on the
  corroborated declared skills; every band-3 row linking to its engagement.

*The temptation is a fuller Passport. One that looked impressive after a single shift would falsify
the claim the product rests on — and this is the screen where the falsification would happen.*

### 12 · REHIRE — E-04 Candidate List (`OPP-02`)

- **Visual objective.** Recognisably the same screen as stage 4, changed only by what happened in
  between.
- **Dominant.** `WKR-01` at the top, with rung 6 of the ladder rendered on her row.
- **Primary action.** None required; the point is the ordering.
- **Thesis.** The Work Graph, shown as an effect on a decision rather than as a diagram.
- **Patterns.** The ladder's prior-relationship rung, naming the engagement and linking to it.
- **Without interaction.** The prior-relationship sentence naming **one completed engagement with
  this employer**, with its date, traceable to the engagement the audience just watched; the rung
  sitting **below** the solid eligibility rails.

*Thirty-five seconds, and it is what the whole path exists to enable. Nothing on this screen may
suggest the relationship introduced her — it ordered her.*

### 13 · Stress test — OPS-02 Case Review

- **Visual objective.** Casework over a record, not an admin console. The same chronology the worker
  read during her shift.
- **Dominant.** The two accounts, side by side and equal; then the chronology with the amendment.
- **Primary action.** None. The decision is OPS-03.
- **Thesis.** Evidence-driven casework over a record neither party could edit, and reciprocal
  accountability.
- **Patterns.** [components/evidence-chronology.md](components/evidence-chronology.md) regions 1–4;
  both trust surfaces read-only in place.
- **Without interaction.** Both claims at equal weight; the amendment block; both parties' records at
  **equal area**, including `EMP-01`'s amendment frequency. No suggested outcome, no highlighted
  evidence, no KPI row, and no field anything can be typed into.

*The line worth saying aloud — the decisive artifact exists because the product refused to build a
chat — is an argument the amendment block should already have made.*

### 14 · Stress test — OPS-03 Resolution Recording

- **Visual objective.** A finding about a record, rendered as a sentence, attributed.
- **Dominant.** The four available findings, each as a full sentence with its payment consequence.
- **Primary action.** Record the finding.
- **Thesis.** The neutral-intermediary posture, held under pressure.
- **Patterns.** Findings as sentences, never chips; partial release as two figures with their
  relationship in words.
- **Without interaction.** All four findings including `RecordInconclusive` at equal weight; the
  statement that the Platform records the outcome and does not enforce it; the attribution.

*Afterwards, on both records: a dispute event with its finding, at ordinary weight. No badge, no
flag, no score change — which is a visual absence the demo should point at.*

### Close — SH-02 revisited

- **Visual objective.** Recognition. Every chip the audience saw during the demo resolves to a row
  here.
- **Dominant.** The exercised rows, and then the absences.
- **Without interaction.** The absences stated as absences: no escrow, no score, no photographs, no
  chat, no legal verdict, no nationwide claim.

---

## Supporting-screen consistency

The eleven supporting surfaces use the same system. No secondary visual language exists, and the
check below is what confirms it rather than asserts it.

| Surface | Patterns reused | New pattern needed |
| --- | --- | --- |
| SH-01 Demo Entry and Actor Switch | Demo bar; hatch treatment ([navigation.md](navigation.md)) | None |
| SH-03 Notification Outbox | Chronology, filtered to messages; `MOCK` banner + per-message chips | None |
| W-01 Opportunity Feed and My Work | Opportunity card list; eligibility markers down the margin; the excluded count with its route | None |
| W-04 Offer Acceptance | The terms block from W-02, unchanged — that identity is the point | None |
| W-09 Worker Case Response | Chronology in **selection mode** | *Addition:* selection state on the chronology entry |
| E-01 Employer Home | Submitted-proof work-item rows in `attention`, with no timer | None |
| E-05 Candidate Detail | Worker Passport, identical; the ladder expanded | None |
| E-06 Engagement Monitoring | Chronology; the amendment composer | *Addition:* the composer, which authors the diff the block renders |
| E-08 Employer Trust Profile | The four questions; the one permitted chart | None |
| E-09 Employer Case Response | Chronology in selection mode — identical to W-09 | None |
| OPS-01 Case Queue | Case rows with age, parties and value | None |

**Two additions, both to the chronology**, and neither is a new visual language: a selection state on
an entry, and a composer that authors an amendment. Both were implied by the screen inventory and are
recorded here so GATE 2 builds them as chronology capabilities rather than as new components.

W-09 and E-09 use the **same** component with the same affordances. Story C is not an investigation
of the worker, and giving the two parties different composers is how it would quietly become one.
