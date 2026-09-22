// The three actors SH-01 switches between. This is demo scaffolding, not a product feature
// (docs/demo-truth-matrix.md row 21; docs/design/navigation.md "The demo bar — SH-01").
//
// The actor's home screen is named by its stable ID from docs/product/screen-inventory.md. Only
// E-01 is built, so only the employer carries a `homeHref`; W-01 and OPS-01 are marked PLANNED and
// SH-01 must not render a live link to either (color.md: "PLANNED — prefer absence over a dead
// affordance").
//
// SH-01 is "the one place internal identifiers appear outside operations, because it is the one
// place they are the working reference" (navigation.md). The identifiers below are synthetic demo
// references (docs/product/demo-scenarios.md; the personas are P1/P2/P3 in personas.md) — never a
// real person, registry, bank or phone identifier (CLAUDE.md hard rule 10).
//
// Identifier note: the canonical cast in docs/product/demo-dataset.md is named `WKR-01`, `EMP-01`,
// `OPP-01`. The GATE 3 generator emits `WKR-DEMO-01`, `EMP-DEMO-01`, `OPP-DEMO-01` to satisfy that
// document's generation rule 6 — "every entity carries a demo marker in its identifier". These are
// the same entities; the `-DEMO-` infix is the rule, not a second cast.

import type { ActorKey } from '@platform/application';

export interface DemoActor {
  /** Stable key for selection state and test ids. Matches the application layer's `ActorKey`. */
  readonly key: ActorKey;
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
  /** The built route to that home, or null while the screen is PLANNED. */
  readonly homeHref: string | null;
}

export const DEMO_ACTORS: readonly DemoActor[] = [
  {
    key: 'worker',
    label: 'کارگر',
    persona: 'P1',
    reference: 'WKR-DEMO-01',
    homeScreenId: 'W-01',
    homeScreenLabel: 'کار و فرصت‌ها',
    homeHref: null,
  },
  {
    key: 'employer',
    label: 'کارفرما',
    persona: 'P2',
    reference: 'EMP-DEMO-01',
    homeScreenId: 'E-01',
    homeScreenLabel: 'کارها',
    homeHref: '/employer',
  },
  {
    key: 'operations',
    label: 'عملیات',
    persona: 'P3',
    reference: 'OPS-DEMO',
    homeScreenId: 'OPS-01',
    homeScreenLabel: 'صف پرونده‌ها',
    homeHref: null,
  },
];

export function actorByKey(key: ActorKey): DemoActor {
  const actor = DEMO_ACTORS.find((candidate) => candidate.key === key);
  if (actor === undefined) throw new Error(`Unknown demo actor ${key}.`);
  return actor;
}
