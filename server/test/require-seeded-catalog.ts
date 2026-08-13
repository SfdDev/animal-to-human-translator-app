import { PostgresCatalogRepository } from "../infrastructure/repositories/postgres-catalog-repository.js";
import { connectDb } from "../infrastructure/db/pool.js";

const catalog = new PostgresCatalogRepository();

export async function requireSeededCatalog(): Promise<PostgresCatalogRepository> {
  await connectDb();
  const species = await catalog.listSpecies();
  if (!species.length) {
    throw new Error("Каталог пуст. Сначала: npm run migrate && npm run seed");
  }
  return catalog;
}
