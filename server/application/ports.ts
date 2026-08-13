import type {
  FormOptions,
  InterpretInput,
  InterpretResult,
  Rule,
  Source,
  Species,
} from "../domain/types.js";
import type { FilledFields } from "../domain/scoring/types.js";

export interface CatalogRepository {
  listSpecies(): Promise<Species[]>;
  getSpecies(id: string): Promise<Species | null>;
  getForm(speciesId: string): Promise<FormOptions | null>;
  listRules(speciesId: string): Promise<Rule[]>;
  labelsFor(
    speciesId: string,
    filled: FilledFields,
  ): Promise<{
    sound: string;
    context: string;
    behavior: string;
  }>;
  sourcesForRule(ruleId: string): Promise<Source[]>;
  sourcesForSpecies(speciesId: string): Promise<Source[]>;
}

export type { InterpretInput, InterpretResult };
