# Synthetic Demo Dataset Specification

> **Canonical for:** the demo dataset's composition, archetypes, counts and generation rules.
> **Not canonical for:** the demo-data *policy* (see [demo-scenarios.md](demo-scenarios.md)), the
> stories the data serves (same document), persistence rules (see
> [../architecture/data-model.md](../architecture/data-model.md)), or entity definitions (see
> [../domain/domain-model.md](../domain/domain-model.md)).
> **Status:** Draft. No data has been generated; there is no database.

This specification fixes the dataset's **structure and variation**, not its literal values.
Generation is GATE 3 work.

## Generation rules

1. **The dataset is a generator, not a fixture.** Versioned, reproducible from a seed, regenerable.
   Policy rule 6.
2. **Seed events, never derived values.** The generator emits engagement events, attestations and
   payment events. Passports, reputation, trust profiles and the Work Graph are computed from them
   at run time. Seeding a completion rate directly would falsify the one claim the Passport makes.
   [ADR-0009](../adr/0009-prototype-experience-architecture.md) decision 3.
3. **Identifiers that must not exist are not generated at all.** No national identification numbers,
   business registration numbers, bank account numbers, or full phone numbers exist anywhere in the
   dataset — not as invalid values, not as masked values, not in fields nothing renders. Verification
   stores outcomes only ([../architecture/data-model.md](../architecture/data-model.md) rule 4), so
   there is nothing for these fields to be. This satisfies policy rule 2 by construction rather than
   by choosing a safe range.
4. **Contact details are labels, not values.** Where the interface needs a contact affordance, the
   dataset provides a display label ("the number on file"), never digits.
5. **Real-entity screening before generation.** Every generated business name, and every
   name-plus-neighbourhood pairing, is checked against public sources for a real match and changed if
   one is found. Plausible names collide with reality by construction; policy rule 1 requires the
   check, not just the intent.
6. **Every entity carries a demo marker in its identifier.** So that a demo record found outside the
   demo is immediately identifiable as one.
7. **Jalali-coherent dates.** Generated in the Iranian calendar against a demo "today", with Friday
   as the weekend day and shift patterns that fit an Iranian working week. Policy rule 5.
8. **Amounts are generator parameters.** The dataset fixes the *structure* — Rial minor units, Toman
   presentation, a pay basis per opportunity — and not the figures. Rates are set at generation time
   by someone with current market knowledge, because a stale or invented figure reads as fake to the
   intended audience, and inventing one here would be an assertion the project cannot support.

## Geography

One city: **Tehran**, with a small set of named neighbourhoods. Nationwide coverage is an explicit
non-goal ([charter.md](charter.md)), and a single city makes distance credible without pretending to
map data.

The demo geography is a **fixed synthetic distance table** between those neighbourhoods, held
in-repo. It is not real distance or travel time and is labelled `SIMULATED` at every point of use
(truth-matrix row 8, `GeolocationPort`).

> **Prototype-provisional default — D6.** The prototype uses an administrative hierarchy — city and
> neighbourhood — with coordinates deferred. D6 stays OPEN; the provisional value, its revisit
> trigger and its pilot-transfer status are recorded in
> [open-decisions.md](../open-decisions.md).

Six to eight neighbourhoods is enough: it must be possible for a worker to be plainly near, plainly
far, and genuinely borderline.

## Skills

**Twelve to fourteen** skills in a small curated taxonomy, plus three or four
certificate/licence attestation types.

> **Prototype-provisional default — D5.** A small curated taxonomy, **for the demo scenarios only
> and explicitly not a general one**. D5 stays OPEN; the provisional value, its revisit trigger and
> its pilot-transfer status are recorded in [open-decisions.md](../open-decisions.md).

Coverage must include: café and food service, warehouse and stock work, event setup and service,
cleaning, cash handling, and customer service. Certificate types must include at least one that acts
as a hard eligibility requirement on `OPP-01` — this is what excludes `WKR-03` at beat B7.

`HYPOTHESIS` · Whether any such certificate is legally required for a given kind of work in Iran is
`UNKNOWN` and is recorded as Q13. In the prototype it is an **employer-stated requirement**, never a
Platform-asserted legal obligation, and no screen may describe it as required by law.

## Workers — 12

Twelve is the smallest set that makes matching credible: enough that a candidate list has depth,
enough that an exclusion is not conspicuous, and small enough that a reviewer can hold the world in
mind.

| ID | Archetype | Purpose |
| --- | --- | --- |
| `WKR-01` | Near-empty Passport, one declared skill set, no verification, no history | Story A protagonist. Scenario S2's thin Passport. |
| `WKR-02` | Established: many completed engagements, verified, good record | Story C's disputed worker. His record must be **good**, so the dispute is not read as a bad worker being caught. |
| `WKR-03` | Capable, well-reviewed, **lacks the required certificate** | Beat B7's exclusion. Must look like an obvious hire. |
| `WKR-04` | Established, but unavailable in `OPP-01`'s window | Demonstrates the availability filter separately from eligibility. |
| `WKR-05` | Established, but outside the employer's stated travel boundary | Demonstrates the location filter as a stated requirement, not a Platform assumption. |
| `WKR-06` | Preferred Crew of a *different* employer | Shows that a preference relationship is employer-specific and confers nothing elsewhere. |
| `WKR-07` | Mixed record: completions plus two late cancellations | Gives reliability ordering something real to order. |
| `WKR-08` | Verified identity, all skills self-declared, no history | Isolates verification from experience — a verified stranger. |
| `WKR-09` | Long history with one historical resolved dispute | Shows a dispute sitting in a record without acting as a penalty. |
| `WKR-10` | Narrow specialist, one skill, strong record in it | Tests skill-fit ordering. |
| `WKR-11` | Broad availability, thin skills | The opposite trade to `WKR-10`. |
| `WKR-12` | Declined two recent offers, no cancellations | Demonstrates that declining is not a reliability signal. |

