import { asConfidence, ruleFit, WEAK_FIT } from "../domain/scoring/fit.js";
import { scoreRule, sortScored } from "../domain/scoring/scorer.js";
import type { FilledFields } from "../domain/scoring/types.js";
import type { Alternative, InterpretInput, InterpretResult, Species } from "../domain/types.js";
import { UnknownSpeciesError } from "./errors.js";
import type { CatalogRepository } from "./ports.js";

export class InterpretSignal {
  constructor(private readonly catalog: CatalogRepository) {}

  async execute(input: InterpretInput): Promise<InterpretResult> {
    const species = await this.catalog.getSpecies(input.speciesId);
    if (!species) throw new UnknownSpeciesError();

    const filled: FilledFields = {
      soundId: empty(input.soundId),
      contextId: empty(input.contextId),
      behaviorId: empty(input.behaviorId),
    };

    if (!filled.soundId && !filled.contextId && !filled.behaviorId) {
      return this.blank(species);
    }

    const rules = await this.catalog.listRules(input.speciesId);
    const scored = [];
    for (const rule of rules) {
      const hit = scoreRule(species, rule, filled);
      if (hit) scored.push(hit);
    }
    const ranked = sortScored(filled, scored);

    if (!ranked.length) {
      return this.blank(species);
    }

    const top = ranked[0];
    if (!top) return this.blank(species);
    const confidence = asConfidence(top.confidence);
    const uncertain = confidence < WEAK_FIT || Number(top.weak) === 1;
    return {
      species,
      input: await this.catalog.labelsFor(input.speciesId, filled),
      uncertain,
      confidence,
      fit: ruleFit(confidence, Number(top.weak) === 1),
      gloss: top.gloss,
      function: top.function,
      state: top.state,
      sources: await this.catalog.sourcesForRule(top.id),
      alternatives: ranked.slice(1, 4).map((r): Alternative => {
        const altConfidence = asConfidence(r.confidence);
        return {
          gloss: r.gloss,
          confidence: altConfidence,
          fit: ruleFit(altConfidence, Number(r.weak) === 1),
          why: r.why,
          weak: Number(r.weak) === 1,
        };
      }),
    };
  }

  private async blank(species: Species): Promise<InterpretResult> {
    return {
      species,
      input: null,
      uncertain: true,
      confidence: 0,
      fit: "weak",
      gloss: "Перевод неизвестен.",
      function: "—",
      state: "—",
      sources: await this.catalog.sourcesForSpecies(species.id),
      alternatives: [],
    };
  }
}

function empty(v: string | null | undefined): string | null {
  return v && v !== "" ? v : null;
}
