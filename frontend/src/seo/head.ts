import type { RouteLocationNormalized } from "vue-router";
import type { Article } from "../content/types";
import { articlePath } from "../constants/paths";
import { jsonLdGraph } from "./schema";
import { SITE_LANGUAGE, SITE_LOCALE, SITE_NAME, pageTitle, seoForRoute, siteOrigin } from "./site";

const SCHEMA_ID = "seo-schema";

export function applySeo(to: RouteLocationNormalized): void {
  const origin = siteOrigin();
  const speciesId = typeof to.params.speciesId === "string" ? to.params.speciesId : undefined;
  const page = seoForRoute(to.path, speciesId);
  const url = `${origin}${page.path === "/" ? "/" : page.path}`;
  const title = pageTitle(page.title);

  document.title = title;
  document.documentElement.lang = SITE_LANGUAGE;

  setMeta("name", "description", page.description);
  setMeta("name", "robots", "index, follow");
  setMeta("name", "theme-color", "#12150f");
  setMeta("property", "og:type", "website");
  setMeta("property", "og:locale", SITE_LOCALE);
  setMeta("property", "og:site_name", SITE_NAME);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", page.description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", page.description);
  setLink("canonical", url);
  setLink("alternate", `${origin}/llms.txt`, { type: "text/plain", title: "LLMs" });
  setJsonLd(jsonLdGraph(page, origin));
}

/** SEO для статьи из Strapi/локального каталога (после async-загрузки). */
export function applyArticleSeo(article: Article): void {
  const origin = siteOrigin();
  const path = articlePath(article.slug);
  const titleText = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.description;
  const title = pageTitle(titleText);
  const url = `${origin}${path}`;

  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:type", "article");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setLink("canonical", url);
  setJsonLd(
    jsonLdGraph(
      {
        path,
        title: titleText,
        description,
        speciesId: article.speciesId,
      },
      origin,
      article,
    ),
  );
}

function setMeta(kind: "name" | "property", key: string, content: string): void {
  const selector = `meta[${kind}="${cssAttr(key)}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(kind, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string, extra: Record<string, string> = {}): void {
  const extraSel = Object.entries(extra)
    .map(([key, value]) => `[${key}="${cssAttr(value)}"]`)
    .join("");
  const selector = `link[rel="${cssAttr(rel)}"]${extraSel}`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    for (const [key, value] of Object.entries(extra)) el.setAttribute(key, value);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(data: Record<string, unknown>): void {
  let el = document.getElementById(SCHEMA_ID) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = SCHEMA_ID;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function cssAttr(value: string): string {
  return value.replaceAll('"', '\\"');
}
