/**
 * Calculates a pupil's outstanding balance in XOF.
 */
export function computeOutstandingBalance(termlyFee: number, payments: number[]): number {
  const totalPaid = payments.reduce((sum, current) => sum + current, 0);
  return termlyFee - totalPaid;
}
