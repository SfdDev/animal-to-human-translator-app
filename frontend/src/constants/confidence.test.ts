import { describe, expect, it } from "vitest";
import { confidenceLabel, confidencePercent } from "./confidence";

describe("confidencePercent", () => {
  it("переводит долю в проценты", () => {
    expect(confidencePercent(0.32)).toBe(32);
    expect(confidencePercent(0)).toBe(0);
    expect(confidencePercent(1)).toBe(100);
    expect(confidencePercent("0.6")).toBe(60);
  });

  it("не показывает NaN, если числа нет", () => {
    expect(confidencePercent(undefined)).toBe(0);
    expect(confidencePercent(Number.NaN)).toBe(0);
    expect(confidenceLabel(undefined)).toBe("Уверенность 0%");
  });
});

describe("confidenceLabel", () => {
  it("пишет «Уверенность N%»", () => {
    expect(confidenceLabel(0.6)).toBe("Уверенность 60%");
  });
});
