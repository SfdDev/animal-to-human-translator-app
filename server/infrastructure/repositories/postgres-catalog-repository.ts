import type { CatalogRepository } from "../../application/ports.js";
import type { FilledFields } from "../../domain/scoring/types.js";
import { buildFormOptions } from "../../domain/catalog/form-options.js";
import type { FormOptions, Rule, Source, Species } from "../../domain/types.js";
import { query, queryOne } from "../db/pool.js";

export class PostgresCatalogRepository implements CatalogRepository {
  listSpecies(): Promise<Species[]> {
    return query<Species>(
      "SELECT * FROM species ORDER BY CASE id WHEN 'cat' THEN 1 WHEN 'dog' THEN 2 WHEN 'chicken' THEN 3 ELSE 9 END",
    );
  }

  getSpecies(id: string): Promise<Species | null> {
    return queryOne<Species>("SELECT * FROM species WHERE id = ?", [id]);
  }

  async getForm(speciesId: string): Promise<FormOptions | null> {
    const species = await this.getSpecies(speciesId);
    if (!species) return null;
    const rules = await this.listRules(speciesId);
    return buildFormOptions(
      species,
      await query("SELECT * FROM sounds WHERE species_id = ? ORDER BY label", [speciesId]),
      await query("SELECT * FROM contexts WHERE species_id = ? ORDER BY label", [speciesId]),
      await query("SELECT * FROM behaviors WHERE species_id = ? ORDER BY label", [speciesId]),
      rules,
    );
  }

  listRules(speciesId: string): Promise<Rule[]> {
    return query<Rule>("SELECT * FROM rules WHERE species_id = ?", [speciesId]);
  }

  async labelsFor(
    speciesId: string,
    filled: FilledFields,
  ): Promise<{ sound: string; context: string; behavior: string }> {
    const sound = filled.soundId
      ? await queryOne<{ label: string }>(
          "SELECT label FROM sounds WHERE species_id = ? AND id = ?",
          [speciesId, filled.soundId],
        )
      : null;
    const context = filled.contextId
      ? await queryOne<{ label: string }>(
          "SELECT label FROM contexts WHERE species_id = ? AND id = ?",
          [speciesId, filled.contextId],
        )
      : null;
    const behavior = filled.behaviorId
      ? await queryOne<{ label: string }>(
          "SELECT label FROM behaviors WHERE species_id = ? AND id = ?",
          [speciesId, filled.behaviorId],
        )
      : null;
    return {
      sound: sound?.label || "не указан",
      context: context?.label || "не указан",
      behavior: behavior?.label || "не указано",
    };
  }

  sourcesForRule(ruleId: string): Promise<Source[]> {
    return query<Source>(
      `SELECT s.* FROM sources s
       JOIN rule_sources rs ON rs.source_id = s.id
       WHERE rs.rule_id = ?
       ORDER BY s.year`,
      [ruleId],
    );
  }

  sourcesForSpecies(speciesId: string): Promise<Source[]> {
    return query<Source>("SELECT * FROM sources WHERE species_id = ? ORDER BY year", [speciesId]);
  }
}
