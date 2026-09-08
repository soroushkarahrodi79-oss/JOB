// The semantic token layer — the whole public API of the design system (tokens.md).
// Two layers, not three: this file maps raw values to intent. Components consume these names
// and never a raw value (token rule 1), which is what lets a theme be an alternative binding.
//
// Naming is `group.role[.variant][.state]`, intent not appearance, logical direction only.

import { raw } from './raw';

export const SEMANTIC_ROLES = [
  'neutral',
  'info',
  'positive',
  'attention',
  'warning',
  'critical',
] as const;
export type SemanticRole = (typeof SEMANTIC_ROLES)[number];

export const TYPE_ROLES = [
  'display',
  'title',
  'subtitle',
  'body',
  'body-strong',
  'detail',
  'label',
  'numeric',
  'amount',
  'identifier',
  'code',
] as const;
export type TypeRoleName = (typeof TYPE_ROLES)[number];

export interface RoleColor {
  readonly fg: string;
  readonly bg: string;
  readonly border: string;
}

export interface TypeRole {
  readonly family: 'text' | 'mono';
  readonly sizeCompact: string;
  readonly sizeWide: string;
  readonly lineHeight: string;
  readonly weight: number;
  readonly tracking: string;
  readonly tabular: boolean;
}

export const tokens = {
  color: {
    surface: {
      canvas: raw.paperCanvas,
      raised: raw.paperRaised,
      recessed: raw.paperRecessed,
    },
    fg: {
      default: raw.ink,
      muted: raw.inkMuted,
      accent: raw.accent,
      onAccent: raw.onAccent,
    },
    border: {
      hairline: raw.borderHairline,
      emphasis: raw.borderEmphasis,
      focus: raw.borderFocusInner,
    },
    state: {
      neutral: { fg: raw.neutralFg, bg: raw.neutralBg, border: raw.neutralBorder },
      info: { fg: raw.infoFg, bg: raw.infoBg, border: raw.infoBorder },
      positive: { fg: raw.positiveFg, bg: raw.positiveBg, border: raw.positiveBorder },
      attention: { fg: raw.attentionFg, bg: raw.attentionBg, border: raw.attentionBorder },
      warning: { fg: raw.warningFg, bg: raw.warningBg, border: raw.warningBorder },
      critical: { fg: raw.criticalFg, bg: raw.criticalBg, border: raw.criticalBorder },
    } satisfies Record<SemanticRole, RoleColor>,
  },

  type: {
    family: { text: raw.familyText, mono: raw.familyMono },
    role: {
      display: {
        family: 'text',
        sizeCompact: '28px',
        sizeWide: '32px',
        lineHeight: '1.35',
        weight: 700,
        tracking: '0',
        tabular: false,
      },
      title: {
        family: 'text',
        sizeCompact: '21px',
        sizeWide: '22px',
        lineHeight: '1.45',
        weight: 700,
        tracking: '0',
        tabular: false,
      },
      subtitle: {
        family: 'text',
        sizeCompact: '18px',
        sizeWide: '18px',
        lineHeight: '1.55',
        weight: 600,
        tracking: '0',
        tabular: false,
      },
      body: {
        family: 'text',
        sizeCompact: '17px',
        sizeWide: '17px',
        lineHeight: '1.75',
        weight: 400,
        tracking: '0',
        tabular: false,
      },
      'body-strong': {
        family: 'text',
        sizeCompact: '17px',
        sizeWide: '17px',
        lineHeight: '1.75',
        weight: 600,
        tracking: '0',
        tabular: false,
      },
      detail: {
        family: 'text',
        sizeCompact: '15px',
        sizeWide: '15px',
        lineHeight: '1.7',
        weight: 400,
        tracking: '0',
        tabular: false,
      },
      label: {
        family: 'text',
        sizeCompact: '15px',
        sizeWide: '15px',
        lineHeight: '1.5',
        weight: 600,
        tracking: '0',
        tabular: false,
      },
      numeric: {
        family: 'text',
        sizeCompact: 'inherit',
        sizeWide: 'inherit',
        lineHeight: 'inherit',
        weight: 600,
        tracking: '0',
        tabular: true,
      },
      amount: {
        family: 'text',
        sizeCompact: '24px',
        sizeWide: '24px',
        lineHeight: '1.3',
        weight: 700,
        tracking: '0',
        tabular: true,
      },
      identifier: {
        family: 'mono',
        sizeCompact: '15px',
        sizeWide: '15px',
        lineHeight: '1.5',
        weight: 500,
        tracking: '0.01em',
        tabular: true,
      },
      code: {
        family: 'mono',
        sizeCompact: '28px',
        sizeWide: '28px',
        lineHeight: '1.2',
        weight: 600,
        tracking: '0.12em',
        tabular: true,
      },
    } satisfies Record<TypeRoleName, TypeRole>,
  },

  space: {
    1: raw.space1,
    2: raw.space2,
    3: raw.space3,
    4: raw.space4,
    5: raw.space5,
    6: raw.space6,
    7: raw.space7,
    // Semantic aliases — rebindable per density (see DENSITY below). Not a `density` flag a
    // component branches on (tokens.md "Density is a token set, not a token").
    gutter: raw.space4,
    row: raw.space4,
    section: raw.space6,
  },

  radius: {
    none: raw.radiusNone,
    control: raw.radiusControl,
    surface: raw.radiusSurface,
  },

  border: {
    width: { hairline: raw.borderWidthHairline, emphasis: raw.borderWidthEmphasis },
  },

  elevation: {
    flat: 'none',
    overlay: '0 8px 24px -8px rgba(32, 36, 43, 0.28)',
  },

  motion: {
    duration: {
      instant: raw.durationInstant,
      short: raw.durationShort,
      medium: raw.durationMedium,
    },
    easing: { standard: raw.easingStandard, exit: raw.easingExit },
  },

  breakpoint: {
    compact: raw.breakpointCompact,
    regular: raw.breakpointRegular,
    wide: raw.breakpointWide,
  },

  target: {
    comfortable: raw.targetComfortable,
    minimum: raw.targetMinimum,
  },

  focus: {
    ringWidth: raw.focusRingWidth,
    ringOffset: raw.focusRingOffset,
    inner: raw.borderFocusInner,
    outer: raw.borderFocusOuter,
  },
} as const;

// Per-actor density is a rebinding of three space aliases and the comfortable target — one
// component that consumes `space.row` and gets a different value in a different context, never
// two components (tokens.md "Density is a token set, not a token").
export const DENSITY = {
  worker: {
    gutter: raw.space4,
    row: raw.space4,
    section: raw.space6,
    comfortable: raw.targetComfortable,
  },
  employer: {
    gutter: raw.space3,
    row: raw.space3,
    section: raw.space5,
    comfortable: raw.targetComfortablePointer,
  },
  operations: {
    gutter: raw.space3,
    row: raw.space3,
    section: raw.space5,
    comfortable: raw.targetComfortablePointer,
  },
} as const;
export type Density = keyof typeof DENSITY;

export type Tokens = typeof tokens;
