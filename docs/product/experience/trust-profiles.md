# Trust Profiles — Worker Passport and Employer Trust Profile

> **Canonical for:** what the Worker Passport and the Employer Trust Profile contain in the
> prototype, how their layers are separated, and what visibly changes after an engagement.
> **Not canonical for:** what a Passport, Attestation or Reputation *is* (see
> [../../domain/domain-model.md](../../domain/domain-model.md)), how they are recomputed (see
> [../../domain/state-transitions.md](../../domain/state-transitions.md)), or truth statuses (see
> [../../demo-truth-matrix.md](../../demo-truth-matrix.md)).
> **Status:** Draft.

Both profiles are defined in one document because they are one model applied twice. If they drift
apart, reciprocity becomes a claim rather than a property — and the drift always goes the same way,
with the paying side measured more gently than the working side.

## The four layers

Every element of both profiles belongs to exactly one layer, and the layers are never rendered
identically. This is domain invariant 2 and design principle 6, made into a structure.

| Layer | Source | Strength | Can the subject change it? |
| --- | --- | --- | --- |
| **1 — Self-declared** | The person or business said so | Weakest | Yes, directly |
| **2 — Verified** | A verification port returned an outcome | Strongest for facts, narrowest in scope | Only by re-verifying |
| **3 — Observed history** | Recorded engagement events | Factual, not evaluative | No |
| **4 — Derived metrics** | Computed over layer 3 | Only as good as its inputs, and shows them | No |

Layer 2 stores the **outcome, its source and its time** — never the underlying document or
identifier ([../../architecture/data-model.md](../../architecture/data-model.md) rule 4). The
Passport therefore says "identity verified" and never shows an identity number, because none exists
in the system.

## No single score

Neither profile carries a composite trust score, a star average, a tier, a badge level, or a
percentile.

The reasons are cumulative and each is sufficient: a composite is unexplainable (design principle
2); it collapses provenance that the four layers exist to keep apart (principle 6); it presents a
person primarily as a number (principle 9); and it is the exact signal the charter says the Passport
replaces. A reviewer who asks "where is the score" has understood the product.

---

## Worker Passport — contents

### Layer 1 — Self-declared

Skills, from the small curated demo taxonomy (D5 prototype-provisional default). General availability pattern. Travel
boundary. Languages. Each carries a "declared by the worker" marker wherever it appears, including
inside a match explanation.

### Layer 2 — Verified

| Element | Truth | Note |
| --- | --- | --- |
| Identity check outcome | `SIMULATED` (row 3) | Outcome, source, date. No identifier stored or shown. |
| Certificate or licence check outcome | `SIMULATED` (row 3) | Same shape. Scope is exactly what was checked and nothing more. |

`HYPOTHESIS` · Whether this collection and retention model is lawful is Q3, `UNKNOWN`. Nothing here
asserts that it is.

### Layer 3 — Observed history

Completed engagements, with employer, date and duration. Arrival records against scheduled start.
Cancellations, with who cancelled and how far in advance. Amendments received and acknowledged.
Disputes, with their recorded outcomes. Employers worked with — the worker's own edges in the Work
Graph. Employer feedback attestations from completed engagements.

Every item links to the engagement it came from. An item that cannot be traced to an engagement does
not belong in this layer.

### Layer 4 — Derived metrics

Completion rate. On-time arrival rate. Cancellation rate, split by lead time. Repeat-hire rate.
Response time to offers.

**Every rate is displayed with its denominator.** "1 of 1", never "100%". A percentage over a
sample of one is a lie told with arithmetic, and this product's first user always has a sample of
one. Where the sample is too small to mean anything, the metric says so instead of rendering a
figure.

### What is deliberately absent

No overall score. No ranking against other workers. No "level", streak, or badge tier — gamification
of income is a dignity failure (principle 9) and manufactures the leaderboard principle 9 rules out.
No employer-only fields the worker cannot see: the worker's record is shown to the worker exactly as
it is shown to an employer.

## What visibly changes after Story A's engagement

Beat A10, on W-08. Enumerated, because "the Passport grows" is the claim the whole product rests on
and a vague growth animation would prove nothing.

