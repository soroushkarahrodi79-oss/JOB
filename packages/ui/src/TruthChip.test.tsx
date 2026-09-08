import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { TruthChip } from './TruthChip';

describe('TruthChip', () => {
  it('renders nothing for FUNCTIONAL (the honest majority stays quiet)', () => {
    const { container } = render(<TruthChip level="FUNCTIONAL" href="#t" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing for PLANNED (not a control at all)', () => {
    const { container } = render(<TruthChip level="PLANNED" href="#t" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders SIMULATED as a link to the truth ledger, labelled in words', () => {
    const { getByRole } = render(<TruthChip level="SIMULATED" href="#truth-row-1" />);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '#truth-row-1');
    expect(link).toHaveTextContent('شبیه‌سازی‌شده');
    expect(link).toHaveAttribute('data-level', 'SIMULATED');
  });

  it('labels MOCK distinctly', () => {
    const { getByRole } = render(<TruthChip level="MOCK" href="#t" />);
    expect(getByRole('link')).toHaveTextContent('ساختگی');
  });
});
