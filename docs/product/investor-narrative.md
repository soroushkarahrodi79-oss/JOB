# Investor Narrative and Golden Path

> **Canonical for:** the Investor Golden Path — which surfaces the primary investor demo traverses,
> in what order, with what time budget, proving what — and the narration rules.
> **Not canonical for:** the stories or their beats (see [demo-scenarios.md](demo-scenarios.md)),
> the screens themselves or their primary/supporting classification (see
> [screen-inventory.md](screen-inventory.md)), or any capability's behaviour (see
> [experience/](experience/)). This document sequences; it does not define.
> **Status:** Draft.

## Golden Path versus inventory

Two different things, deliberately separated:

- The **screen inventory** is all 24 retained prototype surfaces. That is the product.
- The **Investor Golden Path** is the **13 surfaces** the primary demo stops on, in **14 views**.
  That is the argument.

The other 11 surfaces exist, work, and are reachable during the demo. They are not stopped on,
because a demo that visits every screen has stopped making a case and started giving a tour. They
are marked supporting in [screen-inventory.md](screen-inventory.md), and most of them are the right
answer to a question rather than a scheduled stop.

**Estimated duration: approximately 10 minutes 40 seconds**, inside the 8–12 minute budget, leaving
room for interruption.

## The arc

The path traces **one transaction end to end**, then shows what it left behind:

```
NEED → MATCH → TRUST → WORK → PROOF → PAYMENT → REPUTATION → REHIRE
```

…and then stress-tests it, because a record nobody contests has never been examined.

An investor who has never seen this product should leave able to state the thesis in one sentence:
**a worker's record of reliable work becomes portable and evidenced, which lets an employer hire on
eligibility rather than on acquaintance — and completed transactions accumulate into a Work Graph
that makes the next hire cheaper than the last.**

Everything runs through one opportunity, `OPP-01`, with two positions. One engagement completes. The
other is disputed. Both share the same shift, the same terms and the same amendment, so the
difference between the outcomes is visible in the record rather than asserted.

> **Prototype-provisional defaults — D1 and D8.** D1 — that personas P1 and P2 are correct and that
> the Worker Passport is the right primary value proposition — is OPEN, and no user research exists.
> The through-line above is stated as the thesis under D1's authorised provisional default: proceed
> on the stated hypothesis, **flagged as unvalidated**. The flag is not optional in an investor
> setting. The recorded risk is that employers' real reservation is trust in the Platform rather than
> in the worker, which would shift emphasis toward guarantees the Platform is not positioned to give.
> D8 — the product name — is also OPEN, and the demo runs under the placeholder "the Platform".
> Both stay OPEN; values, revisit triggers and pilot-transfer status are in
> [open-decisions.md](../open-decisions.md).

---

## The Golden Path

| # | Stage | Surface | Beats | Time |
| --- | --- | --- | --- | --- |
| 1 | Frame | SH-02 Truth Ledger | — | 0:30 |
| 2 | **NEED** | E-02 Opportunity Creation | B1, B2, B3 | 0:50 |
| 3 | **NEED** | E-03 Factors and Classification Signal | B4, B5 | 0:40 |
| 4 | **MATCH** | E-04 Candidate List (`OPP-01`) | B6, B7, B8 | 1:05 |
| 5 | **TRUST** | W-02 Opportunity Detail and Eligibility | A1, A2, A3 | 0:55 |
| 6 | **TRUST** | W-03 Verification → acceptance | A4, A5 | 0:35 |
| 7 | **WORK** | W-05 Engagement Detail — check-in, then amendment | A6, A7, B9 | 0:45 |
| 8 | **PROOF** | W-06 Completion Proof Submission | A8 | 0:30 |
| 9 | **PROOF** | E-07 Proof Review — approve and rehire, then contest | B10, B11 | 0:50 |
| 10 | **PAYMENT** | W-07 Payment and Receipt — fail, retry, reported | A9 | 0:45 |
| 11 | **REPUTATION** | W-08 Worker Passport | A10 | 0:40 |
| 12 | **REHIRE** | E-04 Candidate List (`OPP-02`, second view) | B12 | 0:35 |
| 13 | Stress test | OPS-02 Case Review | C1, C2, C3, C4 | 0:55 |
| 14 | Stress test | OPS-03 Resolution Recording | C5, C6 | 0:40 |
| — | Close | SH-02 Truth Ledger, revisited | — | 0:25 |

13 distinct surfaces, 14 views: E-04 appears twice, before and after the Work Graph accumulated.
That repetition is the cheapest demonstration of REHIRE available — the same screen, changed only by
what happened in between — and it is why the count is 14 rather than 13.

Four stages compress several transitions into one surface rather than adding stops: W-05 carries
check-in and the amendment acknowledgement; E-07 carries an approval, a rehire marking and a
contest; W-07 carries a settlement failure, a retry and a reported settlement; OPS-02 carries both
claims, the assembled evidence and both parties' records.

---

## Stage detail

### 1 · Frame — SH-02 · 0:30

