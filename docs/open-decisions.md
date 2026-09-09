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
| **D16** | Is the default acceptance mode open acceptance (any eligible worker may accept) or invite-only? | Open acceptance is fast, which is what persona P2 needs within 24 hours; invite-only gives the employer control and reduces the chance a worker accepts work that turns out badly matched. Both are defensible and the choice affects who bears the cost of a bad match. Recorded at GATE 1. | GATE 4 | Both modes exist and the employer chooses per opportunity; the pre-selected mode is invite-only. |
| **D17** | Does Proof of Work require evidence media (photograph, file), and therefore a storage port? | Media is the most persuasive proof and the least defensible: it needs a new port ([ADR-0003](adr/0003-provider-ports-and-adapters.md)), a consent basis (Q4), a retention rule (Q7) and a moderation surface. Excluding it may also make proof too weak for some work types, which is a demand question nobody has answered. Recorded at GATE 1. | Any real pilot | Not built. Structured fields only. Adding it requires an ADR. |
| **D18** | The employer response window for submitted proof: its length, and whether non-response should authorise release at all. | The allocation of an employer's silence remains a consequential product and pilot-policy question. The authorised prototype value below deliberately creates no automatic outcome and does not answer the production question. Recorded at GATE 1. | GATE 4 | No general default. The prototype-only value is recorded below. |
| **D19** | Which Persian text face and which monospace face the product uses. | The selection criteria are settled ([design/typography.md](design/typography.md)) and the choice is not. Criterion 1 requires a person to read the licence and confirm that self-hosting and redistribution are permitted; an agent may not assert a licence fact. Criteria 4 and 5 — Persian tabular figures, and usable weight separation at body size — can only be settled by rendering, not by reading a specimen. Recorded at GATE 1.5. | GATE 2 | None acceptable. A font shipped on an unverified licence is a legal exposure, and an unverified one is a rendering risk. |

## Prototype-provisional defaults

A **prototype-provisional default** is an explicitly human-approved value used solely to unblock
non-production prototype work. Mechanism and safeguards:
[ADR-0010](adr/0010-prototype-provisional-defaults.md).

**Every decision listed below remains `OPEN`.** Appearing here is not resolution, is not validation,
and does not remove the entry from the table above. Scope is **prototype only** for every row.

| ID | Provisional value | Canonical owner | Why it is needed | Revisit trigger | Pilot transfer | Status |
| --- | --- | --- | --- | --- | --- | --- |
| **D1** | Proceed on the stated personas P1/P2 and on the Worker Passport as the primary value proposition, **flagged as unvalidated wherever asserted**. | [product/investor-narrative.md](product/investor-narrative.md) | Every story, screen and metric presumes an answer. Without it there is no prototype to build. | First user research contact, or any investor or operator feedback that employers' reservation is trust in the Platform rather than in the worker. | **Prohibited without review** | `AUTHORISED` 2026-09-07 |
| **D2** | Browsing and application are open; verification is required before engagement acceptance. | [product/screen-inventory.md](product/screen-inventory.md) W-03; [domain/state-transitions.md](domain/state-transitions.md) | Acceptance needs a defined precondition or the engagement state machine has no guard. | Any supply-side conversion evidence, or resolution of Q3. | **Prohibited without review** — interacts with Q3 | `AUTHORISED` 2026-09-07 |
| **D3** | The classification signal **informs and does not block** publication. | [product/experience/classification.md](product/experience/classification.md) | The employer flow cannot be defined without knowing whether publication can be prevented. | Resolution of Q1 or Q6. | **Prohibited without review** — see safeguard 7 | `AUTHORISED` 2026-09-07 |
| **D5** | A small curated skills taxonomy, for the demo scenarios only. | [product/demo-dataset.md](product/demo-dataset.md) | Matching cannot be demonstrated without a skill vocabulary. | Entry to GATE 3, or any demand data. | **Prohibited without review** — explicitly not a general taxonomy | `AUTHORISED` 2026-09-07 |
| **D6** | Administrative hierarchy — city and neighbourhood. Coordinates deferred. | [product/demo-dataset.md](product/demo-dataset.md) | Location matching needs a representation. | Entry to GATE 3. | **Prohibited without review** | `AUTHORISED` 2026-09-07 |
| **D7** | Trust-and-safety scope is dispute casework only. Everything else stays `PLANNED`. | [product/experience/disputes.md](product/experience/disputes.md) | Story C cannot be defined without a scope boundary. | Entry to GATE 4. | **Prohibited without review** — the absence of a worker appeal route is the specific gap | `AUTHORISED` 2026-09-07 |
| **D8** | The placeholder name "the Platform" is used throughout, including in the demo. | [product/charter.md](product/charter.md) | Screens and narration need a referent. | Brand work, or first external distribution of demo material. | Permitted — a naming placeholder carries no behavioural risk | `AUTHORISED` 2026-09-07 |
| **D9** | The worker is shown the specific requirement that excluded them. | [product/experience/matching.md](product/experience/matching.md) | Exclusion must either be explained or silent; the matching experience cannot be defined without choosing. | Evidence of requirement gaming, or resolution of Q9. | **Prohibited without review** — interacts with Q9 | `AUTHORISED` 2026-09-07 |
| **D16** | Both acceptance modes exist; the employer chooses per opportunity, with invite-only pre-selected. | [domain/state-transitions.md](domain/state-transitions.md) | The engagement state machine needs both entry paths defined. | First prototype feedback or before any pilot or production-policy decision. | **Prohibited without review** | `AUTHORISED` 2026-09-09 — prototype only; D16 remains OPEN |
| **D17** | No evidence media. Structured completion fields only. | [product/experience/proof-of-work.md](product/experience/proof-of-work.md) | Proof mechanisms must be enumerable to be built. | Any pilot, or evidence that structured proof is too weak for a real work type. | **Prohibited without review** | `PENDING AUTHORISATION` — agent-proposed at GATE 1; selects an absence, so it cannot overclaim |
| **D18** | Employer non-response creates no approval or payment release. Submitted proof remains unresolved, awaiting explicit employer action or case handling; there is no response-window duration, countdown or timer. | [domain/state-transitions.md](domain/state-transitions.md) | GATE 4 needs an explicit, non-automatic treatment of silence without implying an entitlement. | First prototype feedback or before any pilot or production payment-policy decision. | **Prohibited without review** — does not establish a legal entitlement, employer obligation, real-world dispute rule or payment policy | `AUTHORISED` 2026-09-09 — prototype only; D18 remains OPEN |
| **D19** | **Text face: Vazirmatn** — self-hosted and subset to woff2 (weights 400/600/700), human-authorised at GATE 2. Its licence was verified against the licence text as SIL OFL 1.1 (2026-09-08); the notice ships beside the fonts. The **monospace** face is still unselected and falls back to a system monospace. | [design/typography.md](design/typography.md); [engineering/dependency-budget.md](engineering/dependency-budget.md) | The type scale, the numeric alignment and the whole visual system depend on a face with Persian tabular figures and usable weight separation. | Any change of the text face; selection of a self-hosted monospace face. | **Prohibited without review** — redistribution relies on the OFL, whose notice must ship with the fonts | `AUTHORISED` (text face) 2026-09-08 · monospace half `PENDING AUTHORISATION` |

