# State Vocabulary

> **Canonical for:** how every state in the prototype is rendered — its Persian label, its mark, its
> semantic role and its permitted forms.
> **Not canonical for:** which states exist or what they mean (see
> [../domain/state-transitions.md](../domain/state-transitions.md)), what a semantic role means (see
> [color.md](color.md)), or provenance definitions (see
> [../product/experience/trust-profiles.md](../product/experience/trust-profiles.md)).
> **Status:** Draft.

**This document renders states. It does not define them.** Where a state appears here that is not in
[../domain/state-transitions.md](../domain/state-transitions.md), that is a defect in this document.

## One component, three dimensions

There is a single state primitive, `StateMark`. It is not one component per status and it is not a
badge library. Every state in the product is a coordinate in three dimensions:

**1 — Family.** What kind of fact this is: `eligibility`, `availability`, `provenance`, `engagement`,
`proof`, `payment`, `dispute`, `truth`. The family decides the mark set.

**2 — Role.** The semantic role from [color.md](color.md). The role decides the colour, and only the
colour.

**3 — Form.** How much visual weight the context needs:

| Form | Appearance | When |
| --- | --- | --- |
| `inline` | Mark and label in the text flow, no container | The default. Most states, most of the time. |
| `marker` | Mark in the provenance margin, label alongside | Provenance, and any state attached to an evidence row |
| `chip` | Bordered, self-contained | Only where a state must survive being scanned in a list |
| `banner` | Full width, above the content it qualifies | At most **one per screen**, and only for a state that changes what the whole screen means |

### Rules that make it a system rather than a set

1. **Label, mark and role, always all three.** A state never renders as a mark alone, a colour alone,
   or a coloured dot. There is no exception for compact layouts, because compact is the primary
   layout.
2. **The label is the state's own words.** Not an abbreviation, not an icon's tooltip. If the label
   does not fit, the form changes from `chip` to `inline`; the label does not shrink and never
   truncates.
3. **A chip wraps to two lines rather than truncating.** Persian state labels are long — «بدون پاسخ
   کارفرما تأیید شد» is not compressible — and a fixed-height chip is how a Latin-tuned component
   breaks in Persian.
4. **No new visual treatment per status.** A state that needs a look this system does not have is a
   state that needs a role it does not have; that is an ADR, not a stylesheet.
5. **A chip may only render a state from this document.** It may never render a judgement, a tier, an
   achievement, or a summary. A chip saying «کارگر مطمئن» is a governance violation, not a design
   choice.
6. **Marks are glyphs.** They survive forced-colors mode, they scale with text, and they are never
   the only carrier of meaning.

---

## Eligibility

The most consequential family in the product, and the one where tone does the most work.

| State | Persian | Role | Mark | Notes |
| --- | --- | --- | --- | --- |
| Eligible | «واجد شرایط» | `positive` | filled check | Accompanied by the requirement list, each with its basis |
| Conditional | «مشروط» | `attention` | half-filled check | Eligible subject to a stated, satisfiable condition. In the prototype this is D2's verification requirement — the condition is always named, and always with what satisfies it |
| Not eligible | «واجد شرایط نیست» | **`neutral`** | rule (a horizontal bar) | Never red, never a cross, never «رد شد» |

`neutral` for exclusion is a deliberate decision, taken directly from domain invariant 4: exclusion
is a category, not a low score, and not a failure of the person. Colouring it as an error would
recreate the "weaker match" framing the product exists to replace, and would break design principle
9 in the place it matters most.

Exclusion always carries **exactly one** unmet requirement (D9, and
[../product/experience/matching.md](../product/experience/matching.md) explanation rule 3). Rendering
a second is a dignity failure regardless of accuracy.

## Availability

| State | Persian | Role | Mark |
| --- | --- | --- | --- |
| Available | «در دسترس» + the window | `neutral` | filled window |
| Unavailable | «در دسترس نیست» + the reason window | `neutral` | open window |

Both are `neutral`. Availability is a fact about a calendar and never a judgement about a person; a
green/red availability pair is the cheap-labour-software signal this system specifically avoids.

## Provenance

Four levels, ink only, no hue — [ADR-0012](../adr/0012-visual-product-language.md) decision 2. They
are distinguished by mark form, by an always-present label, and by margin position.

| Level | Persian | Mark | Always accompanied by |
| --- | --- | --- | --- |
| Self-declared | «خوداظهار» | hollow outline | — |
| Verified (simulated) | «تأییدشده — شبیه‌سازی‌شده» | filled, with an inset check | the `SIMULATED` truth chip, the source, and the date |
| Observed | «ثبت‌شده» | solid record bar | a link to the engagement it came from |
| Derived | «محاسبه‌شده» | bracket | its denominator, as «X از Y» |

