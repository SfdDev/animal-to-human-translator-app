import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { applySeo } from "../seo/head";
import { isSpeciesId, TRANSLATE_PATH } from "../constants/species";
import HomeView from "../views/HomeView.vue";
import TranslatorView from "../views/TranslatorView.vue";

export function translateLocation(speciesId?: string) {
  if (speciesId && isSpeciesId(speciesId)) {
    return { name: "translate" as const, params: { speciesId } };
  }
  return { name: "translate" as const };
}

function guardSpecies(to: RouteLocationNormalized) {
  const raw = to.params.speciesId;
  if (raw == null || raw === "") return true;
  if (!isSpeciesId(String(raw))) return { name: "translate" as const };
  return true;
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Перевод сигналов животных" },
    },
    {
      path: `${TRANSLATE_PATH}/:speciesId?`,
      name: "translate",
      component: TranslatorView,
      beforeEnter: guardSpecies,
      meta: { title: "Перевод" },
    },
    { path: "/cat", redirect: `${TRANSLATE_PATH}/cat` },
    { path: "/dog", redirect: `${TRANSLATE_PATH}/dog` },
    { path: "/chicken", redirect: `${TRANSLATE_PATH}/chicken` },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  applySeo(to);
});
