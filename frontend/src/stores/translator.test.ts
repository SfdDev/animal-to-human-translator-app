import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useTranslatorStore } from "./translator";

describe("useTranslatorStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("считает форму пустой", () => {
    const store = useTranslatorStore();
    expect(store.formEmpty).toBe(true);
    store.soundId = "meow";
    expect(store.formEmpty).toBe(false);
  });

  it("сбрасывает поля при смене вида", () => {
    const store = useTranslatorStore();
    store.adoptSpecies("cat");
    store.soundId = "meow";
    store.adoptSpecies("dog");
    expect(store.soundId).toBe("");
    expect(store.speciesId).toBe("dog");
  });

  it("не сбрасывает поля при том же виде", () => {
    const store = useTranslatorStore();
    store.adoptSpecies("cat");
    store.soundId = "meow";
    store.adoptSpecies("cat");
    expect(store.soundId).toBe("meow");
  });

  it("убирает значения, которых нет в форме", () => {
    const store = useTranslatorStore();
    store.soundId = "gone";
    store.contextId = "food";
    store.pruneInvalid({
      species: {
        id: "cat",
        name: "Кошка",
        latin: "",
        logic: "",
        logic_label: "",
        logic_note: "",
      },
      sounds: [{ id: "meow", label: "Мяу" }],
      contexts: [{ id: "food", label: "Еда" }],
      behaviors: [],
      bySound: {},
    });
    expect(store.soundId).toBe("");
    expect(store.contextId).toBe("food");
    expect(store.result).toBeNull();
  });

  it("очищает сессию при уходе со страницы", () => {
    const store = useTranslatorStore();
    store.adoptSpecies("cat");
    store.soundId = "meow";
    store.leavePage();
    expect(store.speciesId).toBe("");
    expect(store.soundId).toBe("");
    expect(store.formEmpty).toBe(true);
  });
});
