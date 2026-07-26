import { describe, expect, it } from "vitest";
import { money } from "./money";

describe("money", () => {
  it("formats whole numbers with two decimals", () => {
    expect(money(6)).toBe("$6.00");
  });

  it("formats fractional prices", () => {
    expect(money(17.5)).toBe("$17.50");
  });

  it("formats zero", () => {
    expect(money(0)).toBe("$0.00");
  });

  it("truncates rather than rounds when the binary value falls short", () => {
    // 6.005 is stored just below the true value, so toFixed(2) yields 6.00.
    // The original implementation behaves identically — this is a documented
    // behaviour of the port, not a bug to correct.
    expect(money(6.005)).toBe("$6.00");
  });
});
