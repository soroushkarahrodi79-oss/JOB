import '@testing-library/jest-dom/vitest';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { StateMark } from './StateMark';

describe('StateMark', () => {
  it('renders label + mark + role (never colour alone)', () => {
    const { container, getByText } = render(<StateMark family="eligibility" state="Eligible" />);
    expect(getByText('واجد شرایط')).toBeInTheDocument(); // the label is real text
    expect(container.querySelector('svg')).toBeInTheDocument(); // the mark is a glyph
    expect(container.querySelector('[data-role="positive"]')).toBeInTheDocument();
  });

  it('renders NotEligible as neutral, never critical', () => {
    const { container } = render(<StateMark family="eligibility" state="NotEligible" />);
    expect(container.querySelector('[data-role="neutral"]')).toBeInTheDocument();
    expect(container.querySelector('[data-role="critical"]')).not.toBeInTheDocument();
  });

  it('resolves an actor-dependent role while keeping the label identical', () => {
    const onEmployer = render(
      <StateMark family="proof" state="ApprovedByNonResponse" viewer="actor" />,
    );
    const onWorker = render(
      <StateMark family="proof" state="ApprovedByNonResponse" viewer="counterparty" />,
    );
    expect(onEmployer.container.querySelector('[data-role="warning"]')).toBeInTheDocument();
    expect(onWorker.container.querySelector('[data-role="neutral"]')).toBeInTheDocument();
    expect(onEmployer.container).toHaveTextContent('بدون پاسخ کارفرما تأیید شد');
    expect(onWorker.container).toHaveTextContent('بدون پاسخ کارفرما تأیید شد');
  });

  it('renders nothing for a deliberately non-rendered state', () => {
    const { container } = render(<StateMark family="preferredCrew" state="Removed" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('carries the required annotation on a declined offer', () => {
    const { getByText } = render(<StateMark family="engagement" state="Declined" />);
    expect(getByText('رد کردن پیشنهاد نشانهٔ بی‌اعتمادی نیست')).toBeInTheDocument();
  });

  it('throws rather than invent copy for a prose-only payment state', () => {
    expect(() => render(<StateMark family="payment" state="SettlementReported" />)).toThrow();
  });
});
