import { describe, expect, it } from "vitest";
import { buildBySound } from "./by-sound.js";
import type { Rule } from "../types.js";

function rule(over: Partial<Rule>): Rule {
  return {
    id: "r",
    species_id: "cat",
    sound_id: "meow",
    context_id: null,
    behavior_id: null,
    gloss: "",
    function: "",
    state: "",
    confidence: 0.5,
    why: "",
    not_a_fact: "",
    weak: 0,
    ...over,
  };
}

describe("buildBySound", () => {
  it("собирает контексты и поведение по звуку", () => {
    const map = buildBySound([
      rule({ sound_id: "meow", context_id: "food" }),
      rule({ sound_id: "meow", context_id: "door", behavior_id: "approach" }),
      rule({ sound_id: "howl", context_id: "agonistic" }),
      rule({ sound_id: "howl", context_id: null }),
      rule({ sound_id: null, context_id: "play" }),
    ]);
    expect(map.meow?.contexts).toEqual(["door", "food"]);
    expect(map.meow?.behaviors).toEqual(["approach"]);
    expect(map.howl?.contexts).toEqual(["agonistic"]);
    expect(map.howl?.behaviors).toEqual([]);
  });
});
