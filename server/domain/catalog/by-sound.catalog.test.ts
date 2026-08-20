import { describe, expect, it } from "vitest";
import { behaviors, contexts, rules, sounds, species } from "../../infrastructure/catalog/data.js";
import { buildBySound } from "./by-sound.js";
import { buildFormOptions } from "./form-options.js";

function rulesFor(speciesId: string) {
  return rules.filter((row) => row.species_id === speciesId);
}

function soundsFor(speciesId: string) {
  return sounds
    .filter(([sp]) => sp === speciesId)
    .map(([species_id, id, label, description]) => ({ species_id, id, label, description }));
}

function contextsFor(speciesId: string) {
  return contexts
    .filter(([sp]) => sp === speciesId)
    .map(([species_id, id, label]) => ({ species_id, id, label }));
}

function behaviorsFor(speciesId: string) {
  return behaviors
    .filter(([sp]) => sp === speciesId)
    .map(([species_id, id, label]) => ({ species_id, id, label }));
}

describe("buildBySound для всех видов каталога", () => {
  it("кошка: мяu с контекстами, вой — с agonistic", () => {
    const map = buildBySound(rulesFor("cat"));
    expect(map.meow?.contexts).toContain("food");
    expect(map.meow?.contexts).toContain("door");
    expect(map.howl?.contexts).toEqual(["agonistic"]);
    expect(map.purr?.contexts).toContain("food");
  });

  it("собака: лай с ситуациями, скуление — одиночество", () => {
    const map = buildBySound(rulesFor("dog"));
    expect(map.bark?.contexts).toEqual(
      expect.arrayContaining(["disturbance", "isolation", "play", "walk", "ball", "fight"]),
    );
    expect(map.bark?.behaviors).toEqual(
      expect.arrayContaining(["at_door", "play_bow", "retreat", "stiff", "wag_loose"]),
    );
    expect(map.growl?.contexts).toEqual(
      expect.arrayContaining(["food_guard", "play", "stranger"]),
    );
    expect(map.whine?.contexts).toEqual(["isolation"]);
  });

  it("курица: пищевой крик — контексты и поиск на земле", () => {
    const map = buildBySound(rulesFor("chicken"));
    expect(map.food_call?.contexts).toEqual(
      expect.arrayContaining(["preferred_food", "hen_present"]),
    );
    expect(map.food_call?.behaviors).toEqual(["search_ground"]);
    expect(map.aerial?.behaviors).toEqual(["look_up"]);
    expect(map.ground?.behaviors).toEqual(["vigilant"]);
  });

  it("buildFormOptions работает для каждого вида в species", () => {
    for (const sp of species) {
      const form = buildFormOptions(
        sp,
        soundsFor(sp.id),
        contextsFor(sp.id),
        behaviorsFor(sp.id),
        rulesFor(sp.id),
      );
      expect(Object.keys(form.bySound).length).toBeGreaterThan(0);
      for (const sound of form.sounds) {
        expect(form.bySound[sound.id]).toBeDefined();
      }
    }
  });
});
