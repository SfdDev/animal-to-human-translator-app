import { describe, expect, it } from "vitest";
import { UnknownSpeciesError } from "./errors.js";
import { GetCatalog } from "./get-catalog.js";
import { makeRepo, makeRule } from "./test-helpers.js";

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
    const catalog = new GetCatalog(
      makeRepo({
        listRules: async () => [
          makeRule({ sound_id: "meow", context_id: "food" }),
          makeRule({ id: "r2", sound_id: "howl", context_id: "agonistic" }),
        ],
      }),
    );
    const form = await catalog.formOptions("cat");
    expect(form.sounds[0]?.id).toBe("meow");
    expect(form.bySound.meow?.contexts).toEqual(["food"]);
    expect(form.bySound.howl?.contexts).toEqual(["agonistic"]);
  });
});
