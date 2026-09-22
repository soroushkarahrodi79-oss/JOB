// The three actors SH-01 switches between. This is demo scaffolding, not a product feature
// (docs/demo-truth-matrix.md row 21; docs/design/navigation.md "The demo bar — SH-01").
//
// The actor's home screen is named by its stable ID from docs/product/screen-inventory.md. Those
// homes (W-01, E-01, OPS-01) are NOT built in this slice, so each is marked `homeBuilt: false` and
// SH-01 must not render a live link to it — the only built destination is SH-02 (the Truth Ledger).
//
// SH-01 is "the one place internal identifiers appear outside operations, because it is the one
// place they are the working reference" (navigation.md). The identifiers below are synthetic demo
// references (docs/product/demo-scenarios.md; the personas are P1/P2/P3 in personas.md) — never a
// real person, registry, bank or phone identifier (CLAUDE.md hard rule 10).

export interface DemoActor {
  /** Stable key for selection state and test ids. */
  readonly key: 'worker' | 'employer' | 'operations';
  /** The actor's Persian name. */
  readonly label: string;
  /** The persona reference, per docs/product/personas.md. */
  readonly persona: 'P1' | 'P2' | 'P3';
  /** The working reference shown on the demo bar. Synthetic; never a real identifier. */
  readonly reference: string;
  /** The actor's home screen ID from the screen inventory. */
  readonly homeScreenId: 'W-01' | 'E-01' | 'OPS-01';
  /** The home screen's Persian name. */
  readonly homeScreenLabel: string;
  /** False until that home screen is built. It is out of this slice, so it is false for all three. */
  readonly homeBuilt: false;
}

export const DEMO_ACTORS: readonly DemoActor[] = [
  {
    key: 'worker',
    label: 'کارگر',
    persona: 'P1',
    reference: 'WKR-DEMO-01',
    homeScreenId: 'W-01',
    homeScreenLabel: 'کار و فرصت‌ها',
    homeBuilt: false,
  },
  {
    key: 'employer',
    label: 'کارفرما',
    persona: 'P2',
    reference: 'EMP-DEMO-01',
    homeScreenId: 'E-01',
    homeScreenLabel: 'خانهٔ کارفرما',
    homeBuilt: false,
  },
  {
    key: 'operations',
    label: 'عملیات',
    persona: 'P3',
    reference: 'OPS-DEMO',
    homeScreenId: 'OPS-01',
    homeScreenLabel: 'صف پرونده‌ها',
    homeBuilt: false,
  },
];