**GATE 3 entry reconciliation — 2026-09-09:** D5 remains sufficient: the shared demo world
requires only the documented, small curated scenario taxonomy. D6 remains sufficient: every
implemented location rule operates on city and neighbourhood, with the fixed synthetic distance
table behind `GeolocationPort`; no rule requires coordinates. Neither decision is resolved or
expanded by this assessment.

`PENDING AUTHORISATION` entries were proposed by an agent and are **not** authorised. Per
[ADR-0010](adr/0010-prototype-provisional-defaults.md) safeguard 8 they may not be relied upon past
the gate named in their *Blocks* column. D16 and D18 are now human-authorised **for the prototype
only**; both remain OPEN. D17 remains `PENDING AUTHORISATION` and blocks any real pilot, not
GATE 4.

**GATE 4 entry reconciliation — 2026-09-09:** D7, D16 and D18 have `AUTHORISED`
prototype-provisional defaults, so GATE 4 entry is ready. D17 blocks **any real pilot**, not
GATE 4: the structured-fields-only prototype may proceed without authorising media, while D17
remains pending and no storage port or media handling is introduced.

D19's **text face** was human-authorised at GATE 2, which is the gate that ships a font file. The
human named Vazirmatn; an agent then verified the SIL OFL 1.1 licence against the licence text — the
agent applied a human-approved value, it did not select the face or assert the licence unprompted.
The **monospace** half stays `PENDING AUTHORISATION`: no human named a monospace face, so an agent
must not select one, and the code/identifier roles use a system-monospace fallback until one is.

No entry in [legal/open-questions.md](legal/open-questions.md) appears here or ever may. Legal
`UNKNOWN`s stay `UNKNOWN`; only prototype behaviour *around* them is selected, and only where that
selection asserts nothing about the answer.

## Rules

- An entry is resolved by a decision recorded in the appropriate canonical document, and by an ADR
  where the decision is architectural.
- "Default if unresolved" is what happens if the project proceeds without deciding. It is a
  fallback, not a decision, and must be labelled as such wherever it is relied upon. It is **not**
  a prototype-provisional default: that is a separate, human-approved mechanism recorded in the
  table above.
- D13 and D14 deliberately have no default. Defaulting either would mean adopting a hosting or
  data-residency posture by accident.
- A split entry is struck through and retained rather than deleted, for the same reason accepted
  ADRs are superseded rather than edited: the reasoning is the value.
- An agent may add entries. An agent may not resolve one without explicit human instruction.
- An agent may **apply** an `AUTHORISED` prototype-provisional default. An agent may not create a
  consequential new one; it records it as `PENDING AUTHORISATION` instead.
