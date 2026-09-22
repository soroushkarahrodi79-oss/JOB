'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DEMO_ACTORS, type DemoActor } from './actors';
import styles from './demo.module.css';

// SH-01 — Demo Entry and Actor Switch (docs/product/screen-inventory.md).
//
// Actor switching is demo scaffolding, not a product feature (truth-matrix row 21), and the chrome
// has to say so without being told (docs/design/navigation.md). Row 21 is FUNCTIONAL, so it carries
// no truth chip (color.md: FUNCTIONAL is unmarked); the honesty is carried by the demo bar's
// standing label instead.
//
// SLICE SCOPE: only SH-01 and SH-02 exist. The actor homes (W-01, E-01, OPS-01) are out of scope
// and remain PLANNED (truth matrix), so selecting an actor sets the active actor and states plainly
// that its home is not yet built — it never renders a live link to an unbuilt screen. The one built
// destination is SH-02, the Truth Ledger.

export default function DemoEntryPage() {
  const [active, setActive] = useState<DemoActor | null>(null);

  return (
    <div className={styles.shell}>
      {/* The demo bar (navigation.md "The demo bar — SH-01"): a distinct bar pinned to the block
          start, visually not product chrome, with a standing label naming it as a demo mechanism
          that does not exist in a real deployment. */}
      <div className={styles.demoBar} role="note" aria-label="نوار نمایش">
        <span className={`type-label ${styles.demoBarLabel}`}>
          نوار نمایش — سازوکار نمایشی است و در نسخهٔ واقعی محصول وجود ندارد.
        </span>
        <Link className={`type-detail ${styles.demoBarLink}`} href="/truth">
          دفتر شفافیت
        </Link>
      </div>

      <main className={styles.page}>
        <header className={styles.header}>
          <h1 className="type-display">ورود به نمایش و جابه‌جایی نقش</h1>
          <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
            یک جهانِ کاری که از سه سو دیده می‌شود. انتخاب کنید از کدام روایت و در نقش چه کسی وارد
            شوید. داده‌های زیربنایی با جابه‌جایی نقش تغییر نمی‌کند.
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
                      setActive(actor);
                    }}
                  >
                    <span className="type-body-strong">{actor.label}</span>
                    {/* SH-01 is the one place internal identifiers are the working reference. */}
                    <span className="type-identifier" style={{ color: 'var(--color-fg-muted)' }}>
                      {actor.reference} · {actor.persona}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Selecting an actor sets the active actor and states, honestly, that its home screen is
            not yet built. No live link to W-01/E-01/OPS-01 is rendered. */}
        <section className={styles.section} aria-live="polite">
          {active === null ? (
            <p className="type-body" style={{ color: 'var(--color-fg-muted)' }}>
              نقشی انتخاب نشده است.
            </p>
          ) : (
            <div className={styles.selection} data-testid="active-actor">
              <p className="type-body">
                نقش فعال: <span className="type-body-strong">{active.label}</span> (
                <span className="type-identifier">{active.reference}</span>)
              </p>
              <p className="type-body" data-testid="home-planned">
                خانهٔ این نقش، «{active.homeScreenLabel}» ({active.homeScreenId})، هنوز در این برش
                ساخته نشده است — <span className="type-body-strong">برنامه‌ریزی‌شده (PLANNED)</span>
                . تنها مقصد ساخته‌شده در این برش، دفتر شفافیت است.
              </p>
              <Link className={`type-body-strong ${styles.primaryLink}`} href="/truth">
                رفتن به دفتر شفافیت
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