**Shown.** The truth ledger: what is functional, what is simulated, what is mocked, what is absent
— before anything has been demonstrated.

**Understanding.** *This team will tell me which parts are real without my asking.*

Leading with this is a deliberate cost. It gives away that much of the demo is simulated at the
moment of maximum attention. Discovering it at question time is worse, and the discipline is the
product's actual differentiator in a market of confident prototypes.

### 2 · NEED — E-02 · 0:50

**Shown.** A café operator publishes a shift in under a minute: need, time, place, pay, two
positions. Then eligibility as concrete binary requirements. Then a recorded payment commitment,
stated at the point of commitment as a commitment the Platform *records* rather than money the
Platform *holds*.

**Proves.** Eligibility-first does not mean slow. Persona P2 will not write a job specification.

**Understanding.** *They are not holding the money, which means they have thought about what they
are not licensed to do.*

### 3 · NEED — E-03 · 0:40

**Shown.** A small number of factor questions, most already derived from what was just entered.
Then the classification signal with its contributing factors, its `HYPOTHESIS` label, and at least
one factor shown as **uncaptured**.

**Proves.** Engagement-factor capture and a classification signal that is neither ignored nor
overclaimed (S6).

**Understanding.** *They have taken a position on the hardest regulatory question in this category
without pretending to have answered it.*

> **Prototype-provisional default — D3.** The signal informs and does not block. See
> [experience/classification.md](experience/classification.md) for why blocking is unavailable under
> [ADR-0010](../adr/0010-prototype-provisional-defaults.md).

### 4 · MATCH — E-04 (`OPP-01`) · 1:05

**Shown.** The candidate list. Each candidate's reason for qualifying, and each ordering position's
named reason. A worker with **no history at all** qualifies on eligibility alone. A visibly capable,
better-reviewed worker sits in a separate non-ranked **excluded** group with the single requirement
she does not meet. Two invitations issued.

**Proves.** Eligibility is binary and explainable; exclusion is a category, not a low score (domain
invariant 4). Charter success criterion 2, tested directly.

**Understanding.** *A job board would have shown me that excluded person as a weaker match and let
me discover the problem on the day. And a newcomer with no reputation is still hireable here, which
is the supply-side answer.*

The exclusion costs the demo its most impressive candidate. That is the point, and it makes this the
most persuasive screen on the path.

### 5 · TRUST — W-02 · 0:55

**Shown.** The worker's side of the same opportunity. Full terms before any commitment. Eligibility
requirement by requirement, each with its basis — and one requirement met only by her own
declaration, marked as such. The employer's own payment reliability, visible to her.

**Proves.** Provenance, and that trust runs both ways before anyone commits.

**Understanding.** *The system distinguishes what she said from what was checked. And she can see
whether this employer actually pays.*

The moment to point at is the self-declared marker. It makes the Passport look weaker and it is the
reason the Passport is worth anything.

### 6 · TRUST — W-03, then acceptance · 0:35

**Shown.** Verification requested now — at the moment it unlocks acceptance, not at signup — and
labelled `SIMULATED`. Then acceptance, confirming exactly the terms from the previous stage.

**Proves.** Effort is asked for where the user can see the return (design principle 5).

> **Prototype-provisional default — D2.** Verification before acceptance. D2 stays OPEN; see
> [open-decisions.md](../open-decisions.md). The acceptance confirmation itself is W-04, a
> supporting surface passed through rather than dwelt on.

### 7 · WORK — W-05 · 0:45

**Shown.** Check-in produces a recorded arrival with a time. Then the employer's mid-shift amendment
arrives and is acknowledged — a structured, timestamped change to agreed terms, not a chat message.

**Proves.** The event record everything downstream derives from.

**Understanding.** *They did not build a messaging product, and the thing they built instead is
evidence.*

### 8 · PROOF — W-06 · 0:30

**Shown.** Completion proof as structured fields plus a note. No photograph, and the demo says that
is a decision rather than a gap. The response window and the non-response rule are stated *before*
submission.

**Proves.** Proof is captured as evidence, not asserted after the fact.

### 9 · PROOF — E-07 · 0:50

**Shown.** The employer approves one worker's proof and marks her for rehire. Then contests the
**other** worker's proof, with a stated reason, opening a case.

**Proves.** The employer's highest-consequence decision, and the entry to the unhappy path.

Preferred Crew is created here because immediately after approving someone's work is the only moment
anyone can honestly answer "would you work with them again".

### 10 · PAYMENT — W-07 · 0:45

**Shown.** The payment chain, and the simulated release **failing** in front of the audience. The
ledger stays consistent, the commitment survives, the retry succeeds, and both attempts remain in
the record.

**Proves.** The payment port models failure — the difference between a prototype that can take a
real provider and one that must be rewritten to.

**Understanding.** *Every prototype's payment chain succeeds. This one didn't, on purpose, which
means the state machine is real.*

This is the stage most likely to be cut under time pressure. It should not be.

### 11 · REPUTATION — W-08 · 0:40

