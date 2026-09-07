# Open Decisions — Product and Architecture

> **Canonical for:** unresolved **product and architecture** decisions.
> **Not canonical for:** legal questions, which live only in
> [legal/open-questions.md](legal/open-questions.md).
> **Status:** Live register.

These are decisions the project has deliberately **not** made. They are recorded rather than
silently resolved, because each would materially change the product or the architecture and none
should be settled by an agent or by default.

| ID | Decision | Why it is open | Blocks | Default if unresolved |
| --- | --- | --- | --- | --- |
| **D1** | Are personas P1 and P2 correct, and is the Worker Passport the right primary value proposition? | No user research exists. The stated risk is that employers' real reservation is trust in the Platform, not in the worker. | GATE 1 | Proceed on the stated hypothesis, flagged as unvalidated. |
| **D2** | How much can a worker do before verification? | Trades supply-side conversion against employer trust. Both directions are defensible; it is a product bet. | GATE 1, F1 | Allow browsing and application; require verification before engagement acceptance. |
| **D3** | Does the engagement-classification signal *block* publication, or only inform? | Depends on Q1 and Q6. Blocking implies a legal position the project cannot support. | GATE 1, F2 | Inform only. Never block on an unvalidated legal hypothesis. |
| **D4** | ~~Hosting, deployment target and data residency.~~ | **Split on 2026-09-07** into D12, D13, D14 and D15. It combined four decisions with different owners, horizons and blocking gates, which caused GATE 2 to be blocked on a production question it did not depend on. Retained for audit trail; **do not cite D4** — cite the specific successor. | — | — |
| **D5** | Is the skills model a controlled taxonomy or free text? | A taxonomy makes matching precise and onboarding rigid; free text is the reverse. Neither is obviously right without demand data. | GATE 3 | Small curated taxonomy for the demo scenarios only, explicitly not general. |
| **D6** | Location model: administrative hierarchy, coordinates, or both? | Affects matching, privacy granularity and the geolocation port's shape. | GATE 3 | Administrative hierarchy for the demo; coordinates deferred. |
| **D7** | Scope of trust and safety for the prototype. | Currently `PLANNED` with no defined scope. Under-scoping is a credibility gap; over-scoping is speculative. | GATE 4 | Define minimum viable scope at GATE 1. Do not build before then. |
| **D8** | Product name and brand identity. | Not yet chosen. Documents use "the Platform". | GATE 1 (design) | Continue with the placeholder. |
| **D9** | Is a worker allowed to see why they were excluded by an eligibility rule? | Transparency serves the worker and limits unfair-exclusion risk (Q9), but can expose employer criteria and enable gaming. | GATE 1, F3 | Show the reason to the worker. Principle 2 outweighs the gaming risk absent evidence. |
| **D10** | Does the Platform charge, and whom? | No revenue model is defined. It affects the classification analysis and the payment topology. | Post-prototype | Not modelled in the prototype. |
| **D11** | Which real Iranian provider is the candidate for each port? | Not researched. Recording candidates now would be speculation, and the choice interacts with Q3, Q5, Q8 and Q11. | Any real integration | None. Simulated adapters remain in place until researched. |
| **D12** | Prototype deployment posture: where and how the prototype is actually run for demonstration. | Independent of production. Constrained by [ADR-0008](adr/0008-provisional-application-stack.md) constraints 2 and 5, which require generic deployability and synthetic data. | GATE 4 delivery | Run self-hosted in a plain container with synthetic data. No managed platform. |
| **D13** | Production hosting topology. | Requires business and operational input that does not exist. **Constrained by D14** — residency can force topology, so this cannot be settled first. | Production | None. Deciding by default would adopt a hosting posture by accident. |
| **D14** | Production personal-data residency: where Iranian personal data may physically reside. | Depends on Q8 and Q11. Not answerable without qualified legal review. | Production, and D13 | None. There is no safe default. |
| **D15** | Dependency and supply-chain resilience. | Engineering work, resolvable independently of every production question. The requirements this must satisfy are stated in [ADR-0008](adr/0008-provisional-application-stack.md) and are not restated here. | Completion of GATE 2 — not entry to it | None acceptable. Must be addressed within GATE 2. |

## Rules

- An entry is resolved by a decision recorded in the appropriate canonical document, and by an ADR
  where the decision is architectural.
- "Default if unresolved" is what happens if the project proceeds without deciding. It is a
  fallback, not a decision, and must be labelled as such wherever it is relied upon.
- D13 and D14 deliberately have no default. Defaulting either would mean adopting a hosting or
  data-residency posture by accident.
- A split entry is struck through and retained rather than deleted, for the same reason accepted
  ADRs are superseded rather than edited: the reasoning is the value.
- An agent may add entries. An agent may not resolve one without explicit human instruction.