Four rules:

- **Every displayed claim has exactly one provenance mark.** A claim with none is a rendering defect.
- **A mark never sits on a mark.** Provenance qualifies content, not other annotations.
- **Corroboration is not promotion.** A self-declared skill supported by observed history keeps the
  hollow mark and gains an annotation pointing at the history. Promoting it would collapse the
  distinction the four layers exist to keep apart.
- **"Verified" without a source and a date is prohibited.** That is the badge-instead-of-evidence
  failure, and it is the one this system is most likely to be asked for.

## Engagement

States are [../domain/state-transitions.md](../domain/state-transitions.md)'s. Nothing here is added
or removed.

| State | Persian | Role | Notes |
| --- | --- | --- | --- |
| `Offered` | «دعوت‌شده» | `attention` | Waiting on the worker; carries the response window |
| `Accepted` | «پذیرفته‌شده» | `info` | |
| `InProgress` | «در حال انجام» | `info` | Carries the recorded arrival time |
| `Completed` | «انجام‌شده» | `positive` | |
| `Settled` | «تسویه‌شده» | `positive` | |
| `Declined` | «پیشنهاد رد شد» | `neutral` | Wherever it appears on a record, it carries «رد کردن پیشنهاد نشانهٔ بی‌اعتمادی نیست» |
| `Expired` | «مهلت پاسخ گذشت» | `neutral` | Same annotation. Not a reliability signal |
| `Cancelled` | «لغو شد» | `neutral` | Always with who cancelled and how far in advance. Both facts, or neither |
| `Disputed` | «پرونده باز است» | `attention` | Never `critical` |

`Declined` and `Expired` carry an explicit annotation because the state machine says they are not
reliability signals and an unannotated negative-sounding state on a person's record will be read as
one anyway. This is a case where the domain's intent survives only if the interface states it.

## Proof of work

| State | Persian | Role | Notes |
| --- | --- | --- | --- |
| `Awaited` | «در انتظار گزارش پایان کار» | `neutral` | |
| `Submitted` | «گزارش پایان کار ثبت شد» | `attention` | On the employer's surface; carries the remaining window |
| `Approved` | «کارفرما تأیید کرد» | `positive` | |
| `ApprovedByNonResponse` | «بدون پاسخ کارفرما تأیید شد» | **`warning`** on the employer's record, **`neutral`** on the worker's | See below |
| `Contested` | «کارفرما اعتراض کرد» | `attention` | Carries the stated reason |
| `ResolvedByCase` | «با نتیجهٔ پرونده تعیین شد» | `info` | Links to the recorded finding |
| `NotRequired` | «لازم نیست» | `neutral` | |

`ApprovedByNonResponse` is the most carefully specified state in this document, because it is the one
most likely to be quietly softened. It is `warning`, not `positive`; its label names the
non-response; and it may never be rendered with the `Approved` mark, in any form, at any density, on
either party's record. The distinction between "the employer approved" and "the employer did not
respond" is exactly the fact a reputation record must not blur.

It also renders on the *employer's* record with the same weight it has on the worker's. An employer
who does not respond has done something visible.

**The role differs by whose behaviour the record describes, and the label does not.** On the
employer's record it is `warning`, because it is a caveat about that employer. On the worker's record
it is `neutral`, because the worker did nothing — carrying a caveat colour on her record for
something an employer failed to do would be a dignity failure of exactly the kind principle 9 names.
The label is identical in both places, so the fact is not softened; only the colour follows the
actor.

This is the general rule wherever a state describes one party and appears on both records: **the
label follows the fact; the role follows whose behaviour it is.** It applies to `Cancelled` and to
`Contested` for the same reason.

## Payment

States are [../domain/state-transitions.md](../domain/state-transitions.md)'s; wordings are
[../product/experience/payment.md](../product/experience/payment.md)'s and are not restated.

| State | Role | Rendering obligation |
| --- | --- | --- |
| `CommitmentRecorded` | `info` | Rendered only inside the commitment block, which carries the no-custody statement in the same block |
| `AuthorizationSimulated` | `info` | `SIMULATED` chip on this entry |
| `ReleaseAuthorized` | `info` | |
| `SettlementReported` | **`info`**, not `positive` | `SIMULATED` chip. The word «گزارش» is load-bearing and is not removable |
| `SettlementFailed` | `critical` | **May never render without the obligation-survives sentence in the same block** |
| `ReceiptAcknowledged` | `positive` | The only `positive` in the chain, because it is the only state a human observed |

Two structural rules:

- **A retry is a new entry, never a replacement.** Both attempts stay in the chronology permanently.
  There is no rendering in which a failure is superseded, greyed, or collapsed.
