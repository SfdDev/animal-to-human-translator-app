import { applySchema, closeDb, connectDb } from "../infrastructure/db/pool.js";

try {
  await connectDb();
  await applySchema();
  console.log("PostgreSQL: схема и внешние ключи применены");
} finally {
  await closeDb();
}
