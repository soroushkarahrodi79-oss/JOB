// The three actors SH-01 switches between. This is demo scaffolding, not authentication
// (docs/demo-truth-matrix.md row 21; docs/design/navigation.md "The demo bar — SH-01").
//
// Only W-01 and E-01 are built homes; OPS-01 remains PLANNED. Internal IDs here are synthetic
// demo references, never real people, registry, bank, or telephone identifiers.
// The GATE 3 generator adds the -DEMO- infix to canonical cast identifiers.

import type { ActorKey } from '@platform/application';

export interface DemoActor {
  /** Stable key for selection state and test ids. Matches application ActorKey. */
  readonly key: ActorKey;
  readonly label: string;
  readonly persona: 'P1' | 'P2' | 'P3';
  readonly reference: string;
  readonly homeScreenId: 'W-01' | 'E-01' | 'OPS-01';
  readonly homeScreenLabel: string;
  /** The built route to this actor's home, or null when still PLANNED. */
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
    homeHref: '/worker',
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
