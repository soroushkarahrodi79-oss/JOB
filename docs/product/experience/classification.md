# Engagement Classification Experience

> **Canonical for:** how classification factors are collected in the prototype and how the signal is
> presented.
> **Not canonical for:** the factor model, its assumptions, or its permitted uses — all owned by
> [../../domain/engagement-classification.md](../../domain/engagement-classification.md). The
> factors are **not** restated here.
> **Status:** Draft — the mechanism is a demonstration. Nothing about it is legally validated.

## Statement of non-conclusion

`HYPOTHESIS` · The prototype demonstrates a mechanism for recording signals about how an engagement
is organised. It states no legal conclusion, and no screen may imply one. Q1, Q2 and Q6 are
`UNKNOWN` ([../../legal/open-questions.md](../../legal/open-questions.md)); this document does not
touch them.

## The collection problem

Persona P2 is a café operator with minutes to spare. A seven-question interrogation about direction
and control will be abandoned, or answered carelessly — and carelessly-answered factors are worse
than absent ones, because they look like data.

So the prototype collects factors two ways.

### Derived from what the employer already said

Most factors are implicit in an ordinary opportunity. Creating `OPP-01` at E-02 already states the
time window, the location, the pay basis, the headcount and the duration. Those answers are read as
factor inputs without asking again. Deriving rather than asking is not a shortcut: an answer the
employer gave while describing real work is more reliable than one given to a compliance form.

Each derived factor records **that it was derived and from which field**, so it is auditable and so
a later change to the derivation does not silently rewrite history.

### Asked, only where it cannot be derived

At E-03, the employer answers a **small** number of questions covering only the factors nothing in
E-02 implies. Rules:

1. Each question is about the work, in the employer's own vocabulary. No legal terminology appears.
2. Each question has a "not decided yet" answer, recorded as such. Forcing a false answer to
   complete a form is how a factor record becomes fiction.
3. The set is capped. If a factor cannot be captured in one plain question, it is left uncaptured
   and recorded as uncaptured — see the limit below.

### Captured during the engagement

Some factors are only observable once work starts. The amendment mechanism (E-06, W-05) is the main
one: an employer changing scope or method mid-engagement is a direction-and-control input, and it is
captured because the amendment is a recorded event anyway.

This is the design point worth noticing — the same event serves three purposes: proof of what was
agreed, evidence in a dispute (C3), and a classification factor. The product captures it once,
because it was needed for work, not because a classifier wanted it.

## How the signal is presented

At E-03, and nowhere else in the employer flow.

**Shown:**
- A signal describing where the engagement sits on the spectrum the domain document defines.
- Every contributing factor, its recorded value, and whether it was derived or answered.
- Which factors are **uncaptured**, named explicitly.
- The epistemic label `HYPOTHESIS`, at the point of use, with a route to what is unresolved.
- A plain statement that this is not a legal determination and the Platform gives no legal advice.

**Never shown, in any wording:**
- That the engagement *is* or *is not* employment.
- That the employer is or is not compliant, safe, or at risk.
- A recommendation to restructure the work to change the signal.
- A confidence percentage. A number attached to an unvalidated hypothesis manufactures certainty
  that does not exist.

**Behaviour:** the signal informs and does not block publication.

> **Prototype-provisional default — D3.** The signal informs and does not block. This is available
> under [ADR-0010](../../adr/0010-prototype-provisional-defaults.md) safeguard 7 precisely because
> it asserts nothing about Q1 or Q6: choosing to *block* would presume an answer to an open legal
> question and is therefore unavailable under the mechanism regardless of who approves it. D3 stays
> OPEN; the provisional value and its revisit trigger are recorded in
> [../../open-decisions.md](../../open-decisions.md).

## Storage

Factors are persisted with their values, their source (derived or answered), and their time. The
signal is **not** persisted as a verdict — it is recomputed from the factors. Domain invariant 5.

## The limit, stated plainly

Persisting factors rather than verdicts means a changed legal analysis can **re-weight** facts the
system already recorded. It cannot reconstruct facts the system never captured.

If the correct Iranian legal test turns on a factor outside the recorded set, the affected history
is not reinterpretable — the data does not exist and no storage design can invent it. This is the
containment limit stated in
[../../legal/legal-architecture.md](../../legal/legal-architecture.md#the-limit-of-this-containment).

Two consequences the prototype must honour:

1. **Uncaptured factors are recorded as uncaptured**, not as absent or as negative. "Not asked" and
   "answered no" must never be stored or displayed as the same thing.
2. **The exposure grows with accumulated history.** Every month of engagements recorded against the
   wrong factor set is a month that cannot be re-analysed. This makes Q2 more urgent than its
   severity rating suggests in isolation, and it is the strongest argument in the repository for
   obtaining legal review before a pilot rather than before production.

## Prototype-to-pilot blockers

None of the following may proceed into a real pilot without qualified Iranian legal review:

| # | Element | Blocked on |
| --- | --- | --- |
| 1 | Displaying any classification signal to a real employer | Q1, Q2, Q6 — the factor set may be measuring the wrong things, and A3 (whether surfacing a signal creates liability for the Platform) is unvalidated. |
| 2 | Any change from "inform" to "block" | Q1, Q6, and D3. Blocking asserts a legal position. |
| 3 | Recording factors against real engagements | Q2. Accumulating history on an unvalidated factor set is the one failure the architecture does not contain. |
| 4 | Any wording that could be read as compliance guidance | ADR-0007, and the marketing-inheritance rule in [../../legal/legal-architecture.md](../../legal/legal-architecture.md). |

## Demonstration requirements

The demo fails unless, at beats B4 and B5:

1. the employer answers **few** questions and visibly does not fill in a compliance form;
2. the signal is shown with its factors and at least one factor is visibly **derived**;
3. at least one factor is visibly **uncaptured** and named as such;
4. publication proceeds regardless of the signal;
5. a reviewer reading only the screen can tell that the Platform is not making a legal claim.

Requirement 3 is the uncomfortable one and must not be removed for looking incomplete. A
classification screen with no gaps would be the overclaim this whole mechanism exists to avoid.
