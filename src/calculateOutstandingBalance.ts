/**
 * Computes a pupil's outstanding balance.
 *
 * Total fee is calculated as: 45000 + (D * 5000) XOF
 * Outstanding balance = total fee - sum of payments.
 * A negative result indicates an overpayment (credit).
 *
 * @param D - The fee factor used to compute the total fee.
 * @param payments - A list of payment amounts (XOF).
 * @returns The outstanding balance in XOF.
 */
export function calculateOutstandingBalance(D: number, payments: number[]): number {
  const totalFee = 45000 + D * 5000;
  const totalPaid = payments.reduce((sum, amount) => sum + amount, 0);
  return totalFee - totalPaid;
}
