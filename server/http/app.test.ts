import { afterEach, describe, expect, it } from "vitest";
import { GetCatalog } from "../application/get-catalog.js";
import { InterpretSignal } from "../application/interpret-signal.js";
import { makeRepo, makeRule } from "../application/test-helpers.js";
import { listen } from "../test/http-server.js";
import { createHttpApp } from "./app.js";

const config = {
  port: 0,
  databaseUrl: "postgres://translator:translator@127.0.0.1:5433/translator",
  nodeEnv: "test",
  seedOnStart: false,
  corsOrigins: ["http://localhost:5173"],
};

function makeApp() {
  const repo = makeRepo({
    listRules: async () => [makeRule()],
  });
  return createHttpApp(config, new GetCatalog(repo), new InterpretSignal(repo));
}

describe("HTTP API", () => {
  let close: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await close?.();
    close = undefined;
  });

  it("отвечает на /api/health", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/health`);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it("отдаёт виды", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/species`);
    const body = (await res.json()) as { id: string }[];
    expect(body[0]?.id).toBe("cat");
  });

  it("отдаёт форму вида", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/form/cat`);
    const body = (await res.json()) as { sounds: { id: string }[] };
    expect(body.sounds[0]?.id).toBe("meow");
  });

  it("возвращает 404 для неизвестного вида", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/form/fox`);
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Неизвестный вид" });
  });

  it("требует speciesId при переводе", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toEqual({ error: "Нужен speciesId" });
  });

  it("переводит сигнал", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speciesId: "cat", soundId: "meow" }),
    });
    expect(res.ok).toBe(true);
    const body = (await res.json()) as { gloss: string; confidence: number };
    expect(body.gloss).toBe("Запрос к человеку.");
    expect(typeof body.confidence).toBe("number");
    expect(Number.isFinite(body.confidence)).toBe(true);
  });

  it("на неизвестный вид при переводе отвечает 404", async () => {
    const server = await listen(makeApp());
    close = server.close;
    const res = await fetch(`${server.url}/api/interpret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ speciesId: "fox", soundId: "meow" }),
    });
    expect(res.status).toBe(404);
    await expect(res.json()).resolves.toEqual({ error: "Неизвестный вид" });
  });

  it("не отдаёт внутреннее сообщение при 500", async () => {
    const app = createHttpApp(
      config,
      new GetCatalog(
        makeRepo({
          listSpecies: async () => {
            throw new Error("ECONNREFUSED secret-host");
          },
        }),
      ),
      new InterpretSignal(makeRepo()),
    );
    const server = await listen(app);
    close = server.close;
    const res = await fetch(`${server.url}/api/species`);
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toEqual({ error: "Внутренняя ошибка сервера" });
  });

  it("отдаёт 503, если проверка здоровья не проходит", async () => {
    const app = createHttpApp(
      config,
      new GetCatalog(makeRepo()),
      new InterpretSignal(makeRepo()),
      async () => {
        throw new Error("db down");
      },
    );
    const server = await listen(app);
    close = server.close;
    const res = await fetch(`${server.url}/api/health`);
    expect(res.status).toBe(503);
    await expect(res.json()).resolves.toEqual({ ok: false });
  });
});
