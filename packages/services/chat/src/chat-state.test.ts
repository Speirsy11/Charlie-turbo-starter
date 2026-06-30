import { describe, expect, it } from "vitest";

import { applyOperator } from "./chat-state";

describe("applyOperator", () => {
  it("adds, subtracts, multiplies and divides", () => {
    expect(applyOperator(2, "+", 3)).toBe(5);
    expect(applyOperator(7, "-", 4)).toBe(3);
    expect(applyOperator(6, "*", 7)).toBe(42);
    expect(applyOperator(9, "/", 3)).toBe(3);
  });

  it("returns NaN when dividing by zero", () => {
    expect(applyOperator(1, "/", 0)).toBeNaN();
  });
});
