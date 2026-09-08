// Renders the token layer to a CSS custom-property sheet. Pure function so it is testable
// (render-css.test.ts asserts logical-only output); build-css.ts writes its result to disk.
// Only CSS logical properties appear here (ADR-0005).

import { tokens, DENSITY, TYPE_ROLES } from './tokens';

export function renderCss(): string {
  const lines: string[] = [];
  const push = (s = '') => lines.push(s);

  push('/* GENERATED from packages/tokens/src/*.ts by build-css.ts. Do not edit by hand. */');
  push('/* Canonical values: docs/design/{tokens,typography,color,foundations}.md */');
  push();
  push(':root {');

  push(`  --color-surface-canvas: ${tokens.color.surface.canvas};`);
  push(`  --color-surface-raised: ${tokens.color.surface.raised};`);
  push(`  --color-surface-recessed: ${tokens.color.surface.recessed};`);
  push(`  --color-fg-default: ${tokens.color.fg.default};`);
  push(`  --color-fg-muted: ${tokens.color.fg.muted};`);
  push(`  --color-fg-accent: ${tokens.color.fg.accent};`);
  push(`  --color-fg-on-accent: ${tokens.color.fg.onAccent};`);
  push(`  --color-border-hairline: ${tokens.color.border.hairline};`);
  push(`  --color-border-emphasis: ${tokens.color.border.emphasis};`);
  push(`  --color-border-focus: ${tokens.color.border.focus};`);

  for (const [role, c] of Object.entries(tokens.color.state)) {
    push(`  --color-state-${role}-fg: ${c.fg};`);
    push(`  --color-state-${role}-bg: ${c.bg};`);
    push(`  --color-state-${role}-border: ${c.border};`);
  }

  push(`  --type-family-text: ${tokens.type.family.text};`);
  push(`  --type-family-mono: ${tokens.type.family.mono};`);

  for (const role of TYPE_ROLES) {
    const t = tokens.type.role[role];
    push(`  --type-${role}-size: ${t.sizeCompact};`);
    push(`  --type-${role}-line-height: ${t.lineHeight};`);
    push(`  --type-${role}-weight: ${String(t.weight)};`);
    push(`  --type-${role}-tracking: ${t.tracking};`);
  }

  push(`  --space-1: ${tokens.space[1]};`);
  push(`  --space-2: ${tokens.space[2]};`);
  push(`  --space-3: ${tokens.space[3]};`);
  push(`  --space-4: ${tokens.space[4]};`);
  push(`  --space-5: ${tokens.space[5]};`);
  push(`  --space-6: ${tokens.space[6]};`);
  push(`  --space-7: ${tokens.space[7]};`);
  push(`  --space-gutter: ${DENSITY.worker.gutter};`);
  push(`  --space-row: ${DENSITY.worker.row};`);
  push(`  --space-section: ${DENSITY.worker.section};`);

  push(`  --radius-none: ${tokens.radius.none};`);
  push(`  --radius-control: ${tokens.radius.control};`);
  push(`  --radius-surface: ${tokens.radius.surface};`);
  push(`  --border-width-hairline: ${tokens.border.width.hairline};`);
  push(`  --border-width-emphasis: ${tokens.border.width.emphasis};`);
  push(`  --elevation-flat: ${tokens.elevation.flat};`);
  push(`  --elevation-overlay: ${tokens.elevation.overlay};`);

  push(`  --motion-duration-instant: ${tokens.motion.duration.instant};`);
  push(`  --motion-duration-short: ${tokens.motion.duration.short};`);
  push(`  --motion-duration-medium: ${tokens.motion.duration.medium};`);
  push(`  --motion-easing-standard: ${tokens.motion.easing.standard};`);
  push(`  --motion-easing-exit: ${tokens.motion.easing.exit};`);

  push(`  --target-comfortable: ${DENSITY.worker.comfortable};`);
  push(`  --target-minimum: ${tokens.target.minimum};`);
  push(`  --focus-ring-width: ${tokens.focus.ringWidth};`);
  push(`  --focus-ring-offset: ${tokens.focus.ringOffset};`);
  push(`  --focus-ring-inner: ${tokens.focus.inner};`);
  push(`  --focus-ring-outer: ${tokens.focus.outer};`);
  push('}');
  push();

  for (const [density, d] of Object.entries(DENSITY)) {
    push(`[data-density='${density}'] {`);
    push(`  --space-gutter: ${d.gutter};`);
    push(`  --space-row: ${d.row};`);
    push(`  --space-section: ${d.section};`);
    push(`  --target-comfortable: ${d.comfortable};`);
    push('}');
  }
  push();

  for (const role of TYPE_ROLES) {
    const t = tokens.type.role[role];
    const family = t.family === 'mono' ? 'var(--type-family-mono)' : 'var(--type-family-text)';
    push(`.type-${role} {`);
    push(`  font-family: ${family};`);
    if (t.sizeCompact !== 'inherit') push(`  font-size: var(--type-${role}-size);`);
    if (t.lineHeight !== 'inherit') push(`  line-height: var(--type-${role}-line-height);`);
    push(`  font-weight: var(--type-${role}-weight);`);
    push(`  letter-spacing: var(--type-${role}-tracking);`);
    push('  font-style: normal;');
    push('  text-transform: none;');
    if (t.tabular) push('  font-variant-numeric: tabular-nums;');
    push('}');
  }
  push();

  push(`@media (min-width: ${tokens.breakpoint.wide}) {`);
  for (const role of TYPE_ROLES) {
    const t = tokens.type.role[role];
    if (t.sizeWide !== 'inherit' && t.sizeWide !== t.sizeCompact) {
      push(`  .type-${role} { font-size: ${t.sizeWide}; }`);
    }
  }
  push('}');
  push();

  push('@media (prefers-reduced-motion: reduce) {');
  push('  :root {');
  push('    --motion-duration-instant: 0ms;');
  push('    --motion-duration-short: 0ms;');
  push('    --motion-duration-medium: 0ms;');
  push('  }');
  push('}');
  push();

  return lines.join('\n');
}
