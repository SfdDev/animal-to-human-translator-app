import { afterEach, describe, expect, it, vi } from "vitest";
import { request } from "./http";

describe("request", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("возвращает json при 200", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      }),
    );
    await expect(request("/api/health")).resolves.toEqual({ ok: true });
  });

  it("бросает ошибку API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: "Неизвестный вид" }),
      }),
    );
    await expect(request("/api/form/fox")).rejects.toThrow("Неизвестный вид");
  });

  it("подставляет статус, если тело без error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("no json");
        },
      }),
    );
    await expect(request("/api/species")).rejects.toThrow("Ошибка 500");
  });
});
