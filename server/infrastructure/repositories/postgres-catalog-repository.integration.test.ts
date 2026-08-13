import { beforeAll, describe, expect, it } from "vitest";
import { requireSeededCatalog } from "../../test/require-seeded-catalog.js";
import type { PostgresCatalogRepository } from "./postgres-catalog-repository.js";

describe("PostgresCatalogRepository", () => {
  let catalog: PostgresCatalogRepository;

  beforeAll(async () => {
    catalog = await requireSeededCatalog();
  });

  it("отдаёт виды в порядке кошка, собака, курица", async () => {
    const list = await catalog.listSpecies();
    expect(list.map((row) => row.id)).toEqual(["cat", "dog", "chicken"]);
  });

  it("собирает форму кошки со звуком мяу", async () => {
    const form = await catalog.getForm("cat");
    expect(form?.sounds.some((row) => row.id === "meow")).toBe(true);
  });

  it("не находит неизвестный вид", async () => {
    await expect(catalog.getSpecies("fox")).resolves.toBeNull();
    await expect(catalog.getForm("fox")).resolves.toBeNull();
  });

  it("читает правила и источники правила", async () => {
    const rules = await catalog.listRules("cat");
    expect(rules.length).toBeGreaterThan(0);
    const rule = rules[0];
    expect(rule).toBeDefined();
    const sources = await catalog.sourcesForRule(rule!.id);
    expect(sources.length).toBeGreaterThan(0);
    expect(sources[0]?.title).toBeTruthy();
  });

  it("подписывает выбранные поля", async () => {
    const labels = await catalog.labelsFor("cat", {
      soundId: "meow",
      contextId: null,
      behaviorId: null,
    });
    expect(labels.sound).toBe("Мяу");
    expect(labels.context).toBe("не указан");
  });
});
