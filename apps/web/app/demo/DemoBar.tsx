'use client';

import Link from 'next/link';
import { useDemoSession } from './session';
import styles from './demo.module.css';

// The demo bar (navigation.md, "The demo bar — SH-01"): a distinct bar pinned to the block start,
// visually not product chrome, with a standing label naming it as a demo mechanism that does not
// exist in a real deployment. Distinction comes from ground and edge — NOT the hatch, which
// color.md rule 5 reserves for the truth chip alone.
//
// It appears on every prototype surface, not only SH-01, because the honesty has to travel with
// the walkthrough: a reviewer who enters the employer's home from the actor switch must still be
// able to see that the actor switch is scaffolding.
//
// `detail` states what the demo session actually is, where it is stated. It is the plainest
// available description of the mechanism in `session.tsx` and it deliberately claims nothing
// about accounts, sign-in or persistence.

export function DemoBar({ detail }: { detail?: string }) {
  const { session, restored } = useDemoSession();

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
        {/* Rendered only after the session is restored, so the server and first client render
            agree and nothing claims an actor before the tab's state has been read. */}
        {restored && session.activeActor !== null ? (
          <Link className={`type-detail ${styles.demoBarLink}`} href="/demo">
            تغییر نقش
          </Link>
        ) : null}
        <Link className={`type-detail ${styles.demoBarLink}`} href="/truth">
          دفتر شفافیت
        </Link>
      </span>
    </div>
  );
}
