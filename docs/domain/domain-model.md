# Domain Model

> **Canonical for:** domain entities, their meaning, invariants, and the project's ubiquitous language.
> **Not canonical for:** persistence or representation (see
> [../architecture/data-model.md](../architecture/data-model.md)), classification rules (see
> [engagement-classification.md](engagement-classification.md)), human actors (see
> [../product/personas.md](../product/personas.md)).
> **Status:** Draft. Conceptual only — no fields, no types, no schema. Those arrive at GATE 3.

## Ubiquitous language

These terms mean exactly this, everywhere: in documents, in code, in the UI, in conversation.
If a term is being used loosely, that is a defect.

| Term | Meaning | Explicitly not |
| --- | --- | --- |
| **Worker** | A person offering to perform work. | "Employee". The word carries no employment status. |
| **Employer** | An organisation or individual publishing work. | An assertion that an employment relationship exists. |
| **Opportunity** | A published unit of work with time, place, terms and eligibility requirements. | A "job posting"; it is bounded in time and scope. |
| **Engagement** | A specific worker performing a specific opportunity. | A contract. It is the system's record of a relationship. |
| **Eligibility Requirement** | A binary condition a worker must satisfy to be considered. | A preference, a weight, or a ranking factor. |
| **Attestation** | A claim about a fact, carrying a source and a strength. | Proof. An attestation may be self-declared. |
| **Worker Passport** | A derived view of a worker's attestations, engagement history and reliability. | A stored profile. It is computed, never authored. |
| **Proof of Work** | Evidence that work occurred, derived from recorded events. | Surveillance data, and not the blockchain term. |
| **Reputation** | A derived signal from completed engagements and outcomes. | A score the Platform can adjust by hand. |
| **Preferred Crew** | An employer's rehire relationship with specific workers. | A guarantee of future work or of eligibility. |
| **Engagement Classification** | The Platform's *hypothesis* about the nature of an engagement. | A legal determination. See [engagement-classification.md](engagement-classification.md). |
| **Dispute** | A recorded disagreement about an engagement. | Arbitration. The Platform does not adjudicate. |

## Entity relationships (conceptual)

```
Employer ──publishes──▶ Opportunity ──carries──▶ EligibilityRequirement
                             │
                             ├──matched to──▶ Worker ──holds──▶ Attestation
                             │                   │
                             ▼                   └──derives──▶ WorkerPassport
                        Engagement ──emits──▶ EngagementEvent
                             │                        │
                             ├──produces──▶ ProofOfWork
                             ├──produces──▶ PaymentIntent
                             ├──may raise──▶ Dispute
                             └──contributes to──▶ Reputation
```

Everything below the `Engagement` line is **derived from `EngagementEvent`**. That is the central
structural commitment of the model.

## Invariants

1. **Derived state is never authored.** Worker Passport, Reputation and Proof of Work are
   projections of recorded events. There is no path that writes them directly. This is what makes
   the record credible; a Passport that can be edited is a claim, not evidence.
2. **Attestations carry provenance and strength.** Self-declared, employer-confirmed and
   provider-verified are distinct and never collapse into a single boolean.
3. **Eligibility is binary and explainable.** Every evaluation produces the reason for its result.
4. **Eligibility precedes every other consideration.** Reputation, preference and price may order
   candidates; they may never introduce one.
5. **Classification is a hypothesis with a recorded basis.** It is never stored as a bare verdict.
6. **The domain layer depends on no external provider.** Enforced by
   [../architecture/system-architecture.md](../architecture/system-architecture.md).
7. **Money is never a floating-point number and never unit-ambiguous.** See
   [../architecture/data-model.md](../architecture/data-model.md).
8. **Time is instant-plus-zone, not a wall-clock string.** Calendar and locale are presentation.

## Deliberately absent

- No `User` supertype. Worker and Employer are different domain concepts; merging them for
  authentication convenience would leak an infrastructure concern into the domain. Authentication
  identity is a port concern.
- No `Contract` entity. The project has no validated basis for modelling contract formation.
- No scoring or ML model. Matching is deterministic rule evaluation, so it is explainable and
  auditable.
- No skills taxonomy. Whether skills are a controlled vocabulary or free text is open — D5.
- No geographic hierarchy. Whether location is administrative, point-based, or both is open — D6.
