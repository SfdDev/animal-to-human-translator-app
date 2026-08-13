import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchForm, fetchSpecies, interpret } from "../api/translator";
import { TRANSLATE_PATH } from "../constants/species";
import type { FormOptions, InterpretResult, Species } from "../types/translator";
import HomeView from "./HomeView.vue";
import TranslatorView from "./TranslatorView.vue";

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
  logic_label: "Сигнал к человеку",
  logic_note: "Мяу — запрос.",
};

const form: FormOptions = {
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
  function: "Привлечение человека в контексте корма",
  state: "Предвкушение / требование",
  sources: [{ id: "s1", title: "Статья" }],
  alternatives: [
    {
      gloss: "Иначе.",
      confidence: 0.4,
      fit: "weak",
      why: "из статьи",
      weak: true,
    },
  ],
};

async function mountTranslator(path: string) {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "home", component: HomeView },
      {
        path: `${TRANSLATE_PATH}/:speciesId?`,
        name: "translate",
        component: TranslatorView,
      },
    ],
  });
  await router.push(path);
  return {
    wrapper: mount(TranslatorView, { global: { plugins: [pinia, router] } }),
    router,
  };
}

describe("TranslatorView", () => {
  beforeEach(() => {
    vi.mocked(fetchSpecies).mockResolvedValue([species]);
    vi.mocked(fetchForm).mockResolvedValue(form);
    vi.mocked(interpret).mockResolvedValue(result);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("показывает виды и заметку логики из формы", async () => {
    const { wrapper } = await mountTranslator("/perevod/cat");
    await flushPromises();
    expect(wrapper.text()).toContain("Кошка");
    expect(wrapper.text()).toContain("Сигнал к человеку");
    expect(wrapper.get(".den").attributes("href")).toBe("/");
  });

  it("показывает перевод, функцию, состояние и уверенность", async () => {
    const { wrapper } = await mountTranslator("/perevod/cat");
    await flushPromises();
    await wrapper.get("select").setValue("meow");
    await wrapper.get("button.go").trigger("click");
    await flushPromises();
    expect(wrapper.text()).toContain("Запрос к человеку.");
    expect(wrapper.text()).toContain("Привлечение человека в контексте корма");
    expect(wrapper.text()).toContain("Предвкушение / требование");
    expect(wrapper.text()).toContain("Уверенность 60%");
    expect(wrapper.text()).toContain("Уверенность 40%");
    const resultHtml = wrapper.get(".result").html();
    expect(resultHtml.indexOf("confidence")).toBeLessThan(resultHtml.indexOf('class="bar"'));
    expect(wrapper.get(".bar span").attributes("style")).toContain("60%");
  });
});
