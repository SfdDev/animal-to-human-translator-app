import { describe, expect, it } from "vitest";
import { isSpeciesId, SPECIES_IDS, TRANSLATE_PATH } from "./species";

describe("isSpeciesId", () => {
  it("принимает три вида", () => {
    expect(SPECIES_IDS.map((id) => isSpeciesId(id))).toEqual([true, true, true]);
  });

  it("отсекает пустое и неизвестное", () => {
    expect(isSpeciesId("")).toBe(false);
    expect(isSpeciesId("fox")).toBe(false);
  });

  it("держит путь перевода", () => {
    expect(TRANSLATE_PATH).toBe("/perevod");
  });
});
