import { createRouter, createWebHistory, type RouteLocationNormalized } from "vue-router";
import { applySeo } from "../seo/head";
import {
  ARTICLES_PATH,
  FAQ_PATH,
  GUIDES_PATH,
  HOW_IT_WORKS_PATH,
} from "../constants/paths";
import { isSpeciesId, TRANSLATE_PATH } from "../constants/species";
import { articleBySlug } from "../content/articles";
import ArticleView from "../views/ArticleView.vue";
import ArticlesIndexView from "../views/ArticlesIndexView.vue";
import FaqView from "../views/FaqView.vue";
import GuideView from "../views/GuideView.vue";
import GuidesIndexView from "../views/GuidesIndexView.vue";
import HomeView from "../views/HomeView.vue";
import HowItWorksView from "../views/HowItWorksView.vue";
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

function guardGuide(to: RouteLocationNormalized) {
  const raw = to.params.speciesId;
  if (!isSpeciesId(String(raw))) return { name: "guides" as const };
  return true;
}

function guardArticle(to: RouteLocationNormalized) {
  const slug = String(to.params.slug ?? "");
  if (!articleBySlug(slug)) return { name: "articles" as const };
  return true;
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: `${TRANSLATE_PATH}/:speciesId?`,
      name: "translate",
      component: TranslatorView,
      beforeEnter: guardSpecies,
    },
    {
      path: FAQ_PATH,
      name: "faq",
      component: FaqView,
    },
    {
      path: HOW_IT_WORKS_PATH,
      name: "how-it-works",
      component: HowItWorksView,
    },
    {
      path: GUIDES_PATH,
      name: "guides",
      component: GuidesIndexView,
    },
    {
      path: `${GUIDES_PATH}/:speciesId`,
      name: "guide",
      component: GuideView,
      beforeEnter: guardGuide,
    },
    {
      path: ARTICLES_PATH,
      name: "articles",
      component: ArticlesIndexView,
    },
    {
      path: `${ARTICLES_PATH}/page/:page(\\d+)`,
      name: "articles-page",
      component: ArticlesIndexView,
    },
    {
      path: `${ARTICLES_PATH}/:slug`,
      name: "article",
      component: ArticleView,
      beforeEnter: guardArticle,
    },
    { path: "/cat", redirect: `${TRANSLATE_PATH}/cat` },
    { path: "/dog", redirect: `${TRANSLATE_PATH}/dog` },
    { path: "/chicken", redirect: `${TRANSLATE_PATH}/chicken` },
    { path: "/kak-rabotaet", redirect: HOW_IT_WORKS_PATH },
    { path: "/spravochnik", redirect: GUIDES_PATH },
    {
      path: "/spravochnik/:speciesId",
      redirect: (to) => `${GUIDES_PATH}/${String(to.params.speciesId)}`,
    },
    { path: "/stati", redirect: ARTICLES_PATH },
    {
      path: "/stati/:slug",
      redirect: (to) => `${ARTICLES_PATH}/${String(to.params.slug)}`,
    },
    { path: "/docs", redirect: "/" },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

router.afterEach((to) => {
  applySeo(to);
});
