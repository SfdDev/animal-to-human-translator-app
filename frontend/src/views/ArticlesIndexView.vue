<script setup lang="ts">
import { computed, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import ContentPage from "../components/ContentPage.vue";
import { articlesIndexLocation } from "../constants/paths";
import {
  ARTICLES_PER_PAGE,
  articlePageCount,
  articlesByCategory,
  paginateArticles,
  parseArticleCategory,
  parseArticlePage,
  type ArticleCategoryId,
} from "../content/articles";
import { SPECIES_SEO } from "../seo/site";

const route = useRoute();
const router = useRouter();
const categories = articlesByCategory();

const activeId = computed(() => parseArticleCategory(route.query.category));

const activeCategory = computed(
  () => categories.find((category) => category.id === activeId.value) ?? categories[0]!,
);

const page = computed(() => {
  if (route.name === "articles-page") return parseArticlePage(route.params.page);
  return parseArticlePage(route.query.page);
});

const totalPages = computed(() => articlePageCount(activeCategory.value.articles.length));

const pageArticles = computed(() =>
  paginateArticles(activeCategory.value.articles, page.value, ARTICLES_PER_PAGE),
);

const pageNumbers = computed(() =>
  Array.from({ length: totalPages.value }, (_, index) => index + 1),
);

function setCategory(id: ArticleCategoryId): void {
  void router.push(articlesIndexLocation(1, id));
}

function pageLocation(pageNumber: number) {
  return articlesIndexLocation(pageNumber, activeId.value);
}

watch(
  [page, totalPages, activeId, () => route.name],
  ([currentPage, pages, category, routeName]) => {
    if (routeName === "articles-page" && currentPage < 2) {
      void router.replace(articlesIndexLocation(1, category));
      return;
    }
    if (currentPage > pages) {
      void router.replace(articlesIndexLocation(pages, category));
    }
  },
  { immediate: true },
);
</script>

<template>
  <ContentPage>
    <p class="kicker">Статьи</p>
    <h1>Что означают сигналы в типичных ситуациях</h1>
    <p class="content-lede muted">
      Короткие разборы мяукания, лая и криков — с переходом к форме перевода. Не замена ветеринару.
    </p>

    <div class="article-category-nav" role="tablist" aria-label="Категории статей">
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        role="tab"
        class="article-category-tab"
        :class="{ on: category.id === activeId }"
        :aria-selected="category.id === activeId"
        @click="setCategory(category.id)"
      >
        {{ category.title }}
      </button>
    </div>

    <ul class="article-list" role="tabpanel">
      <li v-for="article in pageArticles" :key="article.slug" class="article-card">
        <p class="note">{{ SPECIES_SEO[article.speciesId].name }}</p>
        <h2>
          <RouterLink :to="`/articles/${article.slug}`">{{ article.title }}</RouterLink>
        </h2>
        <p class="muted">{{ article.summary }}</p>
        <p class="article-card-actions">
          <RouterLink class="cta article-card-cta" :to="`/articles/${article.slug}`"
            >Читать статью</RouterLink
          >
        </p>
      </li>
    </ul>

    <nav v-if="totalPages > 1" class="article-pagination" aria-label="Страницы статей">
      <RouterLink v-if="page > 1" class="article-pagination-link" :to="pageLocation(page - 1)">
        ← Назад
      </RouterLink>
      <span v-else class="article-pagination-link disabled">← Назад</span>

      <RouterLink
        v-for="pageNumber in pageNumbers"
        :key="pageNumber"
        class="article-pagination-page"
        :class="{ on: pageNumber === page }"
        :to="pageLocation(pageNumber)"
        :aria-current="pageNumber === page ? 'page' : undefined"
      >
        {{ pageNumber }}
      </RouterLink>

      <RouterLink
        v-if="page < totalPages"
        class="article-pagination-link"
        :to="pageLocation(page + 1)"
      >
        Вперёд →
      </RouterLink>
      <span v-else class="article-pagination-link disabled">Вперёд →</span>
    </nav>
  </ContentPage>
</template>
