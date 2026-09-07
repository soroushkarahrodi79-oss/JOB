# Data Model — Representation and Persistence Rules

> **Canonical for:** persistence rules, data representation decisions, retention and minimisation.
> **Not canonical for:** entities and their meaning (see
> [../domain/domain-model.md](../domain/domain-model.md)).
> **Status:** Draft.

**There is no schema, and no database is provisioned.** Introducing tables before the domain is
implemented would encode guesses as structure. This document holds only the rules that any future
schema must satisfy.

## Representation rules

| Concern | Rule | Why |
| --- | --- | --- |
| **Money** | Integer minor units plus an explicit currency and unit. Never floating point. Never a bare number. | Rounding errors in a payment ledger are unrecoverable. |
| **Rial vs Toman** | The stored unit is **Rial**. Toman is a **presentation** concern and is converted at the boundary. Never stored ambiguously. | Iranian pricing is spoken in Toman and denominated in Rial. A 10× error here is a product-destroying bug, and it is the single most likely data defect in this project. |
| **Time** | UTC instant plus the originating time zone. | Engagements are time-bounded; a wall-clock string cannot survive a shift boundary. |
| **Calendar** | Jalali is a **presentation** concern, never a storage format. | Storing localised dates makes arithmetic and comparison unsound. |
| **Identifiers** | Opaque, non-sequential, non-guessable. Never a national identifier or phone number. | Sequential IDs leak volume; natural keys leak identity. |
| **Names and text** | Unicode throughout, NFC-normalised. Persian and Arabic character variants (ی/ي, ک/ك) are normalised on input. **ZWNJ (U+200C) is preserved, never stripped**; it is neutralised only inside comparison keys, not in stored text. | Variant characters break search and duplicate detection invisibly in English testing. Stripping ZWNJ changes word meaning in Persian — see [../design/rtl-accessibility.md](../design/rtl-accessibility.md). |
| **Digits** | Stored as ASCII digits; Persian digits are a presentation concern. Input accepts Persian, Arabic-Indic and ASCII digits. | Users type in all three. |
| **Phone numbers** | Stored in a canonical normalised form with country code. | Iranian numbers are written in several formats. |
| **Enumerations** | Explicit named values, never integers with implied meaning. | |
| **Deletion** | No hard delete of records referenced by an engagement event. Deletion of personal data is a separate, deliberate mechanism. | The event record is the evidential basis of the Passport. |

## Structural rules

1. **The engagement event record is append-only.** Corrections are compensating events. Editing
   history destroys the credibility of everything derived from it.
2. **Derived state is derived.** Passport, reputation and Proof of Work are projections. If a
   projection is materialised for performance, it must be rebuildable from events, and that
   rebuild must be tested.
3. **Attestations store provenance, strength and time.** A verification result never collapses to
   a boolean.
4. **Verification evidence is not stored by default.** Store the outcome, its source and its time —
   not the underlying document or identifier — unless a validated legal obligation requires
   otherwise. See [../legal/open-questions.md](../legal/open-questions.md) Q3.

## Data minimisation

The project collects the minimum required for a stated purpose.

- Every personal-data field must have a recorded purpose before it is introduced.
- "It might be useful later" is not a purpose.
- Location data is captured at the coarsest granularity that satisfies the use case. Precise
  location for Proof of Work is a consent question, not a technical default — Q4.
- Sensitive categories (health, religion, political affiliation, ethnicity) are not collected.
- Demo data is never mixed with real data.

## Not decided

- Database engine deployment and hosting location. PostgreSQL is accepted for the prototype
  ([ADR-0008](../adr/0008-provisional-application-stack.md)); production hosting topology (D13) and
  personal-data residency (D14) are not. Where data physically resides is a legal question (Q8), not
  only an operational one, and the prototype avoids it entirely by holding synthetic data only.
- Multi-tenancy model. No current requirement.
- Retention periods. These depend on unresolved legal questions and are not guessed — Q7.
- Encryption at rest and key management. Deferred to the gate that introduces real data;
  specifying it now would be speculative infrastructure.
