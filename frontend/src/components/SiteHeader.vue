<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import PawMark from "./PawMark.vue";
import { ARTICLES_PATH, FAQ_PATH, GUIDES_PATH, HOW_IT_WORKS_PATH } from "../constants/paths";
import { TRANSLATE_PATH } from "../constants/species";
import { SITE_NAME } from "../seo/site";

const route = useRoute();
const menuOpen = ref(false);

const links = [
  { to: "/", label: "Главная", match: "/" },
  { to: TRANSLATE_PATH, label: "Перевод", match: TRANSLATE_PATH },
  { to: GUIDES_PATH, label: "Справочник", match: GUIDES_PATH },
  { to: ARTICLES_PATH, label: "Статьи", match: ARTICLES_PATH },
  { to: FAQ_PATH, label: "FAQ", match: FAQ_PATH },
  { to: HOW_IT_WORKS_PATH, label: "Как работает", match: HOW_IT_WORKS_PATH },
] as const;

const brandActive = computed(() => route.path === "/");

function isActive(match: string): boolean {
  if (match === "/") return route.path === "/";
  return route.path === match || route.path.startsWith(`${match}/`);
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false;
  },
);
</script>

<template>
  <header class="site-header">
    <div class="site-header-inner">
      <RouterLink class="site-brand" to="/" :aria-current="brandActive ? 'page' : undefined">
        <PawMark />
        <span class="site-brand-text">{{ SITE_NAME }}</span>
      </RouterLink>

      <button
        type="button"
        class="site-nav-toggle"
        :aria-expanded="menuOpen"
        aria-controls="site-nav"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? "Закрыть" : "Меню" }}
      </button>

      <nav
        id="site-nav"
        class="site-nav"
        :class="{ open: menuOpen }"
        aria-label="Основная навигация"
      >
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="{ on: isActive(link.match) }"
          :aria-current="isActive(link.match) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