## Employers — 4

| ID | Archetype | Purpose |
| --- | --- | --- |
| `EMP-01` | Café, verified, good payment record, **records amendments frequently** | Stories A, B and C. The amendment pattern is the point (beat C4). |
| `EMP-02` | Warehouse/distribution, verified, high volume, prompt settlement | Background history that makes workers' records substantial. |
| `EMP-03` | Event services, verified, seasonal bursts, some cancellations | Cancellation behaviour with lead-time variation. |
| `EMP-04` | Small shop, **unverified**, slow settlement, several non-responses to proof | Makes the employer trust profile discriminating. Without a poor counterparty, reciprocal trust is untested decoration. |

`EMP-04` is load-bearing. An employer set in which every employer is good proves nothing about
employer reputation.

## Opportunities — 6

| ID | Employer | Role in the demo |
| --- | --- | --- |
| `OPP-01` | `EMP-01` | **The featured transaction.** Two positions, within 24 hours, **invite-only**, one certificate requirement and one travel boundary. Filled by `WKR-01` (Story A, completes) and `WKR-02` (Story C, disputed). Excludes `WKR-03` on the certificate. |
| `OPP-02` | `EMP-01` | Created at beat B12, **open acceptance**. Exists only so its candidate list can show `WKR-01` ranked on the prior relationship built during `OPP-01`. Not filled during the demo. |
| `OPP-03` | `EMP-02` | Historical, filled, settled. Background. |
| `OPP-04` | `EMP-03` | Historical, partly cancelled by the employer. Feeds `EMP-03`'s cancellation record. |
| `OPP-05` | `EMP-04` | Historical, settled late after non-response. Feeds `EMP-04`'s record. |
| `OPP-06` | `EMP-02` | Published, unfilled, expired. Shows expiry as an ordinary outcome. |

`OPP-01` and `OPP-02` differ in acceptance mode on purpose: both paths into `Accepted` exist in the
state machine and both must be demonstrated.

Two positions on `OPP-01` rather than two opportunities is the structural choice that makes Story C
reviewable. The disputed engagement shares its opportunity, its terms, its shift and its amendment
with an engagement the audience has just watched succeed — so the difference between the two
outcomes is visible in the record rather than asserted.

## Engagement history — approximately 30 historical, plus 3 live

Historical engagements are the substrate that makes every derived metric non-trivial. Required
variation across them:

- completions with on-time arrival, and completions with late arrival;
- cancellations by workers and by employers, at short and long lead times;
- at least two `ApprovedByNonResponse` outcomes, concentrated on `EMP-04`;
- at least one `SettlementFailed` followed by a successful retry, in the history as well as live;
- at least one expired offer and two declined offers;
- one historical resolved dispute (`WKR-09`), with a recorded finding.

Historical amendments by `EMP-01` are required, not optional: without them, the amendment frequency
operations examines at beat C4 is a sample of one and says nothing.

Live in the demo: `WKR-01` and `WKR-02`, both on `OPP-01`.

Thirty is a ceiling, not a target. It is enough that a rate is not "1 of 1" for established workers,
and few enough that an operator can read the whole event history of any engagement.

## Attestations

Per worker: declared skills and availability; identity verification outcome for the subset marked
verified; certificate outcomes where the archetype requires one; employer feedback attestations
generated from completed engagements.

All strengths present in the dataset: self-declared, employer-confirmed, provider-verified
(`SIMULATED`). No attestation collapses to a boolean — domain invariant 2.

## Reputation history

**Not generated.** Reputation is derived from the events above. This entry exists to say so
explicitly, because a reputation table is the most tempting shortcut in the dataset and taking it
would make the prototype's central claim false in the one place it is demonstrated.

## Disputes — 2

| Case | Engagement | State at demo time |
| --- | --- | --- |
| Historical | `WKR-09` on an `EMP-02` engagement | Closed, with a recorded finding, visible in `WKR-09`'s history |
| Live | `WKR-02` on `OPP-01` | Opened at beat B11, resolved during Story C |

## Preferred Crew relationships — 3

`EMP-02` → `WKR-04` and `WKR-07` (historical). `EMP-03` → `WKR-06` (historical, and the relationship
that confers nothing at `EMP-01`).

The fourth is created live at beat B10: `EMP-01` → `WKR-01`. Its effect must be observable on a
subsequent candidate list rather than asserted.

## Names

Synthetic Persian names for people, synthetic Persian business names, both screened per rule 5.
Names are held in the generator, not in this document — a document that lists them becomes a second
place they can drift from, and screening happens against the generator's set.

## Coherence requirements

The dataset is wrong, not merely thin, if any of these fail:

1. Every derived figure shown anywhere in the demo is reproducible from the seeded events.
2. `WKR-01`'s Passport before `OPP-01` has no observed history and no computable rates.
3. `WKR-03` is eligible for `OPP-01` on every requirement except the certificate, and is
   visibly the stronger hire on every other axis.
4. `WKR-01` appears on `OPP-02`'s candidate list with a prior-relationship reason that traces to
   `OPP-01`.
5. `EMP-01`'s amendment frequency at beat C4 is computed over historical amendments as well as
   B9, so it is a pattern rather than a single event.
6. No two neighbourhoods have distances that contradict each other in the synthetic table.
7. Regenerating from the same seed produces the same world.
