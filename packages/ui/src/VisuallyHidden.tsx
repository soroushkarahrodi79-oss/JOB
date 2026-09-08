import type { ReactNode } from 'react';
import styles from './VisuallyHidden.module.css';

/** Content available to assistive technology but not visually shown. */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className={styles.hidden}>{children}</span>;
}
