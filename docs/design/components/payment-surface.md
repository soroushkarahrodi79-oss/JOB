# Payment Surface — Specification

> **Canonical for:** how the simulated payment experience is rendered.
> **Not canonical for:** what each state means or how it is worded (see
> [../../product/experience/payment.md](../../product/experience/payment.md)), the state machine (see
> [../../domain/state-transitions.md](../../domain/state-transitions.md)), or money representation
> (see [../../architecture/data-model.md](../../architecture/data-model.md)).
> **Status:** Draft.

Appears on W-07, at E-02's commitment step, on E-07 at release, and as the payment rows inside
[evidence-chronology.md](evidence-chronology.md).

## The one thing this surface must not do

**It must never imply that the Platform holds money.**

[../../product/experience/payment.md](../../product/experience/payment.md) names the real failure
mode, and it is not dishonest copy — it is the ordinary interface conventions. A balance figure. A
progress bar filling toward "complete". A padlock. A shield. The word «امن». Each is a design default
in this category, each would be read as *the platform has the money*, and none of them requires a
single false sentence to be written.

So the design does it structurally: the surface has no primitive capable of expressing custody.

| Absent | Consequence |
| --- | --- |
| Balance, wallet, "available funds", "in escrow", held-amount figure | Nothing on the surface can be read as a sum the Platform is holding |
| Padlock, shield, vault, safe iconography | Not in the icon set ([../foundations.md](../foundations.md)) |
| Progress bar, step indicator, percentage complete | Nothing implies the chain is inevitable |
| An aggregate or summary payment state | Every state is its own entry, with its own words |

## The commitment block

Wherever an amount is committed or shown as committed, it renders as one block containing three
things — and the third is not separable from the other two:

```
۹۸۰٬۰۰۰ تومان
تعهد پرداخت ثبت شد

پلتفرم این مبلغ را نگه نمی‌دارد. این یک تعهد ثبت‌شده است.
```

- The third line is **inside the block**, at `type.body`, never `type.detail`, never a footnote,
  never collapsible, and never below a fold at any width
  ([../foundations.md](../foundations.md), *what may never change with width*).
- It renders on **both** sides: at E-02's commitment step, where the employer might otherwise assume
  the Platform is holding the money, and on W-02's terms, where the worker is deciding whether to
  rely on them. Placing it only on the employer's side would put the caveat where it is least needed.
- It links to SH-02 row 12 — the row that exists so the demo can show an absence honestly, and the
  clearest single test of charter success criterion 4.

## The chain

Rendered as [evidence-chronology.md](evidence-chronology.md), filtered to payment events. Not a
stepper, not a status bar, not a timeline graphic with a moving marker.

The chronology is the right form for a reason beyond consistency: a stepper implies a fixed sequence
with a known end, and this chain can fail, retry, be held by a case, and end in a state the Platform
cannot observe. A form that cannot represent that would be lying about the mechanism, not just about
the money.

Each entry carries its state's wording from
[../../product/experience/payment.md](../../product/experience/payment.md), its role from
[../state-vocabulary.md](../state-vocabulary.md), and its `SIMULATED` chip where the entry came from
the port.

## The failure, on purpose

Scenario S5, beat A9, and a required beat rather than an error path.

```
⟨sim⟩  ۰۹:۱۲ · جمعه ۱۶ شهریور
       ارائه‌دهنده خطا گزارش کرد            ⟨critical⟩
       تعهد پرداخت پابرجاست. پرداخت شما لغو نشده است.

⟨sim⟩  ۰۹:۱۴ · جمعه ۱۶ شهریور
       دستور پرداخت دوباره صادر شد

⟨sim⟩  ۰۹:۱۵ · جمعه ۱۶ شهریور
       ارائه‌دهنده پرداخت را گزارش کرد
```

Four rules:

1. **`SettlementFailed` may never render without the obligation-survives sentence in the same block.**
   This is the moment a worker is most likely to assume she has been cheated by a system rather than
   failed by an integration, and the sentence is the difference. It is a rendering constraint on the
   component, not a copy guideline.
2. **The retry is a new entry.** The failure is never overwritten, greyed, collapsed, marked
   "resolved", or hidden behind a "show earlier attempts" control. Both attempts stay at full weight
   permanently — in the live demo, and in the historical record afterwards.
3. **`critical` appears here and nowhere else in the prototype** ([../color.md](../color.md)). Its
   scarcity is what makes it mean something.
4. **The failure is on the worker's screen, not only the employer's.** S5 must be shown to the party
   it affects.

## Truth chip density

W-07 is the busiest truth-labelling surface in the product: every payment entry from the port carries
`SIMULATED`.

The collapse rule from [../color.md](../color.md) applies — consecutive identical chips in one
chronology collapse to a single chip on the containing block, with the level still named in each
entry's own text and every chip still linking to SH-02. Point-of-use labelling is preserved in words;
what is removed is a column of identical annotations.

Payment demonstration requirement 5 says `SIMULATED` is labelled at each payment state that came from
the port, not once per screen. The collapse satisfies it: the label is on each state, in the state's
own text. The chip is the affordance, not the label.

**`ReceiptAcknowledged` never collapses**, because it did not come from the port. It is the only state
in the chain grounded in a human observation, and it is unmarked for that reason.

## Amounts

- Toman only, unit always stated, grouped, Persian digits, tabular
  ([../typography.md](../typography.md)).
- **Rial appears in no interface**, so it cannot be confused with Toman in one. A 10× error is
  identified as the most likely data defect in the project and this is the most damaging surface for
  it to appear on.
- **One amount per surface uses `type.amount`.** Others are `type.numeric` at body size. A payment
  screen with four large figures has no hierarchy at the moment hierarchy matters most.
- A partial release, where one is recorded by a case resolution, renders as **both figures with
  their relationship stated in words** — never as one figure with a strikethrough. A struck-through
  amount on a payment record reads as a correction to history.

## Receipt acknowledgement

`ReceiptAcknowledged` is the only `positive` state in the chain, and the surface says why: the
Platform cannot observe that money arrived, so this is the worker confirming that it did.

The action is offered, never required, and the engagement's closure does not depend on it. A surface
that blocked on it would make closure depend on a fact the system cannot observe, which is a false
certainty of a different kind.

## Anti-patterns

| Anti-pattern | Why |
| --- | --- |
| Any balance, wallet or held-funds figure | Charter non-goal; Q5 severe; truth-matrix row 12 |
| «امن», «تضمین‌شده», «نگهداری امن», or any assurance framing | Same, in copy |
| Padlock, shield, vault iconography | Same, in an icon |
| A progress bar or stepper for the payment chain | Implies inevitability the Platform cannot offer |
| A failure that is overwritten, hidden or marked resolved by a retry | The record is the product |
| `SettlementFailed` without the obligation-survives sentence | The single most damaging omission available on this surface |
| `SettlementReported` styled as `positive` or worded as confirmed | The Platform knows only what an adapter said |
| Rial and Toman on one screen; an amount without its unit | The project's most likely data defect |
| A struck-through amount on a partial release | Reads as history being corrected |
| One `SIMULATED` chip in a screen footer instead of at each state | [ADR-0004](../../adr/0004-demo-truth-taxonomy.md) |
| Fees, commission, invoices, refunds, wage advance | Not modelled; D10; charter non-goals |
