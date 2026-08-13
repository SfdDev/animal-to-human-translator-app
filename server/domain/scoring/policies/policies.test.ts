import { describe, expect, it } from "vitest";
import { makeRule } from "../../../application/test-helpers.js";
import type { ScoreContext } from "../types.js";
import { gradedContextPolicy } from "./graded-context.js";
import { motivationalHumanPolicy } from "./motivational-human.js";
import { referentialPolicy } from "./referential.js";

const ctx = (filled: ScoreContext["filled"], rule = makeRule()): ScoreContext => ({ filled, rule });

describe("motivationalHumanPolicy", () => {
  it("режет уверенность мяу без контекста", () => {
    expect(
      motivationalHumanPolicy.adjust(
        0.8,
        ctx({ soundId: "meow", contextId: null, behaviorId: null }),
      ),
    ).toBe(0.32);
  });

  it("не режет мяу с контекстом", () => {
    expect(
      motivationalHumanPolicy.adjust(
        0.8,
        ctx({ soundId: "meow", contextId: "food", behaviorId: null }),
      ),
    ).toBe(0.8);
  });
});

describe("gradedContextPolicy", () => {
  it("режет лай без ситуации", () => {
    expect(
      gradedContextPolicy.adjust(0.8, ctx({ soundId: "bark", contextId: null, behaviorId: null })),
    ).toBe(0.32);
  });

  it("не режет лай, если есть поведение", () => {
    expect(
      gradedContextPolicy.adjust(
        0.8,
        ctx({ soundId: "bark", contextId: null, behaviorId: "approach" }),
      ),
    ).toBe(0.8);
  });
});

describe("referentialPolicy", () => {
  it("поднимает уверенность, когда тип крика известен", () => {
    const rule = makeRule({ confidence: 0.7 });
    expect(
      referentialPolicy.adjust(
        0.2,
        ctx({ soundId: "food_call", contextId: null, behaviorId: null }, rule),
      ),
    ).toBeCloseTo(0.665);
  });

  it("не поднимает unknown", () => {
    expect(
      referentialPolicy.adjust(0.2, ctx({ soundId: "unknown", contextId: null, behaviorId: null })),
    ).toBe(0.2);
  });
});
