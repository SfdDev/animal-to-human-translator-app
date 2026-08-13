import { GetCatalog } from "./application/get-catalog.js";
import { InterpretSignal } from "./application/interpret-signal.js";
import { loadConfig } from "./config/env.js";
import { createHttpApp } from "./http/app.js";
import { seed, seedIfEmpty } from "./infrastructure/catalog/seed.js";
import { connectDb, query } from "./infrastructure/db/pool.js";
import { PostgresCatalogRepository } from "./infrastructure/repositories/postgres-catalog-repository.js";

const config = loadConfig();
await connectDb();
if (config.seedOnStart) await seed();
else await seedIfEmpty();

const catalogRepo = new PostgresCatalogRepository();
const app = createHttpApp(
  config,
  new GetCatalog(catalogRepo),
  new InterpretSignal(catalogRepo),
  async () => {
    await query("SELECT 1");
  },
);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`API http://localhost:${config.port}`);
});
