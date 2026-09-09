import { describe, expect, it } from 'vitest';
import { rial } from '@platform/domain';
import { SimulatedGeolocationAdapter, SimulatedPaymentAdapter } from './simulated';

describe('simulated adapters', () => {
  it('returns configured success and recoverable provider failure paths deterministically', async () => {
    const payment = new SimulatedPaymentAdapter([
      { ok: false, failure: { kind: 'Timeout', recoverable: true } },
      {
        ok: true,
        value: { reportedAt: '2026-09-02T00:00:00Z', source: 'SimulatedSettlementNetwork' },
      },
    ]);
    expect(await payment.settle({ paymentIntentId: 'PAY-DEMO-01', amount: rial(1) })).toMatchObject(
      { ok: false, failure: { kind: 'Timeout' } },
    );
    expect(await payment.settle({ paymentIntentId: 'PAY-DEMO-01', amount: rial(1) })).toMatchObject(
      { ok: true },
    );
  });

  it('models malformed provider data as an explicit failure', async () => {
    const geo = new SimulatedGeolocationAdapter({});
    expect(
      await geo.distanceBetween(
        { city: 'Tehran', neighbourhood: 'Demo-North' },
        { city: 'Tehran', neighbourhood: 'Demo-South' },
      ),
    ).toMatchObject({ ok: false, failure: { kind: 'MalformedResult' } });
  });

  it('does not collapse unavailable or rejected provider outcomes into success', async () => {
    const payment = new SimulatedPaymentAdapter([
      { ok: false, failure: { kind: 'Unavailable', recoverable: true } },
      { ok: false, failure: { kind: 'Rejected', recoverable: false, reason: 'synthetic refusal' } },
    ]);
    expect(await payment.settle({ paymentIntentId: 'PAY-DEMO-02', amount: rial(1) })).toMatchObject(
      {
        ok: false,
        failure: { kind: 'Unavailable' },
      },
    );
    expect(await payment.settle({ paymentIntentId: 'PAY-DEMO-02', amount: rial(1) })).toMatchObject(
      {
        ok: false,
        failure: { kind: 'Rejected' },
      },
    );
  });
});
