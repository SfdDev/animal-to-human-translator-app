import { describe, expect, it } from "vitest";
import { UnknownSpeciesError } from "./errors.js";
import { InterpretSignal } from "./interpret-signal.js";
import { makeRepo, makeRule, makeSpecies } from "./test-helpers.js";

describe("InterpretSignal", () => {
  it("бросает ошибку для неизвестного вида", async () => {
    const useCase = new InterpretSignal(makeRepo({ getSpecies: async () => null }));
    await expect(useCase.execute({ speciesId: "fox" })).rejects.toBeInstanceOf(UnknownSpeciesError);
  });

  it("не переводит пустую форму", async () => {
    const useCase = new InterpretSignal(makeRepo());
    const result = await useCase.execute({ speciesId: "cat" });
    expect(result.gloss).toBe("Перевод неизвестен.");
    expect(result.uncertain).toBe(true);
    expect(result.confidence).toBe(0);
    expect(result.fit).toBe("weak");
    expect(result.input).toBeNull();
  });

  it("возвращает правило и источники", async () => {
    const rule = makeRule();
    const useCase = new InterpretSignal(
      makeRepo({
        listRules: async () => [rule],
        sourcesForRule: async () => [{ id: "s1", title: "Статья", year: 2019, authors: "A." }],
      }),
    );
    const result = await useCase.execute({ speciesId: "cat", soundId: "meow" });
    expect(result.gloss).toBe(rule.gloss);
    expect(result.function).toBe(rule.function);
    expect(result.confidence).toBeLessThanOrEqual(0.32);
    expect(result.fit).toBe("weak");
    expect(result).not.toHaveProperty("logicNote");
    expect(result.sources).toHaveLength(1);
    expect(result.input?.sound).toBe("Мяу");
  });

  it("если ни одно правило не подошло — честный отказ", async () => {
    const useCase = new InterpretSignal(
      makeRepo({
        listRules: async () => [makeRule({ sound_id: "hiss" })],
      }),
    );
    const result = await useCase.execute({ speciesId: "cat", soundId: "meow" });
    expect(result.gloss).toBe("Перевод неизвестен.");
    expect(result.uncertain).toBe(true);
    expect(result.alternatives).toEqual([]);
  });

  it("кладёт остальные трактовки в альтернативы", async () => {
    const useCase = new InterpretSignal(
      makeRepo({
        getSpecies: async () => makeSpecies({ logic: "referential", id: "chicken" }),
        listRules: async () => [
          makeRule({
            id: "a",
            species_id: "chicken",
            sound_id: "food_call",
            confidence: 0.8,
            gloss: "Еда.",
          }),
          makeRule({
            id: "b",
            species_id: "chicken",
            sound_id: "food_call",
            confidence: 0.5,
            gloss: "Иначе.",
          }),
        ],
      }),
    );
    const result = await useCase.execute({ speciesId: "chicken", soundId: "food_call" });
    expect(result.gloss).toBe("Еда.");
    expect(result.alternatives.map((a) => a.gloss)).toEqual(["Иначе."]);
    expect(result.alternatives[0]?.why).toBe("из статьи");
    expect(result.alternatives[0]?.confidence).toBeGreaterThan(0);
    expect(result.alternatives[0]?.fit).toBe("medium");
  });

  it("помечает слабое правило как неуверенное", async () => {
    const useCase = new InterpretSignal(
      makeRepo({
        getSpecies: async () => makeSpecies({ logic: "referential" }),
        listRules: async () => [makeRule({ weak: 1, sound_id: "food_call" })],
      }),
    );
    const result = await useCase.execute({ speciesId: "cat", soundId: "food_call" });
    expect(result.uncertain).toBe(true);
    expect(result.fit).toBe("weak");
  });
});
