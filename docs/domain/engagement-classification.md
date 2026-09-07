# Engagement Classification — Model and Assumptions

> **Canonical for:** the product-side classification model and the assumptions it rests on.
> **Not canonical for:** how the project handles legal uncertainty (see
> [../legal/legal-architecture.md](../legal/legal-architecture.md)) or the open legal questions
> themselves (see [../legal/open-questions.md](../legal/open-questions.md)).
> **Status:** Draft — **entirely hypothesis**. Nothing here is legally validated.

## Statement of non-conclusion

**This document asserts no legal conclusion.** It defines a mechanism for recording signals about
the nature of an engagement, together with the untested assumptions that mechanism rests on.

The Platform must not tell a user that an engagement *is* or *is not* employment. It has no
validated basis for that statement, and stating it would create risk for the user and for the
project. What it may do is surface signals and their basis.

## Why this exists at all

Engagements exist on a spectrum. At one end sits a bounded, independently-organised service. At
the other sits work directed, scheduled and supervised by the recipient, indistinguishable in
substance from employment.

A platform that ignores this spectrum makes the distinction anyway — silently, and in whichever
direction is commercially convenient. Modelling it explicitly means the distinction is visible,
recorded, and correctable when the legal position is established.

## The mechanism

Classification is a **derived, explainable signal**, computed from recorded facts:

- **Direction and control** — who determines method, sequence and supervision.
- **Schedule control** — who sets working hours; whether the worker may decline or substitute.
- **Integration** — whether the work is a discrete deliverable or ongoing operational capacity.
- **Duration and repetition** — a single mission versus a recurring pattern with one employer.
- **Tools and materials** — who supplies them.
- **Economic structure** — output-based versus time-based compensation.
- **Exclusivity** — whether the worker is practically prevented from working elsewhere.

Output is a **classification signal with its contributing factors**, never a bare verdict. Storing
`type = "independent"` without its basis would be exactly the false certainty this document exists
to prevent.

## Assumptions (all unvalidated)

| # | Assumption | Consequence if wrong |
| --- | --- | --- |
| A1 | Iranian labour law's treatment of short-duration work turns on the *substance* of the relationship rather than on its documentary form. | The factor set is the wrong analysis entirely. |
| A2 | The factors above are relevant under Iranian law. | Signals are noise. |
| A3 | Surfacing a signal does not itself create liability or an admission for the Platform. | The mechanism becomes a legal hazard and may need to be internal-only. |
| A4 | Repetition with one employer increases employment-likeness. | Repeat-engagement mechanics, including Preferred Crew, need rethinking. |
| A5 | A platform may lawfully facilitate engagements without becoming a party to them. | The entire intermediary model is invalid. |

A1, A2 and A5 are load-bearing. If A5 is false, the product does not exist in its current form.
These are recorded as Q1, Q2 and Q6 in [../legal/open-questions.md](../legal/open-questions.md).

## Prototype behaviour

- The signal is computed and displayed **as a hypothesis, with its factors visible**.
- No user-facing text states or implies a legal status.
- No compliance guarantee is made.
- The signal does not currently block publication. Whether it should is D3.

## Not permitted

- Presenting classification as legal advice or as a legal determination.
- Using classification in marketing to imply regulatory safety.
- Optimising the factor model to make engagements *appear* independent. Designing the signal to
  produce a preferred answer defeats the mechanism and is a governance violation.
