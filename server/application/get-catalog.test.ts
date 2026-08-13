import { describe, expect, it } from "vitest";
import { UnknownSpeciesError } from "./errors.js";
import { GetCatalog } from "./get-catalog.js";
import { makeRepo } from "./test-helpers.js";

describe("GetCatalog", () => {
  it("отдаёт список видов", async () => {
    const catalog = new GetCatalog(makeRepo());
    const list = await catalog.listSpecies();
    expect(list[0]?.id).toBe("cat");
  });

  it("бросает ошибку, если формы вида нет", async () => {
    const catalog = new GetCatalog(makeRepo({ getForm: async () => null }));
    await expect(catalog.formOptions("fox")).rejects.toBeInstanceOf(UnknownSpeciesError);
  });

  it("собирает поля формы", async () => {
    const catalog = new GetCatalog(makeRepo());
    const form = await catalog.formOptions("cat");
    expect(form.sounds[0]?.id).toBe("meow");
  });
});
