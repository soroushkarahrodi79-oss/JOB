# Matching Experience

> **Canonical for:** the matching pipeline stages, the explanation model, and which matching
> behaviour is functional versus simulated in the prototype.
> **Not canonical for:** the place of matching in the end-to-end journey (see
> [../user-flows.md](../user-flows.md) F3), the entities involved (see
> [../../domain/domain-model.md](../../domain/domain-model.md)), or truth statuses (see
> [../../demo-truth-matrix.md](../../demo-truth-matrix.md)).
> **Status:** Draft.

## What the prototype must demonstrate

One claim: **the system can state, in the user's language, why any given worker was or was not a
candidate.** Charter success criterion 2. Everything below serves that.

Two things it must demonstrate by their absence: there is no match score, and there is no model.
Matching is deterministic rule evaluation over recorded facts.

## The pipeline

Seven stages, in this order. The order is the product.

| # | Stage | Kind | Effect |
| --- | --- | --- | --- |
| 1 | **Eligibility** | Hard filter | Any unmet requirement excludes. Never a ranking penalty. |
| 2 | **Availability** | Hard filter | The worker's declared availability must cover the opportunity's time window. |
| 3 | **Location** | Hard filter *or* ordering | Filters only where the employer set a travel boundary or the worker set one, in which case it is an eligibility requirement like any other. Otherwise it orders. |
| 4 | **Skill fit** | Ordering | Skills the employer marked as required are stage 1. Remaining relevant skills order the eligible set. |
| 5 | **Reliability** | Ordering | Derived from the event record: completion, on-time arrival, cancellation history. |
| 6 | **Prior relationship** | Ordering | Preferred Crew marking, and prior completed engagements with this employer. |
| 7 | **Preferences** | Ordering | Soft employer preferences and soft worker preferences, applied last. |

**Stages 1–3 decide who is a candidate. Stages 4–7 decide only the order.** No ordering stage can
introduce a candidate, and no ordering stage can remove one — domain invariant 4. A stage that could
do either would make eligibility-first a slogan.

The split at stage 3 is deliberate. Distance is a hard constraint when someone has said it is, and
a soft one otherwise. A platform that silently imposes its own travel radius has made a decision
about a worker's life that neither party asked for.

## Explanation

Every result carries its reasons. Three kinds, and the prototype shows all three:

| Explanation | Shown to | Content |
| --- | --- | --- |
| **Why included** | Employer (E-04, E-05), worker (W-02) | Each eligibility requirement, marked met, with the attestation that satisfies it and that attestation's strength. |
| **Why in this position** | Employer (E-04) | The ordering stages that acted, named, in the order they acted. "Ahead on prior relationship — one completed engagement with you", not "94% match". |
| **Why excluded** | Employer (E-04), worker (W-02, W-01) | The specific unmet requirement, and nothing else. Not a list of everything the worker lacks. |

> **Prototype-provisional default — D9.** The worker is shown the specific requirement that
> excluded them: transparency serves the worker and limits unfair-exclusion exposure (Q9), and the
> gaming risk is unevidenced. D9 stays OPEN; the provisional value and its revisit trigger are
> recorded in [../../open-decisions.md](../../open-decisions.md).

### Rules for explanation text

1. **Name the fact, not the score.** Every clause references a recorded attestation, event or
   declaration. A clause that cannot name its source is not shown.
2. **Provenance travels with the reason.** "Has a health card (self-declared)" and "has a health
   card (verified — simulated)" are different statements and are never rendered identically.
3. **One exclusion reason, not a dossier.** Exclusion states the unmet requirement. Enumerating a
   person's every shortfall is a dignity failure (design principle 9) and serves no decision.
4. **No composite number appears anywhere.** Not a percentage, not a star average, not a tier. This
   is the single hardest rule to hold under demo pressure, because a number looks decisive.
5. **Empty results explain themselves.** "No eligible candidates" states which requirement removed
   the most people, so the employer can act on it. Silence is the failure mode design principle 2
   exists to prevent.

## Functional versus simulated

| Behaviour | Truth | Note |
| --- | --- | --- |
| Eligibility rule evaluation | `FUNCTIONAL` | Row 6. Correct for arbitrary valid input, not only the demo path. |
| Availability overlap | `FUNCTIONAL` | Row 7. |
| Skill fit ordering | `FUNCTIONAL` | Over the small curated demo taxonomy — D5's prototype-provisional default, explicitly not a general taxonomy. |
| Reliability ordering | `FUNCTIONAL` | Row 14. Computed from events, never seeded. |
| Prior-relationship ordering | `FUNCTIONAL` | Rows 15, 23. |
| Preference ordering | `FUNCTIONAL` | |
| Explanation generation | `FUNCTIONAL` | Generated from the evaluation, not written per scenario. An explanation authored for the demo path would make row 6 a `MOCK`. |
| **Distance and travel time** | `SIMULATED` | Row 8. Computed in-repo over a fixed synthetic demo geography. No maps provider, no real distances. Labelled at the point of use. |
| **Address resolution** | `SIMULATED` | Row 8, via `GeolocationPort`. |

The boundary is exactly one thing: **anything requiring knowledge of the real world is simulated;
everything requiring knowledge of the domain is functional.** That is the boundary a real
integration would later cross, and it is drawn where the port is.

## What is not built

- No machine-learned ranking, embedding similarity, or "AI match score". Domain model,
  *Deliberately absent*. Reintroducing one would require an ADR and would break criterion 2.
- No bidding, no price-based ordering. The charter rules out competing on price; ordering by price
  would reintroduce it through the back door.
- No candidate recommendation to workers beyond eligibility and ordering — no "jobs you might like".
- No employer-side saved searches, alerts, or pipeline management. Persona P2 is not a recruiter.

## Demonstration requirements

The demo fails to prove the claim unless, in `OPP-01`'s candidate list (beats B6, B7):

1. at least one visibly capable worker is **excluded**, with the single unmet requirement shown;
2. at least one worker is ordered ahead of another for a **named, non-obvious** reason — prior
   relationship, once `OPP-02`'s list is reached at beat B12 — not a score;
3. an ordering reason and an eligibility reason are visibly **different kinds of statement**;
4. the same explanation is available to the worker on W-02 as the employer sees on E-04, with no
   employer-only summary the worker cannot see.

Requirement 4 is the honesty test for matching. An explanation that changes depending on who is
reading it is not an explanation.
