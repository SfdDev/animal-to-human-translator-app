<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ContentPage from "../components/ContentPage.vue";
import { articleBySlug } from "../content/article-queries";
import { listArticles } from "../content/article-repository";
import { guideBySpecies } from "../content/guides";
import type { Article } from "../content/types";
import { translateLocation } from "../router";
import { SPECIES_SEO } from "../seo/site";

const route = useRoute();
const articles = ref<Article[]>([]);

watch(
  () => route.params.speciesId,
  async () => {
    articles.value = await listArticles();
  },
  { immediate: true },
);

const guide = computed(() => guideBySpecies(String(route.params.speciesId ?? "")));
const species = computed(() => (guide.value ? SPECIES_SEO[guide.value.speciesId] : null));
const related = computed(() =>
  (guide.value?.relatedArticleSlugs ?? [])
    .map((slug) => articleBySlug(slug, articles.value))
    .filter((article): article is Article => Boolean(article)),
);
</script>

<template>
  <ContentPage v-if="guide && species" back-to="/guides" back-label="← К видам">
    <p class="kicker">{{ species.name }} · {{ species.latin }}</p>
    <h1>{{ guide.heading }}</h1>
    <p class="content-lede muted">{{ guide.lede }}</p>

    <section v-for="section in guide.sections" :key="section.heading" class="content-section">
      <h2>{{ section.heading }}</h2>
      <p v-for="(paragraph, index) in section.paragraphs" :key="index">{{ paragraph }}</p>
    </section>

    <section v-if="related.length" class="content-section">
      <h2>Статьи по ситуациям</h2>
      <ul>
        <li v-for="article in related" :key="article.slug">
          <RouterLink :to="`/articles/${article.slug}`">{{ article.title }}</RouterLink>
        </li>
      </ul>
    </section>

    <p class="content-cta-row">
      <RouterLink class="cta" :to="translateLocation(guide.speciesId)">
        Перевод сигналов {{ species.nameGenitive }}
      </RouterLink>
      <RouterLink class="content-text-link" to="/articles">Все статьи</RouterLink>
    </p>
  </ContentPage>
  <ContentPage v-else>
    <h1>Справочник не найден</h1>
    <p class="muted">Такого вида нет. Выберите кошку, собаку или курицу.</p>
    <RouterLink class="cta" to="/guides">К видам</RouterLink>
  </ContentPage>
</template>
