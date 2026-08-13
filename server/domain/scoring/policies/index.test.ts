import { describe, expect, it } from "vitest";
import { policyFor } from "./index.js";

describe("policyFor", () => {
  it("отдаёт политику кошки", () => {
    expect(policyFor("motivational_human").logic).toBe("motivational_human");
  });

  it("для неизвестной логики берёт запасную", () => {
    expect(policyFor("unknown").logic).toBe("default");
  });

  it("отдаёт политики собаки и курицы", () => {
    expect(policyFor("graded_context").skipWeakCatchAll).toBe(true);
    expect(policyFor("referential").skipWeakCatchAll).toBe(false);
  });
});
