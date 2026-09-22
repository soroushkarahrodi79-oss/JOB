'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DemoBar } from '../demo/DemoBar';
import { useDemoSession } from '../demo/session';
import { Latin } from '../Latin';
import styles from './employer.module.css';

// The employer's navigation (navigation.md, "Employer"): a slim rail at the inline start at
// `wide` and `regular`, collapsing to a top bar at `compact`. Three destinations and one action —
// and no more, because "a navigation destination exists only if the screen inventory makes it an
// entry point".
//
// Two of the three destinations are not built. They render as named, non-interactive items marked
// PLANNED rather than as links: color.md's rule for PLANNED is "not rendered as a control at all —
// prefer absence over a dead affordance", and the screen inventory's own list is the reason they
// are named rather than silently dropped. A rail that quietly showed one destination would read as
// a product with one screen instead of a slice of a product with several.
//
// E-04, E-05, E-06, E-07 and E-09 are never in the chrome. Each is about a specific opportunity or
// engagement, and a candidate list with no opportunity is not a screen.

const SESSION_DETAIL =
  'ورود به نقش کارفرما احراز هویت نیست. وضعیت این نمایش فقط در همین زبانهٔ مرورگر نگه داشته می‌شود.';

interface RailItem {
  readonly label: string;
  readonly screenId: string;
  readonly href: string | null;
}

const DESTINATIONS: readonly RailItem[] = [
  { label: 'کارها', screenId: 'E-01', href: '/employer' },
  { label: 'نمایهٔ اعتماد', screenId: 'E-08', href: null },
  { label: 'پیام‌ها', screenId: 'SH-03', href: null },
];

export function EmployerChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { restored } = useDemoSession();

  return (
    // Employer density is a real difference, not a preference (foundations.md): tighter rows,
    // because persona P2 is comparing things and comparison needs adjacency.
    //
    // `data-session-restored` reports whether the demo session has been read from this tab's
    // storage yet. The server renders a fresh world and the client swaps in the tab's own, so
    // until it flips, what is on screen may not be this tab's state. It is the signal the E2E
    // suite waits on, rather than the suite guessing at a delay.
    <div
      className={styles.shell}
      data-density="employer"
      data-session-restored={restored ? 'true' : 'false'}
    >
      <DemoBar detail={SESSION_DETAIL} />

      <div className={styles.frame}>
        <nav className={styles.rail} aria-label="پیمایش کارفرما">
          <ul className={styles.railList}>
            {DESTINATIONS.map((item) =>
              item.href === null ? (
                <li key={item.screenId} className={styles.railPlanned}>
                  <span className="type-label">{item.label}</span>
                  <span className="type-detail" data-testid={`rail-planned-${item.screenId}`}>
                    ساخته نشده — برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)
                  </span>
                </li>
              ) : (
                <li key={item.screenId}>
                  <Link
                    className={`type-label ${styles.railLink}`}
                    href={item.href}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* An ACTION, not a destination (navigation.md). It is the employer's one reason to be
              here that does not start from a work item, so it is the most prominent control in
              the chrome. */}
          <Link
            className={`type-body-strong ${styles.railAction}`}
            href="/employer/opportunity/new"
            data-testid="rail-new-opportunity"
          >
            فرصت جدید
          </Link>
        </nav>

        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
