import { fetchStrapiArticleBySlug, fetchStrapiArticles } from "../api/strapi-articles";
import type { Article } from "./types";

/** Список опубликованных статей из Strapi. */
export async function listArticles(): Promise<Article[]> {
  return (await fetchStrapiArticles()) ?? [];
}

/** Статья по slug из Strapi. */
export async function getArticle(slug: string): Promise<Article | undefined> {
  const remote = await fetchStrapiArticleBySlug(slug);
  return remote ?? undefined;
}
