import type { Article } from "./types";

export function articleBySlug(slug: string, articles: Article[]): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function articlesForSpecies(speciesId: string, articles: Article[]): Article[] {
  return articles.filter((article) => article.speciesId === speciesId);
}

/** Другие статьи того же вида, без текущей. */
export function relatedArticles(slug: string, limit: number, articles: Article[]): Article[] {
  const current = articleBySlug(slug, articles);
  if (!current) return [];
  return articlesForSpecies(current.speciesId, articles)
    .filter((article) => article.slug !== slug)
    .slice(0, limit);
}
