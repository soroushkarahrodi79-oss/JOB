# Legal Open Questions

> **Canonical for:** unresolved **legal** questions. Legal questions appear here and nowhere else.
> **Not canonical for:** product and architecture decisions (see [../open-decisions.md](../open-decisions.md)).
> **Status:** Live register.

All entries are `UNKNOWN` or `HYPOTHESIS` per
[legal-architecture.md](legal-architecture.md). None has been reviewed by qualified counsel.

| ID | Question | Status | Blocks | Impact if unfavourable |
| --- | --- | --- | --- | --- |
| **Q1** | Under Iranian labour law, when does a short-duration engagement arranged through a platform constitute an employment relationship, and what obligations follow? | `UNKNOWN` | D3, production launch | **Severe.** Invalidates the engagement-classification factor model and possibly the product shape. |
| **Q2** | Are the classification factors in [../domain/engagement-classification.md](../domain/engagement-classification.md) the ones Iranian law actually applies? | `UNKNOWN` | Classification correctness | High. The mechanism would be measuring the wrong things. |
| **Q3** | What is the lawful basis for collecting, verifying and retaining identity information, and what may be stored versus only checked? | `UNKNOWN` | Real identity integration | High. Determines whether the Passport's verification model is lawful as designed. |
| **Q4** | Is location or device attestation for Proof of Work lawful, and on what consent basis? | `UNKNOWN` | Proof of Work strength | Medium. Weakens Proof of Work; the fallback is mutual confirmation only. |
| **Q5** | Does facilitating payment between employer and worker require a licence or registration, and does any fund-holding cross into regulated activity? | `UNKNOWN` | Real payment integration | **Severe.** May require an entirely different payment topology. |
| **Q6** | Can the Platform lawfully facilitate engagements without becoming a party to them or a labour intermediary? | `UNKNOWN` | The intermediary model itself | **Existential.** Assumption A5 in the classification model. |
| **Q7** | What retention obligations and limits apply to engagement, payment and verification records? | `UNKNOWN` | Retention implementation | Medium. Retention is deliberately unimplemented until answered. |
| **Q8** | What data-protection obligations apply, including any restriction on where data may be stored? | `UNKNOWN` | Hosting decision (D4) | High. May constrain hosting to inside Iran. |
| **Q9** | What non-discrimination constraints apply to automated eligibility filtering? | `UNKNOWN` | Eligibility rule design | Medium. Explainability is already required, which limits exposure. |
| **Q10** | What are the tax reporting or withholding implications for either party? | `UNKNOWN` | Payment design | Medium. |
| **Q11** | Do sanctions or export-control constraints affect the use of foreign infrastructure or dependencies? | `UNKNOWN` | D4 | High. Compounds the stack tension in [ADR-0008](../adr/0008-provisional-application-stack.md). |

## Rules for this register

- Entries are added when identified, not when convenient.
- An entry moves out of `UNKNOWN` only with a dated reference to the supporting research or advice.
- An entry is never removed because it is uncomfortable. It is resolved or it stays.
- No question here may be answered by an AI agent, including Claude. Agents may identify questions
  and record them. They may not resolve them.

## Prototype-level mitigation

Until these are resolved, the prototype makes **no** compliance claim, connects to **no** real
provider, moves **no** funds, and stores **no** real personal data.
