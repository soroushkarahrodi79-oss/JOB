import type { ReactNode } from 'react';
import type { MarkId } from './vocabulary';

// Monoline glyphs on a shared optical grid (foundations.md "Iconography"). Marks are glyphs, so
// they survive forced-colors substitution (color.md); fill is used only where a mark's fill IS
// its meaning (the provenance marks). Every mark is aria-hidden — the label carries the meaning,
// never the glyph alone (foundations.md; state-vocabulary.md rule 6). Final artwork is GATE 4
// iconography; these are systematic placeholders keyed by family/role, not per-status designs.

const S = 16;

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${String(S)} ${String(S)}`}
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

const glyphs: Record<MarkId, ReactNode> = {
  'check-filled': <path d="M3.5 8.5l3 3 6-6.5" />,
  'check-half': (
    <>
      <path d="M3.5 8.5l3 3 6-6.5" />
      <path d="M8 13V3" strokeDasharray="1.6 1.8" />
    </>
  ),
  rule: <path d="M3 8h10" />,
  'window-filled': (
    <>
      <rect x="3" y="4" width="10" height="9" rx="1" />
      <path d="M3 7h10" />
      <rect x="5" y="9" width="6" height="2.5" fill="currentColor" stroke="none" />
    </>
  ),
  'window-open': (
    <>
      <rect x="3" y="4" width="10" height="9" rx="1" />
      <path d="M3 7h10" />
    </>
  ),
  'provenance-self': <circle cx="8" cy="8" r="4.5" />,
  'provenance-verified': (
    <>
      <circle cx="8" cy="8" r="5" fill="currentColor" stroke="none" />
      <path d="M5.5 8.2l1.8 1.8 3.2-3.6" stroke="var(--color-surface-canvas, #fff)" />
    </>
  ),
  'provenance-observed': (
    <rect x="3.5" y="6.5" width="9" height="3" rx="0.5" fill="currentColor" stroke="none" />
  ),
  'provenance-derived': (
    <>
      <path d="M6 3.5C4.5 3.5 4.5 8 3.5 8c1 0 1 4.5 2.5 4.5" />
      <path d="M10 3.5c1.5 0 1.5 4.5 2.5 4.5-1 0-1 4.5-2.5 4.5" />
    </>
  ),
  record: <path d="M4 8h8M4 5.5h8M4 10.5h5" />,
  waiting: (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <path d="M8 5v3.2l2 1.4" />
    </>
  ),
  alert: (
    <>
      <path d="M8 2.5l6 10.5H2z" />
      <path d="M8 6.5v3" />
      <circle cx="8" cy="11" r="0.4" fill="currentColor" />
    </>
  ),
  caveat: (
    <>
      <path d="M8 3l5.5 9.5h-11z" />
      <path d="M8 6.5v3" strokeDasharray="1.4 1.6" />
    </>
  ),
  dash: <path d="M4 8h8" strokeDasharray="2 2" />,
  case: (
    <>
      <path d="M2.5 6.5h11v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z" />
      <path d="M2.5 6.5l1.5-2.5h3l1 1.5" />
    </>
  ),
};

export function Mark({ id }: { id: MarkId }) {
  return <Svg>{glyphs[id]}</Svg>;
}
