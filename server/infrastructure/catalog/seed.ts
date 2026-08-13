import { behaviors, contexts, rules, sounds, sources, species } from "./data.js";
import { assertCatalogIntegrity } from "./integrity.js";
import { applySchema, closeDb, connectDb, getPool, queryOne } from "../db/pool.js";

export async function seed(): Promise<void> {
  assertCatalogIntegrity();
  await connectDb();
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    await applySchema(client);
    await client.query(`
      TRUNCATE rule_sources, rules, behaviors, contexts, sounds, sources, species
      RESTART IDENTITY CASCADE
    `);

    for (const s of species) {
      await client.query(
        `INSERT INTO species (id, name, latin, logic, logic_label, logic_note)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [s.id, s.name, s.latin, s.logic, s.logic_label, s.logic_note],
      );
    }
    for (const s of sources) {
      await client.query(
        `INSERT INTO sources (id, species_id, authors, year, title, venue, doi, url, how_used)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          s.id,
          s.species_id ?? null,
          s.authors ?? null,
          s.year ?? null,
          s.title,
          s.venue ?? null,
          s.doi ?? null,
          s.url ?? null,
          s.how_used ?? null,
        ],
      );
    }
    for (const row of sounds) {
      await client.query(
        `INSERT INTO sounds (species_id, id, label, description) VALUES ($1, $2, $3, $4)`,
        [...row],
      );
    }
    for (const row of contexts) {
      await client.query(`INSERT INTO contexts (species_id, id, label) VALUES ($1, $2, $3)`, [
        ...row,
      ]);
    }
    for (const row of behaviors) {
      await client.query(`INSERT INTO behaviors (species_id, id, label) VALUES ($1, $2, $3)`, [
        ...row,
      ]);
    }
    for (const r of rules) {
      await client.query(
        `INSERT INTO rules (
           id, species_id, sound_id, context_id, behavior_id, gloss,
           "function", state, confidence, why, not_a_fact, weak
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          r.id,
          r.species_id,
          r.sound_id,
          r.context_id,
          r.behavior_id,
          r.gloss,
          r.function,
          r.state,
          r.confidence,
          r.why,
          r.not_a_fact,
          r.weak,
        ],
      );
      for (const sid of r.sources ?? []) {
        await client.query(`INSERT INTO rule_sources (rule_id, source_id) VALUES ($1, $2)`, [
          r.id,
          sid,
        ]);
      }
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
  console.log(`PostgreSQL: каталог записан. Правил ${rules.length}, источников ${sources.length}`);
}

export async function seedIfEmpty(): Promise<void> {
  await connectDb();
  await applySchema();
  const row = await queryOne<{ n: string }>("SELECT COUNT(*)::text AS n FROM species");
  if (Number(row?.n) > 0) {
    console.log("PostgreSQL: каталог уже есть, сид пропущен");
    return;
  }
  await seed();
}

export { closeDb, connectDb };
