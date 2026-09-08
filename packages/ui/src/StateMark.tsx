import type { CSSProperties } from 'react';
import { Mark } from './marks';
import styles from './StateMark.module.css';
import {
  RENDERINGS,
  isNotRendered,
  resolveRole,
  type Family,
  type Form,
  type Rendering,
  type StateRole,
} from './vocabulary';

export interface StateMarkProps {
  family: Family;
  /** A state key within the family (e.g. 'Eligible'). Validated at runtime. */
  state: string;
  /** Whose record this appears on, for actor-dependent roles (state-vocabulary.md). */
  viewer?: 'actor' | 'counterparty';
  /** Override the family's default form. */
  form?: Form;
  /** Required for states the canon renders as prose rather than a label (payment). */
  label?: string;
  className?: string;
}

function roleVars(role: StateRole): CSSProperties {
  // verification and truth are ink — no hue, by construction (ADR-0012 decision 2).
  if (role === 'verification' || role === 'truth') {
    return {
      ['--_fg' as string]: 'var(--color-fg-default)',
      ['--_bg' as string]: 'transparent',
      ['--_border' as string]: 'var(--color-border-hairline)',
    } as CSSProperties;
  }
  return {
    ['--_fg' as string]: `var(--color-state-${role}-fg)`,
    ['--_bg' as string]: `var(--color-state-${role}-bg)`,
    ['--_border' as string]: `var(--color-state-${role}-border)`,
  } as CSSProperties;
}

const FORM_CLASS: Record<Form, string | undefined> = {
  inline: undefined,
  marker: styles.marker,
  chip: styles.chip,
  banner: styles.banner,
};

/**
 * The single state primitive (state-vocabulary.md "One component, three dimensions").
 * Always renders label + mark + role: colour is never the only carrier. Never truncates a
 * label; a `chip` wraps to two lines instead.
 */
export function StateMark({
  family,
  state,
  viewer = 'actor',
  form,
  label,
  className,
}: StateMarkProps) {
  const familyMap = RENDERINGS[family] as Record<string, Rendering>;
  const rendering = familyMap[state];

  if (rendering === undefined) {
    throw new Error(`StateMark: no rendering for ${family}.${state} (state-vocabulary.md).`);
  }
  if (isNotRendered(rendering)) {
    return null;
  }

  const text = label ?? rendering.label;
  if (text === null || text === undefined) {
    throw new Error(
      `StateMark: ${family}.${state} renders as party-dependent prose (${rendering.labelSource}); pass an explicit \`label\`.`,
    );
  }

  const role = resolveRole(rendering.role, viewer);
  const chosenForm = form ?? rendering.form;
  const classes = [styles.root, FORM_CLASS[chosenForm], className].filter(Boolean).join(' ');

  return (
    <span className={classes} style={roleVars(role)} data-role={role} data-form={chosenForm}>
      <Mark id={rendering.mark} />
      <span className="type-label">{text}</span>
      {rendering.annotation !== undefined ? (
        <span className={`type-detail ${styles.annotation}`}>{rendering.annotation}</span>
      ) : null}
    </span>
  );
}
