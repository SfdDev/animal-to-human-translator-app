import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadConfig } from "../../config/env.js";

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: loadConfig().databaseUrl,
      max: 10,
    });
  }
  return pool;
}

export async function connectDb(): Promise<void> {
  const lastError = await waitForDb();
  if (lastError) {
    throw new Error(
      `PostgreSQL недоступен. Запустите: docker compose up --build\n${lastError.message}`,
    );
  }
}

async function waitForDb(tries = 40): Promise<Error | null> {
  let last: Error | null = null;
  for (let i = 0; i < tries; i += 1) {
    try {
      await getPool().query("SELECT 1");
      return null;
    } catch (err) {
      last = err instanceof Error ? err : new Error(String(err));
      await sleep(400);
    }
  }
  return last;
}

export async function closeDb(): Promise<void> {
  if (!pool) return;
  await pool.end();
  pool = null;
}

export function schemaSql(): string {
  const file = join(dirname(fileURLToPath(import.meta.url)), "schema.sql");
  return readFileSync(file, "utf8");
}

export async function applySchema(client?: pg.PoolClient): Promise<void> {
  const exec = (sql: string, params: unknown[] = []) =>
    client ? client.query(sql, params) : getPool().query(sql, params);
  for (const stmt of schemaSql()
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)) {
    await exec(stmt);
  }
  await ensureRuleForeignKeys(exec);
}

const RULE_FOREIGN_KEYS: Array<[string, string]> = [
  [
    "rules_sound_fk",
    `ALTER TABLE rules ADD CONSTRAINT rules_sound_fk
     FOREIGN KEY (species_id, sound_id) REFERENCES sounds (species_id, id)`,
  ],
  [
    "rules_context_fk",
    `ALTER TABLE rules ADD CONSTRAINT rules_context_fk
     FOREIGN KEY (species_id, context_id) REFERENCES contexts (species_id, id)`,
  ],
  [
    "rules_behavior_fk",
    `ALTER TABLE rules ADD CONSTRAINT rules_behavior_fk
     FOREIGN KEY (species_id, behavior_id) REFERENCES behaviors (species_id, id)`,
  ],
];

async function ensureRuleForeignKeys(
  exec: (sql: string, params?: unknown[]) => Promise<pg.QueryResult>,
): Promise<void> {
  for (const [name, sql] of RULE_FOREIGN_KEYS) {
    const found = await exec("SELECT 1 FROM pg_constraint WHERE conname = $1", [name]);
    if ((found.rowCount ?? 0) > 0) continue;
    await exec(sql);
  }
}

function toPg(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

export async function query<T extends Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query(toPg(sql), params);
  return result.rows as T[];
}

export async function queryOne<T extends Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
