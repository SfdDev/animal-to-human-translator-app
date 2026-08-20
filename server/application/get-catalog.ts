import { UnknownSpeciesError } from "./errors.js";
import type { CatalogRepository } from "./ports.js";
import { buildFormOptions } from "../domain/catalog/form-options.js";

export class GetCatalog {
  constructor(private readonly catalog: CatalogRepository) {}

  listSpecies() {
    return this.catalog.listSpecies();
  }

  async formOptions(speciesId: string) {
    const form = await this.catalog.getForm(speciesId);
    if (!form) throw new UnknownSpeciesError();
    const rules = await this.catalog.listRules(speciesId);
    return buildFormOptions(form.species, form.sounds, form.contexts, form.behaviors, rules);
  }
}
