import { describe, expect, it } from "vitest";
import { scoreRule, sortScored } from "./scorer.js";
import { makeRule, makeSpecies } from "../../application/test-helpers.js";

describe("scoreRule", () => {
  it("отбрасывает правило с другим звуком", () => {
    const hit = scoreRule(makeSpecies(), makeRule({ sound_id: "hiss" }), {
      soundId: "meow",
      contextId: null,
      behaviorId: null,
    });
    expect(hit).toBeNull();
  });

  it("отбрасывает правило с другим контекстом", () => {
    const hit = scoreRule(makeSpecies(), makeRule({ context_id: "isolation" }), {
      soundId: "meow",
      contextId: "food",
      behaviorId: null,
    });
    expect(hit).toBeNull();
  });

  it("отбрасывает правило с другим поведением", () => {
    const hit = scoreRule(makeSpecies(), makeRule({ behavior_id: "retreat" }), {
      soundId: "meow",
      contextId: null,
      behaviorId: "approach",
    });
    expect(hit).toBeNull();
  });

  it("не берёт слабый catch-all лая, если уже указан контекст", () => {
    const hit = scoreRule(
      makeSpecies({ id: "dog", logic: "graded_context" }),
      makeRule({
        species_id: "dog",
        sound_id: "bark",
        context_id: null,
        behavior_id: null,
        weak: 1,
        gloss: "Слышен лай.",
      }),
      { soundId: "bark", contextId: "food", behaviorId: null },
    );
    expect(hit).toBeNull();
  });

  it("для курицы не отбрасывает catch-all из-за контекста", () => {
    const hit = scoreRule(
      makeSpecies({ id: "chicken", logic: "referential" }),
      makeRule({
        species_id: "chicken",
        sound_id: "food_call",
        weak: 1,
      }),
      { soundId: "food_call", contextId: "yard", behaviorId: null },
    );
    expect(hit).not.toBeNull();
  });

  it("ограничивает уверенность мяу без контекста", () => {
    const hit = scoreRule(makeSpecies(), makeRule({ confidence: 0.8 }), {
      soundId: "meow",
      contextId: null,
      behaviorId: null,
    });
    expect(hit?.confidence).toBeLessThanOrEqual(0.32);
  });

  it("ограничивает лай без ситуации", () => {
    const hit = scoreRule(
      makeSpecies({ id: "dog", logic: "graded_context" }),
      makeRule({ species_id: "dog", sound_id: "bark", confidence: 0.8 }),
      { soundId: "bark", contextId: null, behaviorId: null },
    );
    expect(hit?.confidence).toBeLessThanOrEqual(0.32);
  });
});

describe("sortScored", () => {
  it("ставит более специфичное правило выше", () => {
    const filled = { soundId: "meow", contextId: "food", behaviorId: null };
    const general = {
      ...makeRule({ id: "g", context_id: null, confidence: 0.9 }),
      missing: [],
    };
    const specific = {
      ...makeRule({ id: "s", context_id: "food", confidence: 0.4 }),
      missing: [],
    };
    const ranked = sortScored(filled, [general, specific]);
    expect(ranked[0].id).toBe("s");
  });
});
