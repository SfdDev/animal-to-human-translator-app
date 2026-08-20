/** Публичные пути контентных страниц. */
export const FAQ_PATH = "/faq";
export const HOW_IT_WORKS_PATH = "/how-it-works";
export const GUIDES_PATH = "/guides";
export const ARTICLES_PATH = "/articles";

/** Статические PDF: /docs/<slug>.pdf */
export const DOCS_PATH = "/docs";

export function guidePath(speciesId: string): string {
  return `${GUIDES_PATH}/${speciesId}`;
}

export function articlePath(slug: string): string {
  return `${ARTICLES_PATH}/${slug}`;
}

/** Список статей: /articles, /articles/page/2, опционально ?category=cat */
export function articlesIndexLocation(page = 1, category: string = "all") {
  const query = category !== "all" ? { category } : {};
  if (page <= 1) {
    return { path: ARTICLES_PATH, query };
  }
  return { path: `${ARTICLES_PATH}/page/${page}`, query };
}

/** Файл PDF — /docs/politika-cookie.pdf */
export function docPdfPath(slug: string): string {
  return `${DOCS_PATH}/${slug}.pdf`;
}