**Shown.** The Passport after one engagement. Four layers kept apart. Rates with their denominators
— "1 of 1", never "100%". Still thin, and the product does not pretend otherwise.

**Proves.** The record is computed from events, not authored, and it is honest about small samples.

The temptation here is a fuller Passport. One that looked impressive after a single shift would
falsify the claim that it is evidential.

### 12 · REHIRE — E-04 (`OPP-02`) · 0:35

**Shown.** The employer's next opportunity. The same candidate-list screen from stage 4 — and the
worker from stage 5 now leads it, on a prior-relationship reason that traces to the engagement the
audience just watched.

**Proves.** The Work Graph. Completed transactions accumulate into a reusable relationship record,
shown as an effect on a decision rather than as a diagram.

**Understanding.** *The thing built in the last six minutes just made the next hire cheaper. That is
the compounding asset, and it belongs to the worker as much as to the employer.*

Thirty-five seconds, and it is what the whole path exists to enable.

### 13 · Stress test — OPS-02 · 0:55

**Shown.** The case. Both claims side by side — the employer says the work was not completed as
agreed; the worker says the scope changed mid-shift and the work ran over. Then the evidence, none
of it re-entered: the terms as accepted, the arrival event, the amendment and its acknowledgement,
the completion submission and its timestamps. Then both parties' records, including the employer's
amendment frequency.

**Proves.** Trust and safety as evidence-driven casework over a record neither party could edit
(S4), and reciprocal accountability.

**Understanding.** *The evidence deciding this came from work the product was doing anyway. And they
examined the paying customer, which most marketplaces do not.*

The line worth saying aloud: **the decisive artifact exists because the product refused to build a
chat.**

### 14 · Stress test — OPS-03 · 0:40

**Shown.** An attributed finding about the record — not a verdict about the parties — with partial
release. The Platform states that it records the outcome and does not enforce it. The consequence
propagates to both records as an event, with no punitive score, badge or suspension.

**Proves.** The neutral-intermediary posture, held under pressure.

### Close — SH-02 revisited · 0:25

**Shown.** Back to the truth ledger, now with every row the demo exercised traceable to where it was
seen. Then the absences: no escrow, no score, no photographs, no chat, no legal verdict, no
nationwide claim.

**Understanding.** *Everything I was shown, I can locate on that matrix. Nothing was oversold.*

---

## Supporting surfaces, and when to open them

Not on the path. Reachable throughout, and most are the right answer to a predictable question.

| Surface | Open it when asked |
| --- | --- |
| SH-01 Demo Entry and Actor Switch | "How are you switching between these people?" — and it declares itself demo scaffolding. |
| SH-03 Notification Outbox | "Did she actually get a text?" No. Nothing leaves the system; here is the `MOCK` outbox. |
| W-01 Opportunity Feed | "What does a worker see when nobody has invited them?" |
| W-04 Offer Acceptance | Passed through at stage 6. Stop on it for "what exactly did she agree to?" — the terms snapshot. |
| W-09 Worker Case Response | "Does the worker get to answer?" Yes; her account was recorded here before operations saw it. |
| E-01 Employer Home | "What does the employer's day actually look like?" |
| E-05 Candidate Detail | "What does the employer see about a worker?" — the full Passport, identical to the worker's own view. |
| E-06 Engagement Monitoring | "How did the employer make that mid-shift change?" |
| E-08 Employer Trust Profile | "Is the employer measured too?" Yes — the full reciprocal record. |
| E-09 Employer Case Response | "What did the employer claim, in their words?" |
| OPS-01 Case Queue | "How much of this is manual?" |

E-08 is the most likely to be requested. Reciprocity is already demonstrated twice on the path — the
employer's payment reliability on W-02, and the employer's amendment pattern being examined at
OPS-02 — so the screen deepens the point rather than establishing it.

## Narration rules

Binding, and inherited from [ADR-0004](../adr/0004-demo-truth-taxonomy.md) and
[ADR-0007](../adr/0007-legal-claims-carry-epistemic-status.md).

1. No simulated capability is described as live, in speech, slides, or recordings. "Simulated" is
   said aloud the first time each one appears.
2. No legal conclusion is stated. The classification signal is described as a signal with recorded
   factors, and the open questions are acknowledged if asked.
3. No compliance posture is claimed. The project has none.
4. No real provider, bank, registry or carrier is named.
5. The demo data is described as synthetic when first shown.
6. Roadmap statements are labelled as intentions, not as built capability. A `PLANNED` row is not
   discussed as though it exists.
7. Where a prototype-provisional default is visible — verification timing, the classification signal
   informing rather than blocking, the exclusion reason shown to the worker — it is described as a
   prototype choice with the decision still open, not as a settled product position.
8. If a question cannot be answered honestly within these rules, the answer is that it is open, and
   where it is recorded.

Rule 8 is the one that will be tested. An investor asking "so can you actually pay people?" is
entitled to a direct answer: not yet, no provider is connected, and the reason is recorded as Q5.
