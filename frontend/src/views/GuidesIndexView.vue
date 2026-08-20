<script setup lang="ts">
import { RouterLink } from "vue-router";
import ContentPage from "../components/ContentPage.vue";
import { SPECIES_GUIDES } from "../content/guides";
import { SPECIES_IDS } from "../constants/species";
import { SPECIES_SEO } from "../seo/site";

const guides = SPECIES_IDS.map((id) => SPECIES_GUIDES[id]);
</script>

<template>
  <ContentPage>
    <p class="kicker">Справочник</p>
    <h1>Сигналы по видам животных</h1>
    <p class="content-lede muted">
      Краткие обзоры логики кошки, собаки и курицы — и переход к переводу или статьям по ситуациям.
    </p>

    <div class="home-kinds content-kinds">
      <RouterLink
        v-for="guide in guides"
        :key="guide.speciesId"
        class="home-kind"
        :to="`/guides/${guide.speciesId}`"
      >
        <h3>{{ SPECIES_SEO[guide.speciesId].name }}</h3>
        <p class="note">{{ SPECIES_SEO[guide.speciesId].about }}</p>
        <p class="muted">{{ guide.lede }}</p>
        <span class="home-kind-go">Открыть справочник</span>
      </RouterLink>
    </div>
  </ContentPage>
</template>
