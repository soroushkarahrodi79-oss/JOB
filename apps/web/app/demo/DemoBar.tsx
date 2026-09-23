'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoSession } from './session';
import styles from './demo.module.css';

// The demo bar (navigation.md, "The demo bar — SH-01"): a distinct bar pinned to the block start,
// visually not product chrome, with a standing label naming it as a demo mechanism that does not
// exist in a real deployment. Distinction comes from ground and edge — NOT the hatch, which
// color.md rule 5 reserves for the truth chip alone.
//
// SH-03 is reachable here for the demo worker and operations while their home navigation remains
// PLANNED. The employer has its own SH-03 destination in the employer rail. This is navigation to
// the in-tab MOCK outbox, not a sign-in or a live messaging integration.

export function DemoBar({ detail }: { detail?: string }) {
  const { session, restored } = useDemoSession();
  const pathname = usePathname();

  return (
    <div className={styles.demoBar} role="note" aria-label="نوار نمایش">
      <span className={`type-label ${styles.demoBarLabel}`}>
        نوار نمایش — سازوکار نمایشی است و در نسخهٔ واقعی محصول وجود ندارد.
      </span>
      {detail !== undefined ? (
        <span className={`type-detail ${styles.demoBarDetail}`} data-testid="demo-bar-detail">
          {detail}
        </span>
      ) : null}
      <span className={styles.demoBarLinks}>
        {restored && session.activeActor !== null ? (
          <Link className={`type-detail ${styles.demoBarLink}`} href="/demo">
            تغییر نقش
          </Link>
        ) : null}
        {restored &&
        session.activeActor !== null &&
        session.activeActor !== 'employer' &&
        pathname !== '/outbox' ? (
          <Link
            className={`type-detail ${styles.demoBarLink}`}
            href="/outbox"
            data-testid="demo-outbox-link"
          >
            پیام‌های نمایشی (MOCK)
          </Link>
        ) : null}
        <Link className={`type-detail ${styles.demoBarLink}`} href="/truth">
          دفتر شفافیت
        </Link>
      </span>
    </div>
  );
}
