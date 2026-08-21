import type { Article, ContentBlock } from "../content/types";
import type { SpeciesId } from "../constants/species";
import { isSpeciesId } from "../constants/species";

type StrapiArticleAttrs = {
  title?: string;
  slug?: string;
  summary?: string;
  description?: string;
  speciesId?: string;
  published?: string;
  body?: unknown;
  translateSoundHint?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type StrapiListResponse = {
  data?: Array<{ id?: number; documentId?: string; attributes?: StrapiArticleAttrs } & StrapiArticleAttrs>;
};

function strapiBaseUrl(): string {
  const viteEnv =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_STRAPI_URL
      : undefined;
  const nodeEnv = typeof process !== "undefined" ? process.env.VITE_STRAPI_URL : undefined;
  return String(viteEnv ?? nodeEnv ?? "")
    .trim()
    .replace(/\/$/, "");
}

function isContentBlock(value: unknown): value is ContentBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as { type?: string; text?: unknown; items?: unknown };
  if (block.type === "p" || block.type === "h2") return typeof block.text === "string";
  if (block.type === "ul") return Array.isArray(block.items) && block.items.every((i) => typeof i === "string");
  return false;
}

function normalizeBody(raw: unknown): ContentBlock[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(isContentBlock);
}

function unwrap(row: StrapiListResponse["data"] extends (infer U)[] | undefined ? U : never): StrapiArticleAttrs {
  if (!row) return {};
  if (row.attributes && typeof row.attributes === "object") return row.attributes;
  return row;
}

export function mapStrapiArticle(row: unknown): Article | null {
  if (!row || typeof row !== "object") return null;
  const attrs = unwrap(row as never);
  const slug = attrs.slug?.trim();
  const title = attrs.title?.trim();
  const speciesId = attrs.speciesId;
  if (!slug || !title || !speciesId || !isSpeciesId(speciesId)) return null;
  const body = normalizeBody(attrs.body);
  if (body.length === 0) return null;
  return {
    slug,
    title,
    description: attrs.description?.trim() || attrs.summary?.trim() || title,
    summary: attrs.summary?.trim() || attrs.description?.trim() || title,
    speciesId: speciesId as SpeciesId,
    published: attrs.published?.trim() || new Date().toISOString().slice(0, 10),
    translateSoundHint: attrs.translateSoundHint?.trim() || undefined,
    body,
    seoTitle: attrs.seoTitle?.trim() || undefined,
    seoDescription: attrs.seoDescription?.trim() || undefined,
  };
}

export async function fetchStrapiArticles(): Promise<Article[] | null> {
  const base = strapiBaseUrl();
  if (!base) return null;
  try {
    const url = `${base}/api/articles?pagination[pageSize]=100&sort=published:desc&status=published`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as StrapiListResponse;
    const rows = Array.isArray(json.data) ? json.data : [];
    const articles = rows.map(mapStrapiArticle).filter((a): a is Article => Boolean(a));
    return articles.length > 0 ? articles : null;
  } catch {
    return null;
  }
}

export async function fetchStrapiArticleBySlug(slug: string): Promise<Article | null> {
  const base = strapiBaseUrl();
  if (!base || !slug) return null;
  try {
    const url = `${base}/api/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1&status=published`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = (await res.json()) as StrapiListResponse;
    const row = json.data?.[0];
    return row ? mapStrapiArticle(row) : null;
  } catch {
    return null;
  }
}
