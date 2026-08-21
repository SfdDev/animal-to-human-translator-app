import { loadConfig } from "../config/env.js";
import { applySchema, closeDb, connectDb } from "../infrastructure/db/pool.js";
import { ensureStrapiDatabase } from "../infrastructure/db/ensure-strapi-database.js";

try {
  const { databaseUrl } = loadConfig();
  await connectDb();
  await applySchema();
  console.log("PostgreSQL: схема каталога переводчика применена");

  const strapiDb = await ensureStrapiDatabase(databaseUrl);
  console.log(
    strapiDb === "created" ? "PostgreSQL: создана БД strapi" : "PostgreSQL: БД strapi уже есть",
  );
} finally {
  await closeDb();
}
