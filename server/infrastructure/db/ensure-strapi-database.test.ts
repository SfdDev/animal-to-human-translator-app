import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const end = vi.fn();
const connect = vi.fn();
const query = vi.fn();

vi.mock("pg", () => {
  class Client {
    connect = connect;
    query = query;
    end = end;
  }
  return { default: { Client } };
});

describe("ensureStrapiDatabase", () => {
  beforeEach(() => {
    vi.resetModules();
    connect.mockResolvedValue(undefined);
    end.mockResolvedValue(undefined);
    query.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("не создаёт БД, если она уже есть", async () => {
    query.mockResolvedValueOnce({ rows: [{ exists: true }] });
    const { ensureStrapiDatabase } = await import("./ensure-strapi-database.js");
    await expect(
      ensureStrapiDatabase("postgres://translator:translator@127.0.0.1:5433/translator"),
    ).resolves.toBe("exists");
    expect(query).toHaveBeenCalledTimes(1);
    expect(query.mock.calls[0]?.[0]).toMatch(/pg_database/);
  });

  it("создаёт БД, если её нет", async () => {
    query.mockResolvedValueOnce({ rows: [{ exists: false }] }).mockResolvedValueOnce({});
    const { ensureStrapiDatabase } = await import("./ensure-strapi-database.js");
    await expect(
      ensureStrapiDatabase("postgres://translator:translator@127.0.0.1:5433/translator"),
    ).resolves.toBe("created");
    expect(query.mock.calls[1]?.[0]).toBe("CREATE DATABASE strapi");
  });

  it("отклоняет небезопасное имя БД", async () => {
    const { ensureStrapiDatabase } = await import("./ensure-strapi-database.js");
    await expect(
      ensureStrapiDatabase("postgres://u:p@127.0.0.1:5433/translator", "strapi;drop"),
    ).rejects.toThrow(/Некорректное имя/);
    expect(connect).not.toHaveBeenCalled();
  });
});