| Layer | Before `OPP-01` | After settlement |
| --- | --- | --- |
| 1 | Skills and availability declared; nothing corroborated | Unchanged — and the screen shows that some declarations are now corroborated by observed history, which is a different thing from being verified |
| 2 | No verification | Identity check outcome present, dated, labelled `SIMULATED` (from A4) |
| 3 | Empty | One completed engagement with `EMP-01`; one on-time arrival; one amendment acknowledged; one employer feedback attestation; one settled payment; one Work Graph edge |
| 4 | Undefined — no metrics can be computed | Completion 1 of 1; on-time arrival 1 of 1; cancellations 0 of 1; repeat-hire not yet applicable, and labelled as such rather than shown as zero |

The honest reading of the "after" column is: **still thin, but no longer empty, and every line of it
is traceable.** That is scenario S2's uncomfortable element and it must survive into the demo. A
Passport that looks impressive after one shift would falsify the product's own thesis.

The second visible change is at beat B12: the same engagement makes `WKR-01` a prior-relationship
candidate for `EMP-01`. The record became useful to someone other than its owner. That is the
Passport's actual argument, and it is demonstrated on the employer's screen rather than claimed on
the worker's.

---

## Employer Trust Profile — contents

Same four layers, on E-08.

### Layer 1 — Self-declared

Business type, neighbourhood, typical work patterns, contact role.

### Layer 2 — Verified

Business verification outcome — `SIMULATED` (row 4), outcome and date only, no registration number
stored or shown. `HYPOTHESIS` · Registry access model is unknown; Q3 applies here too.

### Layer 3 — Observed history

Opportunities published and filled. Engagements completed. Payment commitments recorded and their
settlement outcomes, with elapsed time from proof approval to reported settlement. Cancellations
after acceptance, with lead time. Amendments recorded mid-engagement, and how many were
acknowledged. Proof decisions, split into approved, contested, and **resolved by non-response** —
kept separate, because an employer who never responds is a different counterparty from one who
approves promptly. Disputes and their outcomes. Worker feedback attestations. Repeat-worker
relationships.

### Layer 4 — Derived metrics

Payment reliability: proportion of commitments reaching reported settlement, and typical time from
approval to settlement. Cancellation rate with lead-time distribution. Response rate to submitted
proof within the window. Amendment frequency per engagement. Repeat-worker rate. Completed
engagements.

Same denominator rule. Same absence of a composite.

### Where a worker sees it

On W-02, before accepting. A worker deciding whether to rely on stated terms is entitled to the
same class of evidence the employer gets about them. Showing an employer's payment reliability only
to the employer would make reciprocity decorative.

The subset shown to workers is the layer 3 and 4 material above. Nothing employer-identifying beyond
what the opportunity already discloses is added.

## Amendment frequency is a trust signal, not only a factor

`EMP-01` records one amendment on the featured shift (B9, acknowledged at A7) against a history of
others. By beat C4 that is a pattern, and operations sees it while reviewing a case the
employer raised.

This is intentional and is the strongest single demonstration in the prototype that the trust model
is genuinely two-sided: the employer's own recorded behaviour is the evidence that complicates the
employer's own claim. It is also, unavoidably, the reason an employer might prefer a product that
does not record amendments — which is worth stating rather than hiding, because it is the commercial
tension at the centre of the thesis.

## Prototype-to-pilot blockers

| # | Element | Blocked on |
| --- | --- | --- |
| 1 | Any real identity or business verification | Q3 `UNKNOWN` — lawful basis for collection, verification and retention is not established. Rows 3 and 4 stay `SIMULATED` until it is. |
| 2 | Retention of any profile element | Q7 `UNKNOWN`. Retention is deliberately unimplemented, not guessed. |
| 3 | A dispute outcome appearing on a real person's profile | Q12, newly recorded — liability and right-of-correction are unexamined. |
| 4 | Showing an employer's payment reliability publicly | Unexamined. Accurate, and still a statement about a named business that the business cannot correct. |
| 5 | Any composite score | Not a legal blocker. A governance one: introducing it requires an ADR and contradicts principles 2, 6 and 9. |
