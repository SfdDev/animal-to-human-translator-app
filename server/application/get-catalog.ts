import { UnknownSpeciesError } from "./errors.js";
import type { CatalogRepository } from "./ports.js";

export class GetCatalog {
  constructor(private readonly catalog: CatalogRepository) {}

  listSpecies() {
    return this.catalog.listSpecies();
  }

  async formOptions(speciesId: string) {
    const form = await this.catalog.getForm(speciesId);
    if (!form) throw new UnknownSpeciesError();
    return form;
  }
}
