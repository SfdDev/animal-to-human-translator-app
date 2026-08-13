import { describe, expect, it } from "vitest";
import { asConfidence, ruleFit } from "./fit.js";

describe("ruleFit", () => {
  it("слабая, если оценка ниже порога или правило помечено слабым", () => {
    expect(ruleFit(0.2)).toBe("weak");
    expect(ruleFit(0.9, true)).toBe("weak");
  });

  it("средняя в рабочем диапазоне", () => {
    expect(ruleFit(0.6)).toBe("medium");
  });

  it("высокая при сильной стыковке", () => {
    expect(ruleFit(0.8)).toBe("strong");
  });
});

describe("asConfidence", () => {
  it("приводит строку из базы к числу", () => {
    expect(asConfidence("0.6")).toBe(0.6);
  });

  it("не отдаёт NaN", () => {
    expect(asConfidence(undefined)).toBe(0);
    expect(asConfidence(Number.NaN)).toBe(0);
  });
});
