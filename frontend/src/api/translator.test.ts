import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchForm, fetchSpecies, interpret } from "./translator";

describe("translator api", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("запрашивает виды", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "cat" }],
    });
    vi.stubGlobal("fetch", fetchMock);
    await expect(fetchSpecies()).resolves.toEqual([{ id: "cat" }]);
    expect(fetchMock).toHaveBeenCalledWith("/api/species", expect.anything());
  });

  it("кодирует id вида в пути формы", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);
    await fetchForm("cat/x");
    expect(fetchMock.mock.calls[0]?.[0]).toBe("/api/form/cat%2Fx");
  });

  it("отправляет перевод POST-ом", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ gloss: "Еда." }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await interpret({
      speciesId: "chicken",
      soundId: "food_call",
      contextId: "",
      behaviorId: "",
    });
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ method: "POST" });
  });
});
