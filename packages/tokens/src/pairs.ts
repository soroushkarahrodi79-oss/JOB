// Verified contrast pairs. A component composes a PAIR, never two independent colour tokens, so
// that "contrast is a token constraint, not a review finding" is enforceable rather than
// aspirational (design-system.md token rule 6; color.md "Contrast").
//
// Floors are color.md's, which are stricter than WCAG AA on purpose (persona P1 reads on a poor
// screen outdoors): text >= 7:1, meaningful non-text (marks, rules, control borders) >= 3:1.

import { tokens, SEMANTIC_ROLES } from './tokens';

export type PairKind = 'text' | 'nontext';

export interface ContrastPair {
  readonly id: string;
  readonly fg: string;
  readonly bg: string;
  readonly kind: PairKind;
}

export const FLOOR: Record<PairKind, number> = { text: 7, nontext: 3 };

const surfaces = {
  canvas: tokens.color.surface.canvas,
  raised: tokens.color.surface.raised,
  recessed: tokens.color.surface.recessed,
};

const pairs: ContrastPair[] = [];

// Body and muted text on every surface.
for (const [name, bg] of Object.entries(surfaces)) {
  pairs.push({ id: `fg.default/${name}`, fg: tokens.color.fg.default, bg, kind: 'text' });
  pairs.push({ id: `fg.muted/${name}`, fg: tokens.color.fg.muted, bg, kind: 'text' });
}

// Accent as link text sits on canvas and raised.
pairs.push({
  id: 'fg.accent/canvas',
  fg: tokens.color.fg.accent,
  bg: surfaces.canvas,
  kind: 'text',
});
pairs.push({
  id: 'fg.accent/raised',
  fg: tokens.color.fg.accent,
  bg: surfaces.raised,
  kind: 'text',
});

// Text on an accent fill, on the rare occasion one exists.
pairs.push({
  id: 'fg.onAccent/accent',
  fg: tokens.color.fg.onAccent,
  bg: tokens.color.fg.accent,
  kind: 'text',
});

// Each semantic role: its foreground on its own tinted background.
for (const role of SEMANTIC_ROLES) {
  const c = tokens.color.state[role];
  pairs.push({ id: `state.${role}.fg/bg`, fg: c.fg, bg: c.bg, kind: 'text' });
}

// Meaningful non-text: structural hairline and each role border on the canvas.
pairs.push({
  id: 'border.hairline/canvas',
  fg: tokens.color.border.hairline,
  bg: surfaces.canvas,
  kind: 'nontext',
});
for (const role of SEMANTIC_ROLES) {
  pairs.push({
    id: `state.${role}.border/canvas`,
    fg: tokens.color.state[role].border,
    bg: surfaces.canvas,
    kind: 'nontext',
  });
}

export const contrastPairs: readonly ContrastPair[] = pairs;
