'use client';

import Link from 'next/link';
import { DEMO_ACTORS, actorByKey } from './actors';
import { DemoBar } from './DemoBar';
import { useDemoSession } from './session';
import { Latin } from '../Latin';
import styles from './demo.module.css';

// SH-01 — Demo Entry and Actor Switch (docs/product/screen-inventory.md).
//
// Actor switching is demo scaffolding, not a product feature (truth-matrix row 21), and the chrome
// has to say so without being told (docs/design/navigation.md).
//
// SCOPE OF "FUNCTIONAL" (row 21): the actor-SELECTION mechanism, plus navigation into the one
// actor home that exists. Choosing the employer sets the active actor and opens E-01, which this
// slice builds. W-01 and OPS-01 are not built: choosing the worker or operations sets the active
// actor and says plainly that its home is PLANNED, and renders no link to it. Demo reset is not
// built either. FUNCTIONAL carries no truth chip (color.md: FUNCTIONAL is unmarked); the honesty
// is the demo bar's standing label plus the PLANNED notice below.

const SESSION_DETAIL =
  'وضعیت این نمایش فقط در همین زبانهٔ مرورگر نگه داشته می‌شود و با بستن آن پاک می‌شود. چیزی ذخیره یا ارسال نمی‌شود.';

export default function DemoEntryPage() {
  const { session, restored, chooseActor } = useDemoSession();
  const active = restored && session.activeActor !== null ? actorByKey(session.activeActor) : null;

  return (
    // `data-session-restored` reports whether this tab's demo session has been read yet. See
    // EmployerChrome for why it exists.
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
          <h2 id="actors-heading" className="type-title">
            انتخاب نقش
          </h2>
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
                    {/* SH-01 is the one place internal identifiers are the working reference. */}
                    <span className="type-identifier" style={{ color: 'var(--color-fg-muted)' }}>
                      <Latin>{actor.reference}</Latin> · <Latin>{actor.persona}</Latin>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Selecting an actor sets the active actor. The employer's home is built and is a live
            destination; the other two state, honestly, that their home is not built and render no
            link to it. */}
        <section className={styles.section} aria-live="polite">
          {active === null ? (
            <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
              نقشی انتخاب نشده است.
            </p>
          ) : (
            <div className={styles.selection} data-testid="active-actor">
              <p className="type-body">
                نقش فعال: <span className="type-body-strong">{active.label}</span> (
                <span className="type-identifier">
                  <Latin>{active.reference}</Latin>
                </span>
                )
              </p>
              {active.homeHref === null ? (
                <p className="type-body" data-testid="home-planned">
                  خانهٔ این نقش، «{active.homeScreenLabel}» (<Latin>{active.homeScreenId}</Latin>)،
                  هنوز ساخته نشده است —{' '}
                  <span className="type-body-strong">
                    برنامه‌ریزی‌شده (<Latin>PLANNED</Latin>)
                  </span>
                  . تنها خانه‌ای که در این برش ساخته شده، خانهٔ کارفرما است.
                </p>
              ) : (
                <>
                  <p className="type-body" data-testid="home-built">
                    خانهٔ این نقش، «{active.homeScreenLabel}» (<Latin>{active.homeScreenId}</Latin>
                    )، ساخته شده است.
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
