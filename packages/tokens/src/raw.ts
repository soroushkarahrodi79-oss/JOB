// Raw values — hex, px, ms. tokens.md: "Held in one file, referenced by nothing but the token
// layer. Not exported." Nothing outside this package's token layer may read these; components
// consume semantic tokens only (token rule 1). This module is intentionally not re-exported by
// index.ts.
//
// Colour rationale is in color.md; the numbers here realise it. Warm off-white ground (never cool
// grey), near-black warm ink, one deep-teal accent, and semantic role hues. Contrast is verified
// in contrast.test.ts against the floors in color.md (body/state fg >= 7:1, meaningful non-text
// >= 3:1). If a value below is edited, that test is the gate.

export const raw = {
  // Ground — warm off-white paper, three surface levels (color.md "The ground").
  paperCanvas: '#faf8f3',
  paperRaised: '#ffffff',
  paperRecessed: '#efece3',

  // Brand — two values only (color.md "Brand"). Ink dominates; accent is nearly absent.
  ink: '#20242b',
  inkMuted: '#494d55',
  accent: '#0b5350',
  onAccent: '#faf8f3',

  // Structural borders. Hairline carries meaning (separates evidence) so it clears 3:1.
  borderHairline: '#8b8577',
  borderEmphasis: '#20242b',
  borderFocusInner: '#0b5350',
  borderFocusOuter: '#faf8f3',

  // Semantic role hues — each fg/bg/border. Defined by meaning, not hue (color.md).
  // verification and truth are ink and take no colour tokens (they reuse ink).
  neutralFg: '#3a3e46',
  neutralBg: '#eeeae1',
  neutralBorder: '#8b8577',

  infoFg: '#1e3d5c',
  infoBg: '#e6ebf2',
  infoBorder: '#5a7799',

  positiveFg: '#1b4f2f',
  positiveBg: '#e3ede6',
  positiveBorder: '#4f8262',

  attentionFg: '#66470c',
  attentionBg: '#f5ecd3',
  attentionBorder: '#9a7a2c',

  warningFg: '#71331d',
  warningBg: '#f3e2d9',
  warningBorder: '#a5674a',

  criticalFg: '#791d1d',
  criticalBg: '#f3dcda',
  criticalBorder: '#a85652',

  // Spacing — 4px base, seven steps (foundations.md). Seven, not twelve.
  space1: '4px',
  space2: '8px',
  space3: '12px',
  space4: '16px',
  space5: '24px',
  space6: '32px',
  space7: '48px',

  // Radius — three values (foundations.md). Records are not cards: evidence rows use none.
  radiusNone: '0',
  radiusControl: '6px',
  radiusSurface: '10px',

  // Border widths.
  borderWidthHairline: '1px',
  borderWidthEmphasis: '2px',

  // Motion — three durations, and one of them is zero (foundations.md).
  durationInstant: '0ms',
  durationShort: '120ms',
  durationMedium: '200ms',
  easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  easingExit: 'cubic-bezier(0.4, 0, 1, 1)',

  // Breakpoints — named for the reading task (foundations.md responsive strategy).
  breakpointCompact: '320px',
  breakpointRegular: '640px',
  breakpointWide: '1024px',

  // Touch targets (foundations.md). comfortable rebinds per density; minimum is the WCAG floor.
  targetComfortable: '44px',
  targetComfortablePointer: '32px',
  targetMinimum: '24px',

  // Focus (foundations.md "Focus and keyboard").
  focusRingWidth: '2px',
  focusRingOffset: '2px',

  // Type families. The text face is D19 (Vazirmatn, human-authorised for this gate); the fallback
  // stack is typography.md's and must not end at a Latin-only face.
  familyText: "'Vazirmatn', Tahoma, 'Segoe UI', system-ui, sans-serif",
  familyMono: "'Vazirmatn Code', ui-monospace, 'Cascadia Mono', 'Consolas', monospace",
} as const;

export type RawTokens = typeof raw;
