import "dotenv/config";

export type AppConfig = {
  port: number;
  databaseUrl: string;
  nodeEnv: string;
  seedOnStart: boolean;
  corsOrigins: string[];
};

export function loadConfig(): AppConfig {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const seedFlag = process.env.SEED_ON_START;
  return {
    port: Number(process.env.PORT) || 3001,
    databaseUrl:
      process.env.DATABASE_URL?.trim() ||
      "postgres://translator:translator@127.0.0.1:5433/translator",
    nodeEnv,
    seedOnStart: seedFlag === "1",
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  };
}

function parseCorsOrigins(raw: string | undefined): string[] {
  const fromEnv = raw
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (fromEnv?.length) return fromEnv;
  return ["http://127.0.0.1:5173", "http://localhost:5173"];
}
