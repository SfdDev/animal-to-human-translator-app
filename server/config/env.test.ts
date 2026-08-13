import { afterEach, describe, expect, it } from "vitest";
import { loadConfig } from "./env.js";

const keys = ["PORT", "DATABASE_URL", "NODE_ENV", "SEED_ON_START", "CORS_ORIGINS"] as const;

describe("loadConfig", () => {
  const previous = new Map<string, string | undefined>();

  afterEach(() => {
    for (const key of keys) {
      const value = previous.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    previous.clear();
  });

  function setEnv(values: Partial<Record<(typeof keys)[number], string | undefined>>) {
    for (const [key, value] of Object.entries(values)) {
      previous.set(key, process.env[key]);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }

  it("берёт порт и URL из окружения", () => {
    setEnv({
      PORT: "4000",
      DATABASE_URL: "postgres://app:app@db:5432/app",
      NODE_ENV: "development",
      SEED_ON_START: "0",
    });
    const config = loadConfig();
    expect(config.port).toBe(4000);
    expect(config.databaseUrl).toBe("postgres://app:app@db:5432/app");
    expect(config.seedOnStart).toBe(false);
  });

  it("в development без флага не перетирает каталог", () => {
    setEnv({ NODE_ENV: "development", SEED_ON_START: undefined });
    expect(loadConfig().seedOnStart).toBe(false);
  });

  it("в production не сидирует без явного флага", () => {
    setEnv({ NODE_ENV: "production", SEED_ON_START: undefined });
    expect(loadConfig().seedOnStart).toBe(false);
  });

  it("сидит в production, если SEED_ON_START=1", () => {
    setEnv({ NODE_ENV: "production", SEED_ON_START: "1" });
    expect(loadConfig().seedOnStart).toBe(true);
  });

  it("читает CORS_ORIGINS из окружения", () => {
    setEnv({ CORS_ORIGINS: "https://app.example, http://127.0.0.1:5173" });
    expect(loadConfig().corsOrigins).toEqual(["https://app.example", "http://127.0.0.1:5173"]);
  });
});
