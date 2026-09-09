import { describe, expect, it } from 'vitest';
import { consumeArrivalCode } from './proof';

describe('arrival proof', () => {
  const code = { value: 'DEMO-1234', expiresAt: '2026-09-02T10:00:00Z', used: false };
  it('accepts a valid code once and rejects a replay', () => {
    const consumed = consumeArrivalCode(code, 'DEMO-1234', '2026-09-02T09:00:00Z');
    expect(consumed.used).toBe(true);
    expect(() => consumeArrivalCode(consumed, 'DEMO-1234', '2026-09-02T09:01:00Z')).toThrow(
      'single-use',
    );
  });
  it('rejects an invalid code', () => {
    expect(() => consumeArrivalCode(code, 'wrong', '2026-09-02T09:00:00Z')).toThrow(
      'does not match',
    );
  });
});
