# Demo Scenarios

> **Canonical for:** the demo narratives and the demo-data policy.
> **Not canonical for:** the flows they traverse (see [user-flows.md](user-flows.md)) or the truth
> status of the capabilities they exercise (see [../demo-truth-matrix.md](../demo-truth-matrix.md)).
> **Status:** Draft.

## Purpose

Demo scenarios exist to make the thesis inspectable. Each scenario must exercise a real decision
that a reviewer could disagree with. A scenario that only walks a happy path proves nothing.

## Scenario set

| # | Scenario | Demonstrates | Deliberately uncomfortable element |
| --- | --- | --- | --- |
| S1 | Café needs two shift staff within 24 hours | F2, F3, F4 | One plausible-looking candidate is *excluded*, and the reason is shown. |
| S2 | Worker with an empty Passport takes a first engagement | F1, F4, F5 | The Passport is visibly thin, and the product does not pretend otherwise. |
| S3 | Worker with an established Passport is preferred over a cheaper unknown | F3, F8 | Price is not the deciding factor, and the product says why. |
| S4 | Proof of Work is disputed | F5, F7 | The Platform records an outcome and explicitly declines to enforce it. |
| S5 | Payment settlement fails | F6 | The simulated provider fails on purpose; the ledger stays consistent. |
| S6 | An engagement is flagged as employment-like | F2 | Classification is surfaced as a hypothesis with an open legal question attached. |

S4, S5 and S6 are the scenarios that matter. A demo that omits them is a sales artifact, not a
prototype.

## Demo data policy

1. **Realistic, never real.** Iranian names, cities, business types, wages and working patterns
   must be plausible. They must not be traceable to any actual person or business.
2. **No real registry values.** No real national identification numbers, business registration
   numbers, phone numbers, or bank account numbers — not even syntactically valid ones for real
   registries. Demo identifiers use reserved or clearly invalid ranges.
3. **No real provider names.** No real bank, registry, carrier, or map provider is named anywhere
   in the demo, including in placeholder text.
4. **Currency is explicit.** Amounts state their unit. Rial and Toman are not used
   interchangeably; see [../architecture/data-model.md](../architecture/data-model.md).
5. **Dates are Jalali-correct.** Demo dates must be coherent in the Iranian calendar, including
   weekends. A Gregorian-shaped week will read as fake to the intended audience.
6. **Seed data is generated, versioned and reproducible.** It is not hand-edited into a database.
7. **Demo data is never mixed with any real data**, at any point, for any reason.

## Presentation rules

- Every screen that exercises a non-`FUNCTIONAL` capability carries its truth label at the point
  of use.
- The truth matrix is reachable from within the prototype.
- No narration — spoken, written, or in a deck — may describe a simulated integration as live.
