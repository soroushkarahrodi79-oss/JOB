# ADR-0010 — Prototype-provisional defaults

**Status:** Accepted · **Date:** 2026-09-07
**Scope:** non-production prototype work only. This ADR makes no production commitment and resolves
no open decision.

**Revision note:** an earlier `Proposed` revision of this record, titled *Gate exit on labelled
defaults*, framed the problem as a gate-exit rule and offered two options without selecting one. It
was revised in place on human instruction, which introduced the mechanism below. Immutability binds
accepted ADRs only ([README.md](README.md)); this record was never `Accepted` and was never built
on. The filename changed with the subject; the earlier slug had no inbound links outside this
repository and every internal reference is updated in the same change.

## Context

Two canonical documents gave different answers to the same question, and GATE 1 was the first gate
where the difference had a consequence.

[../acceptance-gates.md](../acceptance-gates.md) stated that GATE 1 is **blocked on** every entry in
[../open-decisions.md](../open-decisions.md) whose *Blocks* column names GATE 1 — D1, D2, D3, D8 and
D9. The register stated that each entry carries a **"Default if unresolved"**, which is "what happens
if the project proceeds without deciding … a fallback, not a decision, and must be labelled as such
wherever it is relied upon" — a rule that presupposes work proceeding while an entry is open. The
register also stated that an agent may not resolve an entry without explicit human instruction.

As written, GATE 1 could not be exited under any circumstance, including the circumstance where
every default had been applied correctly and labelled at every point of use.

The deeper problem is not the gate rule. It is that the register had one concept — "default" — doing
two incompatible jobs: describing what would happen by drift, and authorising a value that work
actively depends on. The first needs no approval and no tracking. The second needs both, or a
prototype convenience becomes a production commitment by silence.

## Decision

A third state is introduced between *open* and *resolved*: the **prototype-provisional default**.

> An unresolved product or architecture decision may use an explicitly human-approved
> **prototype-provisional default** solely to unblock non-production prototype work.

It does not convert an open decision into a resolved or validated one. The decision stays `OPEN`.

### What must be recorded

Every prototype-provisional default records seven fields, in the register in
[../open-decisions.md](../open-decisions.md), which is canonical for them:

1. the open decision ID it belongs to,
2. the provisional value,
3. scope — **prototype only**,
4. the canonical owner document where the provisional behaviour is described,
5. the reason the default is needed to proceed,
6. the revisit trigger — the event that forces reconsideration,
7. whether the default is **prohibited from transferring to a real pilot without review**.

### Safeguards

These are the decision, not commentary on it.

1. **The underlying decision remains `OPEN`.** A provisional default is never recorded in the
   *Default if unresolved* column, never struck through, and never cited as a resolution.
2. **The provisional value stays traceable to the register.** Every canonical document that relies on
   one names the decision ID at the point of reliance.
3. **Use is visible where materially relevant.** Where a provisional default changes what a user
   sees or what the system does to them, it is marked at that point — in the document now, and in
   the interface at the gate that builds it.
4. **Every provisional default has a revisit trigger.** A default with no trigger is a silent
   permanent decision wearing a temporary label.
5. **Prototype defaults do not become pilot or production defaults.** Field 7 is answered for each,
   and a `Yes` there is a blocker that must be discharged by review, not by elapsed time.
6. **This mechanism never fabricates an answer to a legal `UNKNOWN`.**
7. **Legal `UNKNOWN`s remain `UNKNOWN`.** Only *prototype behaviour around* an open legal question
   may be provisionally selected. Selecting behaviour that avoids asserting a legal position is
   permitted; selecting behaviour that presumes an answer is not. D3 is the worked example: choosing
   that the classification signal *informs* is permitted precisely because it asserts nothing about
   Q1 or Q6, whereas choosing that it *blocks* would presume an answer and is therefore unavailable
   under this mechanism regardless of who approves it.
8. **An agent may apply an already human-approved prototype default. An agent may not create a
   consequential new one without human authorisation.** An agent that identifies the need for one
   records it as `PENDING AUTHORISATION` and does not rely on it past the gate the decision blocks.

### Gate exit

A gate may exit when every open decision whose *Blocks* column names it is either resolved by
explicit human instruction, or is operating under an `AUTHORISED` prototype-provisional default
satisfying all seven fields and all eight safeguards, enumerated in the gate report.

The enumeration is load-bearing, not clerical: a gate report that does not list every provisional
default it relied upon has not satisfied this criterion.

## Consequences

- [../acceptance-gates.md](../acceptance-gates.md) exit criterion 10 for GATE 1 is replaced by the
  rule above. This is a loosening of a gate criterion and is therefore recorded here, as gate
  discipline requires.
- The register gains a second table. The *Default if unresolved* column keeps its original meaning —
  what happens by drift — and is now clearly distinct from an authorised provisional value.
- **GATE 1 exits on five authorised provisional defaults: D1, D2, D3, D8, D9.** None is resolved.
- A later human decision reversing any of them re-opens named parts of a closed gate. That is the
  accepted cost, and field 4 makes the affected surface findable rather than discovered.
- Safeguard 8 means an agent working alone can stall at a gate boundary. That is intended. The
  alternative is an agent authorising its own shortcuts, which is the failure this repository's
  governance exists to prevent.

## What this does not do

- It does not resolve D1, D2, D3, D8 or D9, and it does not license marking them resolved to pass a
  gate.
- It does not apply to legal questions. No entry in
  [../legal/open-questions.md](../legal/open-questions.md) may be given a provisional answer by this
  or any other mechanism — see [ADR-0007](0007-legal-claims-carry-epistemic-status.md).
- It does not apply to D13 or D14, which deliberately have no default. A provisional hosting or
  data-residency posture would be exactly the accident their absence prevents.

## Rejected alternatives

- **Blocked means blocked.** Every gate with a blocking entry needs a human decision session before
  it can close, and "Default if unresolved" applies only to work *within* a gate. Rejected because it
  makes that column nearly meaningless for the majority of entries, whose *Blocks* column names a
  gate — turning a tool for making uncertainty explicit into a tool for stopping work.
- **Remove the blocking language and rely on the register alone.** Rejected: it deletes the only
  mechanism that forces open decisions to be confronted at a deadline. The seven recorded fields
  exist to keep that pressure without the deadlock.
- **Let the gate report alone carry the provisional defaults.** Rejected: gate reports are not
  canonical documents and are not read again. Safeguard 2 requires a register entry.
