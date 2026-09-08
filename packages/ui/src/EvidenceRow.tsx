import type { ReactNode } from 'react';
import { PROVENANCE_LEVELS, type ProvenanceLevel, type TruthLevel } from '@platform/domain';
import { StateMark } from './StateMark';
import { TruthChip } from './TruthChip';
import styles from './EvidenceRow.module.css';

export interface EvidenceRowProps {
  /** The invariant: every displayed claim states where it came from (ADR-0012 decision 1). */
  provenance: ProvenanceLevel;
  /** Source and date — REQUIRED for a verified claim ("verified without a source and a date is
   *  prohibited", state-vocabulary.md). */
  detail?: ReactNode;
  /** The truth level of the capability behind the claim; renders the SIMULATED/MOCK chip. */
  truth?: TruthLevel;
  truthHref?: string;
  /** The claim itself. */
  children: ReactNode;
}

const PROVENANCE = new Set<string>(PROVENANCE_LEVELS);

/**
 * A single evidence row: a provenance margin plus the claim. Provenance is required by the type;
 * an invalid or (for a verified claim) unsupported provenance throws during development, which is
 * how "a claim that renders without its provenance treatment is detectable" (ADR-0012).
 */
export function EvidenceRow({ provenance, detail, truth, truthHref, children }: EvidenceRowProps) {
  if (!PROVENANCE.has(provenance)) {
    throw new Error(
      `EvidenceRow: unknown provenance "${provenance}". A claim must state its provenance (ADR-0012).`,
    );
  }
  if (provenance === 'VerifiedSimulated') {
    // state-vocabulary.md: a verified claim is always accompanied by the SIMULATED chip, the
    // source, and the date. Enforced so the badge-instead-of-evidence failure cannot ship.
    if (truth !== 'SIMULATED') {
      throw new Error('EvidenceRow: a verified claim must carry the SIMULATED truth chip.');
    }
    if (detail === undefined) {
      throw new Error('EvidenceRow: a verified claim must state its source and date.');
    }
  }

  return (
    <div className={styles.row} role="group" data-provenance={provenance}>
      <div className={styles.margin}>
        <StateMark family="provenance" state={provenance} form="marker" />
        {detail !== undefined ? <span className="type-detail">{detail}</span> : null}
        {truth !== undefined && truthHref !== undefined ? (
          <TruthChip level={truth} href={truthHref} />
        ) : null}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
