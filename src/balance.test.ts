import { computeOutstandingBalance } from './balance';

describe('computeOutstandingBalance', () => {
  const termlyFee = 55000; // 45,000 + (2 * 5,000) XOF

  test('handles exact payment', () => {
    expect(computeOutstandingBalance(termlyFee, [30000, 25000])).toBe(0);
  });

  test('handles overpayment', () => {
    expect(computeOutstandingBalance(termlyFee, [30000, 30000])).toBe(-5000);
  });

  test('handles empty payment list (no payments)', () => {
    expect(computeOutstandingBalance(termlyFee, [])).toBe(55000);
  });
});
