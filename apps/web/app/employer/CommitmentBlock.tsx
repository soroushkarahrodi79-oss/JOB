import Link from 'next/link';
import type { Money } from '@platform/domain';
import { StateMark, formatToman } from '@platform/ui';
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
// THE BLOCK IS ALWAYS RENDERED, including while the employer has not yet typed a usable amount.
// Rendering it only once the figure parses would make the no-custody statement appear and
// disappear as someone types, which is the caveat-under-pressure failure foundations.md's
// "what may never change with width" list exists to prevent — and it moved the controls beneath
// it while the employer was reaching for them, which is how a click lands somewhere else.
//
// There is deliberately no primitive here capable of expressing custody: no balance, no held
// amount, no progress bar, no padlock. payment-surface.md's point is that the failure mode is not
// dishonest copy but ordinary interface convention, so the convention is absent rather than
// worded around.

export function CommitmentBlock({ amount }: { amount: Money | null }) {
  return (
    <div className={styles.commitment} data-testid="commitment-block">
      {amount === null ? (
        <p className="type-body" data-testid="commitment-needs-amount">
          مبلغ هنوز وارد نشده است.
        </p>
      ) : (
        <p className={`type-amount ${styles.commitmentAmount}`} data-testid="commitment-amount">
          {formatToman(amount)}
        </p>
      )}
      <StateMark
        family="payment"
        state="CommitmentRecorded"
        viewer="actor"
        label="تعهد پرداخت ثبت می‌شود"
      />
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
