export const ARTICLES_PER_PAGE = 4;

export function parseArticlePage(raw: unknown): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

export function articlePageCount(total: number, perPage = ARTICLES_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / perPage));
}

export function paginateArticles<T>(items: T[], page: number, perPage = ARTICLES_PER_PAGE): T[] {
  const safePage = Math.max(1, page);
  const start = (safePage - 1) * perPage;
  return items.slice(start, start + perPage);
}
