# Personas

> **Canonical for:** human actors, their motivations, constraints and capability assumptions.
> **Not canonical for:** the system's representation of them (see
> [../domain/domain-model.md](../domain/domain-model.md)). `Worker` the person is not `Worker` the entity.
> **Status:** Draft — these are design hypotheses, not research findings. No user research
> has been conducted. See [../open-decisions.md](../open-decisions.md) D1.

Personas are constraints on design, not marketing copy. Each records what the person cannot do
as much as what they want.

---

## P1 — Flexible worker (primary)

Seeks short-duration, shift, or mission-based income. May combine several sources of income.

**Motivations:** predictable access to work; being paid without argument; not repeating proof of
competence to every new employer.

**Constraints:**
- Mobile-only. Small screen, one hand, often in transit or on site.
- Data cost and network quality are real limits. Heavy pages have a price.
- Persian-first. Assume no English.
- Variable digital literacy. Multi-step verification flows are a drop-off risk.
- Time is the scarce resource. A 20-minute onboarding for a 4-hour engagement will not be completed.

**Design consequences:** onboarding must be incremental and rewarded; verification must be
deferrable; the Passport must show visible value before it demands effort.

---

## P2 — Small business operator (primary)

Runs a café, shop, workshop, warehouse, event, or small service business. Needs a suitable
person soon, sometimes within hours.

**Motivations:** someone who arrives, is competent enough, and does not create risk.

**Constraints:**
- Not a recruiter. Will not write a job specification or run a structured process.
- Extremely time-poor at the moment of need.
- Low tolerance for no-shows; a no-show is a business loss, not an inconvenience.
- Suspicious of platforms that charge before delivering value.

**Design consequences:** opportunity creation must be minutes, not a form; eligibility must be
expressible as a small number of concrete requirements; reliability signals must be legible at a
glance.

---

## P3 — Operations / platform staff (supporting)

Internal. Investigates disputes, reviews verification, handles trust-and-safety escalations.

**Motivations:** resolve cases correctly with an auditable trail.

**Constraints:** sees personal data, so the data-minimisation rules in
[../architecture/data-model.md](../architecture/data-model.md) apply most sharply here.

**Design consequences:** admin tooling is evidence-first; every consequential action is attributed
and recorded.

---

## Deliberately excluded actors

Recorded to prevent scope drift:

- **Recruitment agencies / labour intermediaries** — introducing a third party between worker and
  employer changes both the engagement classification analysis and the trust model. Out of scope.
- **Large enterprise HR** — different buying process, different compliance surface.
- **Cross-border workers or employers** — introduces sanctions, currency and jurisdiction
  questions the project has not researched.

## Known persona risk

P1 and P2 are asserted from reasoning about the market, not from interviews. The most likely
error is that P2's real reservation is trust in *the platform*, not in the worker — which would
shift emphasis from the Worker Passport toward guarantees the Platform is not positioned to give.
Tracked as D1.
