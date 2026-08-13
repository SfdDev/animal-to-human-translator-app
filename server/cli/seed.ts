import { closeDb, seed } from "../infrastructure/catalog/seed.js";

try {
  await seed();
} finally {
  await closeDb();
}