- **There is no aggregate payment state.** No progress bar, no step indicator, no percentage
  complete. A payment chain drawn as a progress bar implies an inevitability the Platform cannot
  offer, since it is reporting what an adapter told it.

## Opportunity

Employer-facing, on E-01 and E-02.

| State | Persian | Role | Notes |
| --- | --- | --- | --- |
| `Draft` | «پیش‌نویس» | `neutral` | Not persisted if abandoned, so it renders only during creation |
| `Published` | «منتشر شد» | `info` | |
| `Filled` | «همهٔ جایگاه‌ها پر شد» | `positive` | |
| `Expired` | «بدون پر شدن منقضی شد» | `neutral` | Expiry is an outcome, not a failure, and emits no penalty |
| `Cancelled` | «لغو شد» | `neutral` | With the reason, and with the count of engagements it cancelled |
| `Closed` | «بسته شد» | `neutral` | |

`Expired` is `neutral` for the same reason a declined offer is: the domain says it emits no penalty,
and a `critical` or `warning` rendering would reintroduce the penalty through the interface.

## Attestation

Attestation states are the source of the provenance marks above, and they render as those marks
rather than as separate states — with one exception that needs its own rendering.

| State | Renders as |
| --- | --- |
| `Declared` | The self-declared provenance mark |
| `Confirmed by employer` | The observed provenance mark, with the confirming engagement |
| `VerifiedSimulated` | The verified provenance mark, plus the `SIMULATED` chip, source and date |
| `Submitted` | «در حال بررسی» — `neutral`, transient, on W-03 only |
| `VerificationFailed` | «تأیید انجام نشد» — `neutral`, with what may be tried next |

**`VerificationFailed` is `neutral`, not `critical`.** A failed verification is not the worker's
fault and is frequently the provider's. It renders with a route onward and never as a blocked or
rejected state.

It must also be reachable: the anti-gaming discipline in
[../product/experience/proof-of-work.md](../product/experience/proof-of-work.md) applies here too —
a simulated adapter that only succeeds is `MOCK`, so W-03 has to be able to show this state.

## Preferred Crew

| State | Persian | Role | Notes |
| --- | --- | --- | --- |
| `Marked` | «برای دعوت دوباره علامت‌گذاری شده» | `neutral` | Rendered as the **employer's recorded act**, with its date — never as a property of the worker |
| `Removed` | — | — | **Not rendered.** Removal returns the relationship to having no marking; there is no "was removed" state on anyone's record |

`Marked` is `neutral` rather than `positive` deliberately. A positive colour on a worker's row for
an employer's private intention would read as an endorsement the worker earned, and would be the
first step toward the badge tier this system does not have.

## Dispute

| State | Persian | Role |
| --- | --- | --- |
| `Opened` | «پرونده باز شد» | `attention` |
| `UnderReview` | «در حال بررسی» | `attention` |
| `OutcomeRecorded` | «نتیجه ثبت شد» | `info` |
| `Closed` | «بسته شد» | `neutral` |
| `Withdrawn` | «پس گرفته شد» | `neutral` |

**Findings are not states and never render as chips.** The four findings in
[../product/experience/disputes.md](../product/experience/disputes.md) render as a full sentence,
attributed, with the recorded basis beside it. A finding compressed into a badge would become a
verdict about a person — which is the thing the Platform declines to issue, and the badge form is how
it would happen by accident.

---

## Mapping note

The commissioning brief for this gate listed a shorter state set than the domain holds — engagement
states without `Declined`, `Expired` and `Disputed`; payment states named "pending" and "retrying".
The vocabulary above follows [../domain/state-transitions.md](../domain/state-transitions.md), which
is canonical, and the differences are recorded here rather than silently reconciled:

| Brief | This system | Why |
| --- | --- | --- |
| "invited" | `Offered` | Same state, domain name |
| "active" | `InProgress` | Same state, domain name |
| "proof submitted" | proof `Submitted` | Belongs to the proof family, not the engagement family |
| "approved" | proof `Approved` **and** `ApprovedByNonResponse` | One rendering for both would erase the distinction the domain exists to keep |
| "completed" | `Completed` and `Settled` | Two distinct states; work done is not money reported |
| "pending" | — | Not a domain state. What it names is `AuthorizationSimulated` or `ReleaseAuthorized` |
| "retrying" | — | Not a state. A retry is an event producing a second `ReleaseAuthorized` |
| — | `Declined`, `Expired`, `Cancelled`, `Disputed`, `Withdrawn`, `NotRequired` | In the domain and omitted from the brief. A state with no rendering would be invented at implementation time |
