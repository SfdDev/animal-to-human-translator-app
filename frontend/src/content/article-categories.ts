import { articlesForSpecies } from "./article-queries";
import type { Article } from "./types";

export type ArticleCategoryId = "all" | "cat" | "dog" | "chicken";

export type ArticleCategory = {
  id: ArticleCategoryId;
  title: string;
  articles: Article[];
};

const CATEGORY_IDS: ArticleCategoryId[] = ["all", "cat", "dog", "chicken"];

/** Категории-фильтры: все / кошки / собаки / курицы. */
export function articlesByCategory(articles: Article[]): ArticleCategory[] {
  const categories: ArticleCategory[] = [
    { id: "all", title: "Все статьи", articles: [...articles] },
    { id: "cat", title: "Кошки", articles: articlesForSpecies("cat", articles) },
    { id: "dog", title: "Собаки", articles: articlesForSpecies("dog", articles) },
    { id: "chicken", title: "Курицы", articles: articlesForSpecies("chicken", articles) },
  ];
  return categories.filter((category) => category.articles.length > 0);
}

export function isArticleCategoryId(value: string): value is ArticleCategoryId {
  return (CATEGORY_IDS as string[]).includes(value);
}

export function parseArticleCategory(raw: unknown): ArticleCategoryId {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value === "string" && isArticleCategoryId(value)) return value;
  return "all";
}
