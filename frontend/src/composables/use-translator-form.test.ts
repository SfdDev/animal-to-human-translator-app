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
  sounds: [{ id: "meow", label: "Мяу" }],
  contexts: [{ id: "food", label: "Еда" }],
  behaviors: [],
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
    });
    await flushPromises();
    expect(wrapper.vm.opts?.sounds[0]?.id).toBe("bark");
  });
});
