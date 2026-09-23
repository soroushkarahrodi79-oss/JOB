'use client';

import Link from 'next/link';
import { DEMO_ACTORS, actorByKey } from './actors';
import { DemoBar } from './DemoBar';
import { useDemoSession } from './session';
import { Latin } from '../Latin';
import styles from './demo.module.css';

// SH-01 is actor selection for ONE demo session, never sign-in. W-01 and E-01 are now built
// destinations; OPS-01 still renders PLANNED with no dead link.
const SESSION_DETAIL =
  'وضعیت این نمایش فقط در همین زبانهٔ مرورگر نگه داشته می‌شود و با بستن آن پاک می‌شود. چیزی ذخیره یا ارسال نمی‌شود.';

export default function DemoEntryPage() {
  const { session, restored, chooseActor } = useDemoSession();
  const active = restored && session.activeActor !== null ? actorByKey(session.activeActor) : null;

  return (
    <div className={styles.shell} data-session-restored={restored ? 'true' : 'false'}>
      <DemoBar detail={SESSION_DETAIL} />
      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className="type-display">ورود به نمایش و جابه‌جایی نقش</h1>
          <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
            یک جهانِ کاری که از سه سو دیده می‌شود. انتخاب کنید از کدام روایت و در نقش چه کسی وارد
            شوید. داده‌های زیربنایی با جابه‌جایی نقش تغییر نمی‌کند.
          </p>
          <p className="type-body" data-testid="not-authentication">
            این ورود به حساب کاربری نیست. هیچ نام کاربری، رمز یا کد تأییدی در کار نیست؛ فقط انتخاب
            می‌کنید صفحه‌ها را از دید چه کسی ببینید.
          </p>
        </header>
        <section className={styles.section} aria-labelledby="actors-heading">
          <h2 id="actors-heading" className="type-title">انتخاب نقش</h2>
          <ul className={styles.actorList}>
            {DEMO_ACTORS.map((actor) => {
              const selected = active?.key === actor.key;
              return (
                <li key={actor.key}>
                  <button
                    type="button"
                    className={styles.actor}
                    aria-pressed={selected}
                    data-testid={`actor-${actor.key}`}
                    onClick={() => {
                      chooseActor(actor.key);
                    }}
                  >
                    <span className="type-body-strong">{actor.label}</span>
                    <span className="type-identifier" style={{ color: 'var(--color-fg-muted)' }}>
                      <Latin>{actor.reference}</Latin> · <Latin>{actor.persona}</Latin>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
        <section className={styles.section} aria-live="polite">
          {active === null ? (
            <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>نقشی انتخاب نشده است.</p>
          ) : (
            <div className={styles.selection} data-testid="active-actor">
              <p className="type-body">
                نقش فعال: <span className="type-body-strong">{active.label}</span> (
                <span className="type-identifier"><Latin>{active.reference}</Latin></span>)
              </p>
              {active.homeHref === null ? (
                <p className="type-body" data-testid="home-planned">
                  خانهٔ این نقش، «{active.homeScreenLabel}» (<Latin>{active.homeScreenId}</Latin>)،
                  هنوز ساخته نشده است — <span className="type-body-strong">برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)</span>.
                  خانه‌های کارگر و کارفرما ساخته شده‌اند؛ خانهٔ عملیات هنوز ساخته نشده است.
                </p>
              ) : (
                <>
                  <p className="type-body" data-testid="home-built">
                    خانهٔ این نقش، «{active.homeScreenLabel}» (<Latin>{active.homeScreenId}</Latin>)، ساخته شده است.
                  </p>
                  <Link
                    className={`type-body-strong ${styles.primaryLink}`}
                    href={active.homeHref}
                    data-testid="go-home"
                  >
                    رفتن به {active.homeScreenLabel}
                  </Link>
                </>
              )}
              <Link className={`type-detail ${styles.secondaryLink}`} href="/truth">
                رفتن به دفتر شفافیت
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
