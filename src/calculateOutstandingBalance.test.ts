import { describe, expect, it } from "vitest";
import { calculateOutstandingBalance } from "./calculateOutstandingBalance";

describe("calculateOutstandingBalance", () => {
  it("returns a negative balance for an overpaid pupil", () => {
    // D = 2 => total fee = 45000 + (2 * 5000) = 55000
    // payments total = 60000, so outstanding = 55000 - 60000 = -5000
    const result = calculateOutstandingBalance(2, [30000, 30000]);
    expect(result).toBe(-5000);
  });

  it("returns zero for an exact payment", () => {
    // D = 1 => total fee = 45000 + (1 * 5000) = 50000
    // payments total = 50000, so outstanding = 0
    const result = calculateOutstandingBalance(1, [20000, 15000, 15000]);
    expect(result).toBe(0);
  });

  it("returns the full fee for an empty list of payments", () => {
    // D = 3 => total fee = 45000 + (3 * 5000) = 60000
    // payments total = 0, so outstanding = 60000
    const result = calculateOutstandingBalance(3, []);
    expect(result).toBe(60000);
  });
});
