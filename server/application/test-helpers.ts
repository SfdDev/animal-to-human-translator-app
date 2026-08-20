import type { FilledFields } from "../domain/scoring/types.js";
import type { FormOptions, Rule, Source, Species } from "../domain/types.js";
import type { CatalogRepository } from "./ports.js";

export function makeSpecies(over: Partial<Species> = {}): Species {
  return {
    id: "cat",
    name: "Кошка",
    latin: "Felis catus",
    logic: "motivational_human",
    logic_label: "метка",
    logic_note: "заметка",
    ...over,
  };
}

export function makeRule(over: Partial<Rule> = {}): Rule {
  return {
    id: "rule-1",
    species_id: "cat",
    sound_id: "meow",
    context_id: null,
    behavior_id: null,
    gloss: "Запрос к человеку.",
    function: "запрос",
    state: "—",
    confidence: 0.6,
    why: "из статьи",
    not_a_fact: "",
    weak: 0,
    ...over,
  };
}

export function makeRepo(over: Partial<CatalogRepository> = {}): CatalogRepository {
  const species = makeSpecies();
  return {
    listSpecies: async () => [species],
    getSpecies: async (id) => (id === species.id ? species : null),
    getForm: async (speciesId) => {
      if (speciesId !== species.id) return null;
      return {
        species,
        sounds: [{ species_id: "cat", id: "meow", label: "Мяу", description: null }],
        contexts: [{ species_id: "cat", id: "food", label: "Еда" }],
        behaviors: [{ species_id: "cat", id: "approach", label: "Подходит" }],
        bySound: {
          meow: { contexts: ["food"], behaviors: ["approach"] },
        },
      } satisfies FormOptions;
    },
    listRules: async () => [],
    labelsFor: async (_id: string, filled: FilledFields) => ({
      sound: filled.soundId ? "Мяу" : "не указан",
      context: filled.contextId ? "Еда" : "не указан",
      behavior: filled.behaviorId ? "Подходит" : "не указано",
    }),
    sourcesForRule: async () => [] as Source[],
    sourcesForSpecies: async () => [] as Source[],
    ...over,
  };
}
