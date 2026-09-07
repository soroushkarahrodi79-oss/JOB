# Legal Architecture

> **Canonical for:** how the project represents legal matters and distinguishes hypothesis from
> validated conclusion.
> **Not canonical for:** the open questions themselves (see [open-questions.md](open-questions.md))
> or the classification mechanism (see
> [../domain/engagement-classification.md](../domain/engagement-classification.md)).
> **Status:** Draft.

## Position

**No qualified Iranian legal review has been obtained. This project currently holds zero validated
legal conclusions.**

This document does not contain legal analysis. It defines how legal *uncertainty* is represented,
so that uncertainty is visible instead of dissolving into confident-sounding prose.

## Epistemic status labels

Every legal statement anywhere in this repository carries one of these labels. An unlabelled legal
statement is a defect.

| Label | Meaning | Permitted use |
| --- | --- | --- |
| `VALIDATED` | Confirmed by qualified Iranian counsel, with a dated written record referenced. | May inform product behaviour and user-facing statements. |
| `RESEARCHED` | Supported by identified primary sources, not reviewed by counsel. | May inform internal design. Never user-facing. |
| `HYPOTHESIS` | A working assumption. Reasoned, unverified. | Internal only. Must be listed in [open-questions.md](open-questions.md). |
| `UNKNOWN` | Identified as relevant and not investigated. | Must not be built upon. |

**Everything in this repository today is `HYPOTHESIS` or `UNKNOWN`.**

## Rules

1. **No legal conclusion is stated as fact without the `VALIDATED` label** and a reference to the
   dated advice supporting it.
2. **The product never gives legal advice**, and never tells a user what their legal status is.
3. **Legal uncertainty is never resolved by silence.** Omitting a caveat because it is
   commercially inconvenient is a governance violation.
4. **Marketing and investor materials inherit these labels.** An investor deck may not upgrade a
   `HYPOTHESIS` to a statement of fact. This is the same discipline as the truth matrix, applied to
   legal claims instead of technical ones.
5. **Legal assumptions have architectural consequences and must be traceable.** Where an assumption
   shapes a design decision, the design document names the question ID.

## Architectural containment

Legal uncertainty is contained so it does not become a rewrite:

- **Classification is a signal with recorded factors**, not a stored verdict. If the correct
  analysis differs, the factor model changes and history remains reinterpretable.
- **The Platform is not a party to engagements** in the model. If Q6 resolves against this, the
  change is severe and structural — which is precisely why it is recorded now.
- **The Platform does not hold funds.** Payment orchestration records intent and reflects outcomes.
- **Verification stores outcomes, not evidence**, minimising exposure while the obligations around
  identity data are `UNKNOWN`.
- **Retention is not implemented** rather than guessed.

## The limit of this containment

The containment above is real but partial, and overstating it would be its own form of false
certainty.

Persisting factors rather than verdicts protects against a **re-weighting** of the analysis: if the
correct legal test gives different importance to facts the system already records, the factor model
changes and recorded history is reinterpreted without loss.

It does **not** protect against a **factor-set expansion**: if the correct test turns on facts the
system never captured, history cannot be reinterpreted, because the data was never collected. No
storage design can reinterpret an unrecorded fact.

The practical consequence: the architectural exposure of Q1 is low, while the exposure of **Q2** —
whether the recorded factors are the right ones — is high, and rises with every month of accumulated
history built on the wrong factor set. Q2 is therefore more urgent than its `High` severity suggests
when read alone, and is the strongest argument for obtaining legal review early rather than at
production.

## What would change the architecture

- **Q6 unfavourable** — changes the Platform's legal posture, which is a charter-level
  re-scoping, not a refactor.
- **Q5 unfavourable** — may require a different payment topology; contained to the payment port and
  the ledger, not the domain.
- **Q2 unfavourable** — changes what must be captured, and is the one case the containment above
  does not cover.
- **Q1 unfavourable** — changes classification logic and downstream obligations; contained by the
  factor-not-verdict design, within the limit stated above.

These are stated plainly so the risk is not discovered late, and separated so that a severe legal
outcome is not assumed to be an architectural one, or vice versa.
