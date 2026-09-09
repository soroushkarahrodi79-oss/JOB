# Acceptance Gates

> **Canonical for:** gate definitions, exit criteria, and the current gate.
> **Not canonical for:** capability truth status (see [demo-truth-matrix.md](demo-truth-matrix.md)).
> **Status:** Draft.

Work proceeds in gates. A gate is not "mostly done". Each gate ends with an explicit verdict.
Work belonging to a later gate is not started early, even when it looks cheap.

## Current gate

**GATE 4 — PROTOTYPE SURFACE (ENTRY BLOCKED).** GATE 3 closed
`DOMAIN_IMPLEMENTATION_LOCKED` on 2026-09-09. Entry is blocked by the human authorisations for
D16 and D18 recorded in [open-decisions.md](open-decisions.md); no GATE 4 work has started.

## Gate history

| Gate | Verdict | Date |
| --- | --- | --- |
| GATE 0 — Foundation | `FOUNDATION_LOCKED` | 2026-09-07 |
| GATE 0.1 — Architecture reconciliation | `FOUNDATION_RECONCILED` | 2026-09-07 |
| GATE 1 — Product and interaction definition | `PROTOTYPE_EXPERIENCE_LOCKED` — on authorised prototype-provisional defaults for D1, D2, D3, D8 and D9, none of which is resolved | 2026-09-07 |
| GATE 1.5 — Design system and visual product language | `DESIGN_SYSTEM_LOCKED` — on the same five authorised defaults, with D19 newly recorded `PENDING AUTHORISATION` | 2026-09-07 |
| GATE 2 — Engineering skeleton | `ENGINEERING_SKELETON_LOCKED` — on the same five authorised defaults; D19 human-authorised to Vazirmatn (text face) and discharged, its monospace half still `PENDING AUTHORISATION` | 2026-09-08 |
| GATE 3 — Domain implementation | `DOMAIN_IMPLEMENTATION_LOCKED` — [merged PR #2](https://github.com/soroushkarahrodi79-oss/JOB/pull/2), implementation commit [`c0fd88b`](https://github.com/soroushkarahrodi79-oss/JOB/commit/c0fd88b51f1c3c499dd42873c51096e894138d43), with green PR CI | 2026-09-09 |

GATE 1 first returned `PROTOTYPE_EXPERIENCE_NOT_READY` because the gate rule and the decision
register contradicted each other. The contradiction was resolved by
[ADR-0010](adr/0010-prototype-provisional-defaults.md), not by resolving any decision.

GATE 0.1 was an unplanned reconciliation gate, recorded here after the fact because it produced an
accepted ADR ([ADR-0008](adr/0008-provisional-application-stack.md)) and changed a gate's blocking
status. A gate that leaves no record in this document is a gate that did not happen.

GATE 1.5 was inserted on explicit human instruction and is numbered fractionally for the reason
recorded in [ADR-0011](adr/0011-design-system-gate.md): renumbering the later gates would have
required editing three accepted ADRs, and accepted ADRs are immutable. GATE 1.5 also found and
corrected a contradiction GATE 1 had introduced — three GATE 1 documents used "GATE 2" to mean the
design gate while this document used it to mean the engineering skeleton.

## GATE 0 — Foundation

**Purpose:** produce a coherent, non-duplicative documented foundation from which product and
visual design can begin, without pre-committing the future production architecture.

**In scope:** documentation, governance, decision records.

**Explicitly out of scope:** application screens, external integrations, database provisioning,
payment or identity connections, dependency installation, build tooling, speculative directory
skeletons.

**Exit criteria**

1. Every concept in the canonical ownership map has exactly one owning document.
2. No concept is independently defined in two documents.
3. The truth taxonomy exists and every listed capability has a truth status.
4. External capabilities that will later require real Iranian providers are named as ports.
5. Consequential product and legal questions are recorded as open, not silently answered.
6. Architectural decisions that constrain the future are recorded as ADRs.
7. A duplication and contradiction audit has been performed, and every finding is either resolved or recorded in [open-decisions.md](open-decisions.md).

**Verdict vocabulary:** `FOUNDATION_LOCKED` or `FOUNDATION_NOT_READY`. No other verdict is valid.

## GATE 1 — Product and interaction definition

Personas, flows and demo scenarios are taken from draft to stable, and screen-level interaction
is defined. Still no application code.

**Blocked on:** every entry in [open-decisions.md](open-decisions.md) whose *Blocks* column names
GATE 1, unless that entry is operating under an `AUTHORISED` prototype-provisional default
([ADR-0010](adr/0010-prototype-provisional-defaults.md)). That register is canonical; this document
does not restate the list.

**Exit criteria**

GATE 1 previously had none. They are recorded here so the gate can be judged rather than declared.

1. The complete investor-demo narrative is defined, with a stated time budget, and each stage names
   what it proves and what the viewer understands afterwards.
2. Three demo stories are defined over **one** shared dataset, cross-referencing the same entities.
   Three disconnected demo worlds fail this criterion.
3. Every screen has a stable ID and justifies its existence against a new decision, state
   transition, or investor understanding. Rejected screens are recorded with their reason.
4. The canonical state progression is defined for every entity the demo exercises.
5. Matching, classification, Passport, employer trust, Proof of Work, payment and disputes each have
   a defined prototype experience, and each states which behaviour is functional and which is
   simulated.
6. The demo dataset is specified by archetype and approximate count, with generation rules.
7. Every capability the demo uses appears in [demo-truth-matrix.md](demo-truth-matrix.md).
8. Prototype elements that must not proceed into a real pilot without qualified Iranian legal review
   are identified, per capability.
9. A duplication and contradiction audit has been performed against the charter, the domain model
   and the truth matrix, and every finding is resolved or recorded.
10. Every open decision whose *Blocks* column names GATE 1 is either **resolved by explicit human
    instruction**, or operating under an `AUTHORISED` **prototype-provisional default** that
    satisfies all seven recorded fields and all eight safeguards in
    [ADR-0010](adr/0010-prototype-provisional-defaults.md), and is enumerated in the gate report.
    A provisional default is not a resolution: the decision stays `OPEN`.
11. The investor golden path is defined separately from the full screen inventory, and is small
    enough to argue a thesis rather than tour a product.

**Verdict vocabulary:** `PROTOTYPE_EXPERIENCE_LOCKED` or `PROTOTYPE_EXPERIENCE_NOT_READY`. No other
verdict is valid.

## GATE 1.5 — Design system and visual product language

The visual and interaction system the later gates implement. Specification only: no dependencies, no
components, no styling code, no scaffold. Inserted by
[ADR-0011](adr/0011-design-system-gate.md).

**Blocked on:** nothing. It inherits GATE 1's five authorised prototype-provisional defaults and adds
no dependency on an unresolved decision.

**Exit criteria**

1. Two or more credible visual directions are assessed against the same surface, and **one is
   selected**, with the rejections and their reasons recorded.
2. Typography, colour, spacing, density, radius, borders, elevation, iconography, motion, focus,
   responsive behaviour and content hierarchy each have a canonical decision with a product reason.
   A value chosen for completeness is a defect.
3. The typography system is specified against Persian first — body readability, mixed Persian/Latin,
   Persian numerals, tabular alignment, money and Jalali dates — and creates no foreign-CDN runtime
   dependency.
4. Brand colour and semantic state are architecturally separate, and every semantic role is defined
   by meaning rather than by hue.
5. Every state the domain holds has exactly one rendering, produced by one state system rather than
   by an independent treatment per status. A state present in
   [domain/state-transitions.md](domain/state-transitions.md) and absent from the vocabulary is a
   defect.
6. No state, provenance level or truth level is communicated by colour alone.
7. The Opportunity Card, the Worker Passport and the Employer Trust Profile each have a specification
   covering content, hierarchy, variants, empty states, mobile and RTL behaviour, and anti-patterns.
8. Matching explanation, classification signal, Proof of Work, payment and dispute review each have a
   rendering pattern that satisfies the demonstration requirements in
   [product/experience/](product/experience/).
9. Every Golden Path view is mapped to the visual system, and the supporting screens are confirmed to
   reuse it without a second visual language.
10. Accessibility is specified to WCAG 2.2 Level AA as a floor, including focus behaviour, keyboard
    expectations, contrast, touch targets, motion, semantic heading hierarchy, error messaging, and
    screen-reader expectations for status and evidence.
11. Navigation is defined per actor and adds no destination the screen inventory does not make an
    entry point.
12. The token architecture is proposed, semantic, bounded, and carries an explicit rule against
    token growth.
13. The adversarial audits in [design/adversarial-review.md](design/adversarial-review.md) have been
    run, their findings corrected, and unresolved risks carried forward explicitly rather than
    closed.
14. No application code, dependency, component, route or stylesheet is produced.

**Verdict vocabulary:** `DESIGN_SYSTEM_LOCKED` or `DESIGN_SYSTEM_NOT_READY`. No other verdict is
valid.

## GATE 2 — Engineering skeleton

Workspace, strict TypeScript, linting, test runners, and the domain/ports separation expressed
in code. This is the first gate that installs dependencies. It is also the first gate at which
this repository can define validation commands; until then, `CLAUDE.md` correctly states that
none exist.

**Not blocked.** [ADR-0008](adr/0008-provisional-application-stack.md) is accepted for the
prototype, and GATE 2 was previously blocked on a production hosting question it never depended on.

**Must be satisfied within this gate:** D15 (dependency and supply-chain resilience) and the
CI-enforced portability check required by ADR-0008 constraint 3. These are work inside the gate,
not preconditions for entering it.

**Also within this gate**, per [ADR-0011](adr/0011-design-system-gate.md) decision 4: the token layer
from [design/tokens.md](design/tokens.md), the accessibility semantics of the primitives, and the
eight verification risks carried out of GATE 1.5 in
[design/adversarial-review.md](design/adversarial-review.md). Screens are GATE 4.

**Exit criteria.** Recorded here so the gate can be judged rather than declared.

1. The workspace installs from a committed, frozen lockfile; strict TypeScript, linting and test
   runners run from canonical commands documented in `CLAUDE.md` §7.
2. The domain/ports separation is expressed in code and the inward dependency direction is enforced
   in CI ([ADR-0002](adr/0002-pragmatic-modular-monolith.md)), not by review.
3. Persian-first RTL is enforced in CI: physical `left`/`right` is rejected in CSS and in JS/TSX
   ([ADR-0005](adr/0005-persian-first-rtl-native-ui.md)).
4. The token layer exists, is semantic and bounded, with contrast verified as a token constraint and
   the [ADR-0012](adr/0012-visual-product-language.md) absences enforced by test.
5. The primitives exist with their accessibility semantics, and every finite domain state in
   [domain/state-transitions.md](domain/state-transitions.md) has exactly one rendering, guarded by a
   test (GATE 1.5 exit criterion 5).
6. The eight risks in [design/adversarial-review.md](design/adversarial-review.md) are discharged with
   rendered evidence or explicitly carried; R1 (Persian tabular figures) and R8 (D19) among them.
7. D15 is satisfied: a committed lockfile with integrity hashes, a reproducible frozen-lockfile
   install, and a justified dependency budget ([engineering/dependency-budget.md](engineering/dependency-budget.md)).
8. The generic-deployability portability check ([ADR-0008](adr/0008-provisional-application-stack.md)
   constraint 3) runs in CI.
9. No product screen, domain rule, provider adapter or database schema is built — those are GATE 3
   and GATE 4.

**Verdict vocabulary:** `ENGINEERING_SKELETON_LOCKED` or `ENGINEERING_SKELETON_NOT_READY`. No other
verdict is valid.

## GATE 3 — Domain implementation

Domain model and eligibility/classification rules, behind ports, with tests. Simulated adapters
implement full port contracts including failure paths.

**Exit criteria**

1. The documented domain entities, invariants and lifecycle guards are implemented as domain code;
   invalid transitions reject deterministically.
2. Eligibility is deterministic, binary and explainable. Classification is an explainable,
   recomputable `HYPOTHESIS` signal with recorded factors, never a legal verdict or publication
   gate.
3. Ports use domain vocabulary, have no provider dependency, and declare domain-level failure
   outcomes. Simulated and mock adapters exercise deterministic success and failure paths without
   contacting a real service.
4. Synthetic demo data is reproducible and contains no real personal, registry, bank or phone
   identifiers. Its skills taxonomy and location representation use D5 and D6's authorised
   prototype-provisional defaults, while both decisions remain open.
5. [demo-truth-matrix.md](demo-truth-matrix.md)'s `Actual` values match the observable domain and
   adapter implementation; no real integration or product screen is introduced.
6. No decision that blocks a later gate is silently authorised. D16, D17 and D18 remain in the
   status recorded in [open-decisions.md](open-decisions.md).

**Verdict vocabulary:** `DOMAIN_IMPLEMENTATION_LOCKED` or `DOMAIN_IMPLEMENTATION_NOT_READY`. No
other verdict is valid.

## GATE 4 — Prototype surface

Persian-first, RTL-native UI over the domain. Every non-`FUNCTIONAL` capability carries its
truth label at the point of use.

**Blocked on:** every entry in [open-decisions.md](open-decisions.md) whose *Blocks* column names
GATE 4, unless it has an `AUTHORISED` prototype-provisional default under
[ADR-0010](adr/0010-prototype-provisional-defaults.md). On 2026-09-09, D16 and D18 are the only
such entries still `PENDING AUTHORISATION`; the register is canonical for their choices.

**Exit criterion:** the truth matrix `Actual` column matches observable behaviour, verified by
walking each demo scenario.

## Gate discipline

- A gate's exit criteria may be tightened at any time. Loosening them requires an ADR.
- Discovering that a later gate's work is needed early is a signal to re-scope the gate, not to
  quietly start the work.
- Tests verify the implementation. Writing behaviour specifically to satisfy a test, rather than
  to satisfy the domain, is a defect regardless of whether the test passes.
