import { beforeAll, describe, expect, it } from "vitest";
import { UnknownSpeciesError } from "./errors.js";
import { InterpretSignal } from "./interpret-signal.js";
import { requireSeededCatalog } from "../test/require-seeded-catalog.js";

describe("InterpretSignal на живом каталоге", () => {
  let useCase: InterpretSignal;

  beforeAll(async () => {
    useCase = new InterpretSignal(await requireSeededCatalog());
  });

  it("переводит мяу кошки правилом из базы", async () => {
    const result = await useCase.execute({ speciesId: "cat", soundId: "meow" });
    expect(result.gloss).not.toBe("Перевод неизвестен.");
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result).not.toHaveProperty("why");
    expect(result).not.toHaveProperty("notAFact");
  });

  it("не выдумывает перевод на пустой форме", async () => {
    const result = await useCase.execute({ speciesId: "cat" });
    expect(result.gloss).toBe("Перевод неизвестен.");
    expect(result.uncertain).toBe(true);
  });

  it("бросает UnknownSpeciesError", async () => {
    await expect(useCase.execute({ speciesId: "fox" })).rejects.toBeInstanceOf(UnknownSpeciesError);
  });
});
