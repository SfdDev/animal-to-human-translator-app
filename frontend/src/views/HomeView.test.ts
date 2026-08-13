import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { createMemoryHistory, createRouter } from "vue-router";
import { describe, expect, it } from "vitest";
import { TRANSLATE_PATH } from "../constants/species";
import HomeView from "./HomeView.vue";

function mountHome() {
  const pinia = createPinia();
  setActivePinia(pinia);
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "home", component: HomeView },
      {
        path: `${TRANSLATE_PATH}/:speciesId?`,
        name: "translate",
        component: { template: "<div />" },
      },
    ],
  });
  return router.push("/").then(() => ({
    wrapper: mount(HomeView, { global: { plugins: [pinia, router] } }),
    router,
  }));
}

describe("HomeView", () => {
  it("ведёт «Попробовать» на перевод без вида", async () => {
    const { wrapper } = await mountHome();
    expect(wrapper.get(".cta").attributes("href")).toBe("/perevod");
  });

  it("карточки видов ведут на кошку, собаку и курицу", async () => {
    const { wrapper } = await mountHome();
    const hrefs = wrapper.findAll(".home-kind").map((card) => card.attributes("href"));
    expect(hrefs).toEqual(["/perevod/cat", "/perevod/dog", "/perevod/chicken"]);
  });
});
