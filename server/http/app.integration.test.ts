import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { GetCatalog } from "../application/get-catalog.js";
import { InterpretSignal } from "../application/interpret-signal.js";
import { listen } from "../test/http-server.js";
import { requireSeededCatalog } from "../test/require-seeded-catalog.js";
import { query } from "../infrastructure/db/pool.js";
import { createHttpApp } from "./app.js";

const config = {
  port: 0,
  databaseUrl: process.env.DATABASE_URL ?? "",
  nodeEnv: "test",
  seedOnStart: false,
  corsOrigins: ["http://localhost:5173"],
};

describe("HTTP API на живом каталоге", () => {
  let url: string;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const catalog = await requireSeededCatalog();
    const app = createHttpApp(
      config,
      new GetCatalog(catalog),
      new InterpretSignal(catalog),
      async () => {
        await query("SELECT 1");
      },
    );
    const server = await listen(app);
    url = server.url;
    close = server.close;
  });

  afterAll(async () => {
    await close();
  });

  it("проверяет Postgres в /api/health", async () => {
    const res = await fetch(`${url}/api/health`);
    expect(res.ok).toBe(true);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("отдаёт виды из Postgres", async () => {
    const res = await fetch(`${url}/api/species`);
    const body = (await res.json()) as { id: string }[];
    expect(body.map((row) => row.id)).toEqual(["cat", "dog", "chicken"]);
  });

  it("переводит мяу через HTTP", async () => {
    const res = await fetch(`${url}/api/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speciesId: "cat", soundId: "meow" }),
    });
    expect(res.ok).toBe(true);
    const body = (await res.json()) as Record<string, unknown>;
    expect(body.gloss).not.toBe("Перевод неизвестен.");
    expect(body).not.toHaveProperty("why");
    expect(body).not.toHaveProperty("notAFact");
  });

  it("отвечает 404 на неизвестный вид", async () => {
    const res = await fetch(`${url}/api/form/fox`);
    expect(res.status).toBe(404);
  });
});
