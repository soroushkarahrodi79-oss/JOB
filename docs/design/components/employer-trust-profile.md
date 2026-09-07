# Employer Trust Profile — Surface Specification

> **Canonical for:** how the Employer Trust Profile is presented, and why its structure differs from
> the Worker Passport's.
> **Not canonical for:** what it contains (see
> [../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md)), or its
> screen's purpose (see [../../product/screen-inventory.md](../../product/screen-inventory.md) E-08).
> **Status:** Draft.

## Reciprocal, not symmetrical

Both profiles are one model applied twice
([../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md)). The same
four provenance layers, the same denominators, the same absence of a composite. If the *rigour*
differs, reciprocity is decoration — and the drift always runs the same way, with the paying side
measured more gently.

The **structure** differs, and it differs for a reason that is about the reader rather than about the
subject.

A worker's Passport answers *what has this person done, and how do you know?* It is organised by
provenance, because provenance is the claim being made.

An employer's Trust Profile answers a different question, asked by someone with something at stake:
*if I accept this, what are the ways it goes badly for me?* It is organised by **counterparty
question**, because that is the shape of the decision.

Cloning the Passport's band structure here would produce a technically correct surface that answers
nobody's question. The provenance marks are still on every row — the four layers are not abandoned,
they are subordinated to the question.

## Structure — four questions

Each renders as a question in the employer-facing and worker-facing voice, then its answer as a
ratio, then the material behind it.

### ۱ — «آیا پرداخت می‌کند؟»

Commitments reaching reported settlement, as «X از Y». Typical elapsed time from proof approval to
reported settlement.

Every settlement figure carries the `SIMULATED` chip and the word «گزارش‌شده» — the Platform knows
what an adapter told it, and this is the surface where that distinction is most likely to be read as
pedantry and most needs to survive
([../../product/experience/payment.md](../../product/experience/payment.md)).

### ۲ — «آیا لغو می‌کند؟»

Cancellations after acceptance, as «X از Y», with the lead-time distribution.

This is the one place in the prototype where the permitted chart form is used
([../foundations.md](../foundations.md)): a stacked proportion bar of lead-time buckets, every
segment labelled with its value, and the same information fully readable with the bar removed. A
cancellation two hours before a shift and one three days before are different facts about a
counterparty, and a single rate hides that.

### ۳ — «آیا وسط کار شرایط را عوض می‌کند؟»

Amendments recorded per engagement, and how many were acknowledged.

`EMP-01`'s amendment pattern is the strongest demonstration in the prototype that the trust model is
genuinely two-sided — it is the employer's own recorded behaviour complicating the employer's own
claim at beat C4. The presentation obligation is that it renders here **exactly as neutrally as it
renders on a worker's record**: a count with a denominator, a provenance mark, links to the
engagements. No warning tone, no flag, no threshold above which it becomes an alert.

An amendment is a legitimate act. Making it look like misconduct would be the interface passing a
judgement, and it would also make the honest employer stop recording amendments — which would destroy
the evidence the dispute case depends on.

### ۴ — «آیا به گزارش پایان کار پاسخ می‌دهد؟»

Proof decisions, split three ways and **never summed**: approved, contested, and resolved by
non-response.

The third is kept visually separate and carries the `warning` role
([../state-vocabulary.md](../state-vocabulary.md)). An employer who never responds is a different
counterparty from one who approves promptly, and a combined "resolved" figure would erase precisely
the difference a worker needs.

## Supporting material

Below the four questions, at lower prominence and in the same evidence-row form:

- Completed engagements, and opportunities published and filled.
- Repeat-worker relationships.
- Worker feedback attestations.
- Open and closed disputes with their recorded findings, rendered as sentences rather than chips
  ([../state-vocabulary.md](../state-vocabulary.md)).
- Business verification outcome and date, with its `SIMULATED` chip. Self-declared business type,
  neighbourhood and work patterns, each with the hollow provenance mark.

There is no composite, no rating, no "trusted employer" mark, and no threshold at which one would
appear.

## The worker's view, on W-02

A worker deciding whether to rely on stated terms is entitled to the same class of evidence the
employer gets about her. Showing an employer's payment reliability only to the employer would make
reciprocity decorative
([../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md)).

**Questions 1, 3 and 4 render inline on W-02**, as three answered question lines with their ratios —
not as a link, not as a disclosure, not as a summary badge. Question 2 and the supporting material are
one tap away on the full profile.

Three inline lines were chosen over a link because a link is a thing a worker in a hurry does not
follow, and over the full profile because the full profile is not the decision she is making. The
three are the ones that bear on *this* decision: will I be paid, will the job change under me, and
will anyone answer when I report that I have finished.

Nothing employer-identifying beyond what the opportunity already discloses is added.

## Empty and thin states

`EMP-04` is unverified with a poor record, and the surface must render that without editorialising.

- A question with no computable answer renders «هنوز قابل محاسبه نیست», never a zero and never a
  neutral-sounding placeholder.
- Absence of verification renders as absence: «تأیید کسب‌وکار انجام نشده است», `neutral`, with no
  warning tone. Whether that matters is the reader's judgement, and the surface's job is to make it
  visible rather than to make it alarming.
- A thin employer record is not styled differently from a thick one. The denominators do the work.

## Anti-patterns

| Anti-pattern | Why |
| --- | --- |
| A composite employer score, rating or "trusted" badge | Symmetric with the worker-side refusal, and for the same reasons |
| Amendments or cancellations styled as warnings or flags | The Platform does not judge; and it would suppress the recording the dispute model depends on |
| Approved and resolved-by-non-response summed into one "resolved" figure | Erases the distinction that matters most to a worker |
| Settlement shown as confirmed rather than reported | The Platform does not know money arrived |
| Payment reliability visible only to the employer | Reciprocity as decoration |
| A gentler denominator rule than the worker side gets | The asymmetry the model exists to prevent |
| Cloning the Passport's band order here | Structurally correct, and answers nobody's question |
| A trend line, sparkline or "improving/declining" indicator | A claim about direction the record does not support |

## The commercial tension, stated

An employer might reasonably prefer a product that does not record amendments, does not publish
settlement times, and does not count non-responses. That preference is real, it is the commercial
tension at the centre of the thesis, and it is recorded rather than designed around
([../../product/experience/trust-profiles.md](../../product/experience/trust-profiles.md)).

The design consequence is narrow and worth stating: **there is no employer-facing control that
suppresses, softens, delays or contextualises any element of this profile.** No "add a response", no
"explain this cancellation", no visibility setting. If a right of correction turns out to be required
(Q12, `UNKNOWN`), it arrives as a compensating record with its own provenance — never as an edit, and
never as a control that hides a row.
