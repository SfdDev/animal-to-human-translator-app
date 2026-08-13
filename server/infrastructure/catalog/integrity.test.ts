import { describe, expect, it } from "vitest";
import { catalogIntegrityIssues } from "./integrity.js";

describe("catalogIntegrityIssues", () => {
  it("не находит битых ссылок в каталоге", () => {
    expect(catalogIntegrityIssues()).toEqual([]);
  });
});
