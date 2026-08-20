import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { defineComponent } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchForm, fetchSpecies, interpret } from "../api/translator";
import type { FormOptions, InterpretResult, Species } from "../types/translator";
import { useTranslatorForm } from "./use-translator-form";

vi.mock("../api/translator", () => ({
  fetchSpecies: vi.fn(),
  fetchForm: vi.fn(),
  interpret: vi.fn(),
}));

const species: Species = {
  id: "cat",
  name: "Кошка",
  latin: "",
  logic: "motivational_human",
  logic_label: "метка",
  logic_note: "заметка",
};

const catForm: FormOptions = {
  species,
  sounds: [
    { id: "meow", label: "Мяу" },
    { id: "howl", label: "Вой" },
  ],
  contexts: [
    { id: "food", label: "Еда" },
    { id: "agonistic", label: "Конфликт с другой кошкой" },
    { id: "door", label: "Дверь" },
  ],
  behaviors: [{ id: "approach", label: "Подходит" }],
  bySound: {
    meow: { contexts: ["food"], behaviors: ["approach"] },
    howl: { contexts: ["agonistic"], behaviors: [] },
  },
};

const result: InterpretResult = {
  species,
  input: { sound: "Мяу", context: "не указан", behavior: "не указано" },
  uncertain: false,
  confidence: 0.6,
  fit: "medium",
  gloss: "Запрос к человеку.",
  function: "запрос",
  state: "—",
  sources: [],
  alternatives: [],
};

async function mountForm(path: string) {
  const Comp = defineComponent({
    setup() {
      return useTranslatorForm();
    },
    template: `<div />`,
  });
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/perevod/:speciesId?", name: "translate", component: Comp }],
  });
  const pinia = createPinia();
  setActivePinia(pinia);
  await router.push(path);
  return {
    wrapper: mount(Comp, {
      global: { plugins: [pinia, router] },
    }),
    router,
  };
}

describe("useTranslatorForm", () => {
  beforeEach(() => {
    vi.mocked(fetchSpecies).mockResolvedValue([species]);
    vi.mocked(fetchForm).mockResolvedValue(catForm);
    vi.mocked(interpret).mockResolvedValue(result);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("грузит форму выбранного вида", async () => {
    const { wrapper } = await mountForm("/perevod/cat");
    await flushPromises();
    expect(wrapper.vm.ready).toBe(true);
    expect(wrapper.vm.opts?.sounds[0]?.id).toBe("meow");
    expect(fetchForm).toHaveBeenCalledWith("cat");
  });

  it("просит выбрать вид, если его нет", async () => {
    const { wrapper } = await mountForm("/perevod");
    await flushPromises();
    await wrapper.vm.onSubmit();
    expect(wrapper.vm.error).toBe("Выберите вид");
    expect(interpret).not.toHaveBeenCalled();
  });

  it("не вызывает API на пустой форме", async () => {
    const { wrapper } = await mountForm("/perevod/cat");
    await flushPromises();
    await wrapper.vm.onSubmit();
    expect(wrapper.vm.error).toBe("Введите данные в поля");
    expect(interpret).not.toHaveBeenCalled();
  });

  it("кладёт перевод в store", async () => {
    const { wrapper } = await mountForm("/perevod/cat");
    await flushPromises();
    wrapper.vm.store.soundId = "meow";
    await wrapper.vm.onSubmit();
    expect(wrapper.vm.store.result?.gloss).toBe("Запрос к человеку.");
    expect(wrapper.vm.store.result?.confidence).toBe(0.6);
    expect(wrapper.vm.store.result?.fit).toBe("medium");
  });

  it("фильтрует контексты по выбранному звуку", async () => {
    const { wrapper } = await mountForm("/perevod/cat");
    await flushPromises();
    expect(wrapper.vm.contextOptions).toEqual([]);
    expect(wrapper.vm.soundHint).toMatch(/Сначала выберите звук/);
    expect(wrapper.vm.contextDisabled).toBe(true);
    wrapper.vm.store.soundId = "howl";
    await flushPromises();
    expect(wrapper.vm.contextOptions.map((r: { id: string }) => r.id)).toEqual(["agonistic"]);
    expect(wrapper.vm.contextDisabled).toBe(false);
  });

  it("сбрасывает контекст, если он не подходит к звуку", async () => {
    const { wrapper } = await mountForm("/perevod/cat");
    await flushPromises();
    wrapper.vm.store.soundId = "meow";
    wrapper.vm.store.contextId = "food";
    wrapper.vm.store.soundId = "howl";
    await flushPromises();
    expect(wrapper.vm.store.contextId).toBe("");
  });

  it("блокирует поля, если у звука нет правил", async () => {
    vi.mocked(fetchForm).mockResolvedValueOnce({
      ...catForm,
      bySound: { meow: { contexts: [], behaviors: [] }, howl: { contexts: [], behaviors: [] } },
    });
    const { wrapper } = await mountForm("/perevod/cat");
    await flushPromises();
    wrapper.vm.store.soundId = "howl";
    await flushPromises();
    expect(wrapper.vm.contextOptions).toEqual([]);
    expect(wrapper.vm.contextDisabled).toBe(true);
    expect(wrapper.vm.behaviorDisabled).toBe(true);
  });

  it("фильтрует контексты для собаки", async () => {
    vi.mocked(fetchForm).mockResolvedValueOnce({
      species: { ...species, id: "dog", name: "Собака" },
      sounds: [
        { id: "bark", label: "Лай" },
        { id: "whine", label: "Скуление" },
      ],
      contexts: [
        { id: "disturbance", label: "Тревога" },
        { id: "isolation", label: "Одиночество" },
        { id: "walk", label: "Прогулка" },
      ],
      behaviors: [],
      bySound: {
        bark: { contexts: ["disturbance", "walk"], behaviors: [] },
        whine: { contexts: ["isolation"], behaviors: [] },
      },
    });
    const { wrapper } = await mountForm("/perevod/dog");
    await flushPromises();
    wrapper.vm.store.soundId = "bark";
    await flushPromises();
    expect(wrapper.vm.contextOptions.map((r: { id: string }) => r.id)).toEqual([
      "disturbance",
      "walk",
    ]);
  });

  it("сбрасывает поля вида, пока грузится другой", async () => {
    const { wrapper, router } = await mountForm("/perevod/cat");
    await flushPromises();
    expect(wrapper.vm.opts).not.toBeNull();

    let release!: (value: FormOptions) => void;
    vi.mocked(fetchForm).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          release = resolve;
        }),
    );
    await router.push("/perevod/dog");
    await flushPromises();
    expect(wrapper.vm.opts).toBeNull();

    release({
      species: { ...species, id: "dog", name: "Собака" },
      sounds: [{ id: "bark", label: "Лай" }],
      contexts: [],
      behaviors: [],
      bySound: { bark: { contexts: [], behaviors: [] } },
    });
    await flushPromises();
    expect(wrapper.vm.opts?.sounds[0]?.id).toBe("bark");
  });
});
