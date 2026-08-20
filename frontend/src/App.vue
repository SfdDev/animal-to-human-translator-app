<script setup lang="ts">
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import CookieBanner from "./components/CookieBanner.vue";
import ScrollTopButton from "./components/ScrollTopButton.vue";
import { TRANSLATE_PATH } from "./constants/species";

const route = useRoute();
const showFooter = computed(() => !route.path.startsWith(TRANSLATE_PATH));
const isTranslate = computed(() => route.path.startsWith(TRANSLATE_PATH));
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell-translate': isTranslate }">
    <SiteHeader />
    <div class="app-main">
      <RouterView />
    </div>
    <SiteFooter v-if="showFooter" />
    <CookieBanner />
    <ScrollTopButton />
  </div>
</template>
