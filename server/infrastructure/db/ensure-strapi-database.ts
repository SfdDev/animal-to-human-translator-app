import pg from "pg";

const DEFAULT_STRAPI_DB = "strapi";

/** Имя БД только из безопасных символов — подставляем в CREATE DATABASE без параметров. */
function assertSafeDbName(name: string): string {
  if (!/^[a-z][a-z0-9_]*$/i.test(name)) {
    throw new Error(`Некорректное имя БД: ${name}`);
  }
  return name;
}

/**
 * Создаёт БД Strapi на том же Postgres, что и каталог переводчика.
 * Идемпотентно: безопасна при каждом `docker compose` / `npm run migrate`.
 */
export async function ensureStrapiDatabase(
  databaseUrl: string,
  databaseName = DEFAULT_STRAPI_DB,
): Promise<"created" | "exists"> {
  const name = assertSafeDbName(databaseName);
  const adminUrl = new URL(databaseUrl);
  // Подключаемся к служебной БД postgres — CREATE DATABASE нельзя выполнить «внутри» целевой.
  adminUrl.pathname = "/postgres";

  const client = new pg.Client({ connectionString: adminUrl.toString() });
  await client.connect();
  try {
    const found = await client.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists`,
      [name],
    );
    if (found.rows[0]?.exists) return "exists";

    await client.query(`CREATE DATABASE ${name}`);
    return "created";
  } finally {
    await client.end();
  }
}
