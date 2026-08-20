import { buildBySound } from "./by-sound.js";
import type { FormOptions, Rule, Species } from "../types.js";

/** Собирает опции формы для любого вида; bySound всегда из правил каталога. */
export function buildFormOptions(
  species: Species,
  sounds: FormOptions["sounds"],
  contexts: FormOptions["contexts"],
  behaviors: FormOptions["behaviors"],
  rules: Rule[],
): FormOptions {
  return {
    species,
    sounds,
    contexts,
    behaviors,
    bySound: buildBySound(rules),
  };
}
