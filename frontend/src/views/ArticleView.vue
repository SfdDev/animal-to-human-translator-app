<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import ContentPage from "../components/ContentPage.vue";
import { relatedArticles } from "../content/article-queries";
import { getArticle, listArticles } from "../content/article-repository";
import type { Article } from "../content/types";
import { articlesIndexLocation } from "../constants/paths";
import { translateLocation } from "../router";
import { applyArticleSeo } from "../seo/head";
import { SPECIES_SEO } from "../seo/site";

const route = useRoute();
const article = ref<Article | undefined>();
const allArticles = ref<Article[]>([]);
const loading = ref(true);

async function load(): Promise<void> {
  loading.value = true;
  const slug = String(route.params.slug ?? "");
  const [one, list] = await Promise.all([getArticle(slug), listArticles()]);
  article.value = one;
  allArticles.value = list;
  if (one) applyArticleSeo(one);
  loading.value = false;
}

watch(
  () => route.params.slug,
  () => {
    void load();
  },
  { immediate: true },
);

const species = computed(() => (article.value ? SPECIES_SEO[article.value.speciesId] : null));
const related = computed(() =>
  article.value ? relatedArticles(article.value.slug, 6, allArticles.value) : [],
);
</script>

<template>
  <ContentPage v-if="loading" back-to="/articles" back-label="← К статьям">
    <p class="muted">Загружаем статью…</p>
  </ContentPage>
  <ContentPage v-else-if="article && species" back-to="/articles" back-label="← К статьям">
    <p class="kicker">{{ species.name }} · статья</p>
    <h1>{{ article.title }}</h1>
    <p class="muted content-meta">Обновлено {{ article.published }}</p>
    <p class="content-lede muted">{{ article.summary }}</p>

    <template v-for="(block, index) in article.body" :key="index">
      <p v-if="block.type === 'p'">{{ block.text }}</p>
      <h2 v-else-if="block.type === 'h2'">{{ block.text }}</h2>
      <ul v-else-if="block.type === 'ul'">
        <li v-for="item in block.items" :key="item">{{ item }}</li>
      </ul>
    </template>

    <p class="legal-disclaimer">
      Информация носит образовательный характер и не заменяет консультацию ветеринара.
    </p>

    <p class="content-cta-row">
      <RouterLink class="cta" :to="translateLocation(article.speciesId)">
        Подобрать перевод для {{ species.nameGenitive }}
      </RouterLink>
      <RouterLink class="content-text-link" :to="`/guides/${article.speciesId}`">
        Справочник вида
      </RouterLink>
    </p>

    <section v-if="related.length" class="content-section related-articles">
      <h2>Статьи по теме</h2>
      <p class="muted">Другие материалы о {{ species.nameGenitive }}</p>
      <ul class="related-articles-list">
        <li v-for="item in related" :key="item.slug" class="related-articles-item">
          <RouterLink :to="`/articles/${item.slug}`">{{ item.title }}</RouterLink>
          <p class="muted">{{ item.summary }}</p>
        </li>
      </ul>
      <p class="related-articles-more">
        <RouterLink class="content-text-link" :to="articlesIndexLocation(1, article.speciesId)">
          Все статьи о {{ species.nameGenitive }}
        </RouterLink>
      </p>
    </section>
  </ContentPage>
  <ContentPage v-else back-to="/articles" back-label="← К статьям">
    <h1>Статья не найдена</h1>
    <p class="muted">Проверьте адрес или откройте список статей.</p>
    <RouterLink class="cta" to="/articles">Все статьи</RouterLink>
  </ContentPage>
</template>
