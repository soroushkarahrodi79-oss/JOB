import Link from 'next/link';
import type { Money, PayBasis } from '@platform/domain';
import { PAY_BASIS_LABEL, StateMark, formatToman } from '@platform/ui';
import styles from './employer.module.css';

// The commitment block (docs/design/components/payment-surface.md, "The commitment block").
//
// Three things in one block, and the third is not separable from the other two:
//   the amount · the state «تعهد پرداخت ثبت شد» · the statement that the Platform holds nothing.
//
// The third line is INSIDE the block, at `type.body`, never `type.detail`, never a footnote, never
// collapsible, and never below a fold at any width (foundations.md, *what may never change with
// width*). It links to SH-02 row 12 — the row that exists so the demo can show an absence
// honestly, and the clearest single test of charter success criterion 4.
//
// WHICH AMOUNT IS BEING COMMITTED TO. The figure alone does not say. On `PerShift` it is the whole
// obligation; on `PerHour` it is a rate, and the shift total is not known — so the block states
// which, in a sentence, beside the figure it qualifies.
//
// The `PerHour` total is NOT computed here or anywhere else. Turning a rate into an obligation
// needs a rule for rounding, breaks and overruns that this project has not established
// (product/experience/payment.md records the commitment's legal character as UNKNOWN), and a
// number invented for the layout's convenience would be an obligation the employer never agreed
// to — on the surface where payment.md says the damage would be worst.
//
// There is deliberately no primitive here capable of expressing custody: no balance, no held
// amount, no progress bar, no padlock.
//
// THE BLOCK IS ALWAYS RENDERED, including while the employer has not yet typed a usable amount.
// Rendering it only once the figure parses would make the no-custody statement appear and
// disappear as someone types, and it moved the controls beneath it while the employer was
// reaching for them.

/** What the employer is undertaking, per basis. Neither wording implies a figure the other has. */
const COMMITMENT_SENTENCE: Readonly<Record<PayBasis, string>> = {
  PerShift: 'این مبلغ، کل تعهد پرداخت شما برای این شیفت است.',
  PerHour:
    'شما به پرداخت این نرخ برای هر ساعت کارکرد متعهد می‌شوید. مبلغ کل شیفت اینجا محاسبه نمی‌شود و به ساعت‌هایی بستگی دارد که بعداً ثبت می‌شود.',
};

export function CommitmentBlock({ amount, basis }: { amount: Money | null; basis: PayBasis }) {
  return (
    <div className={styles.commitment} data-testid="commitment-block" data-basis={basis}>
      {amount === null ? (
        <p className="type-body" data-testid="commitment-needs-amount">
          مبلغ هنوز وارد نشده است.
        </p>
      ) : (
        <>
          <p className={`type-amount ${styles.commitmentAmount}`} data-testid="commitment-amount">
            {formatToman(amount)}
          </p>
          {/* The basis sits with the figure, never only in the sentence below it. */}
          <p className="type-body-strong" data-testid="commitment-basis">
            {PAY_BASIS_LABEL[basis]}
          </p>
        </>
      )}
      <StateMark
        family="payment"
        state="CommitmentRecorded"
        viewer="actor"
        label="تعهد پرداخت ثبت می‌شود"
      />
      <p className="type-body" data-testid="commitment-scope">
        {COMMITMENT_SENTENCE[basis]}
      </p>
      <p className="type-body" data-testid="no-custody">
        پلتفرم این مبلغ را نگه نمی‌دارد و آن را از شما نمی‌گیرد. آنچه ثبت می‌شود، تعهد شما به پرداخت
        است.{' '}
        <Link className={styles.inlineLink} href="/truth#truth-row-12">
          توضیح این موضوع در دفتر شفافیت
        </Link>
      </p>
    </div>
  );
}
