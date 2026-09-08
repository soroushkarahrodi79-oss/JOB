import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { EvidenceRow } from './EvidenceRow';

describe('EvidenceRow (the Evidence Margin invariant)', () => {
  it('renders a claim with its provenance marker', () => {
    const { getByText, getByRole } = render(
      <EvidenceRow provenance="SelfDeclared">مهارت: آشپزی</EvidenceRow>,
    );
    expect(getByRole('group')).toHaveAttribute('data-provenance', 'SelfDeclared');
    expect(getByText('مهارت: آشپزی')).toBeInTheDocument();
    expect(getByText('خوداظهار')).toBeInTheDocument(); // provenance is present, in words
  });

  it('renders a verified claim with source, date and the SIMULATED chip', () => {
    const { getByText, getByRole } = render(
      <EvidenceRow
        provenance="VerifiedSimulated"
        truth="SIMULATED"
        truthHref="#truth"
        detail="سامانهٔ نمونه — ۱۴۰۴/۰۶/۱۷"
      >
        گواهی سلامت
      </EvidenceRow>,
    );
    expect(getByText('گواهی سلامت')).toBeInTheDocument();
    expect(getByText('سامانهٔ نمونه — ۱۴۰۴/۰۶/۱۷')).toBeInTheDocument();
    expect(getByRole('link')).toHaveTextContent('شبیه‌سازی‌شده');
  });

  it('refuses a verified claim without the SIMULATED chip (badge-instead-of-evidence)', () => {
    expect(() =>
      render(
        <EvidenceRow provenance="VerifiedSimulated" detail="x">
          گواهی
        </EvidenceRow>,
      ),
    ).toThrow();
  });

  it('refuses a verified claim without a source and date', () => {
    expect(() =>
      render(
        <EvidenceRow provenance="VerifiedSimulated" truth="SIMULATED">
          گواهی
        </EvidenceRow>,
      ),
    ).toThrow();
  });
});
