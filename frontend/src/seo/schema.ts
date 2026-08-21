import { SPECIES_IDS } from "../constants/species";
import { FAQ_PAGE } from "../content/faq";
import type { Article } from "../content/types";
import {
  HOME_FAQ,
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SPECIES_SEO,
  absoluteUrl,
  type SeoPage,
} from "./site";

function breadcrumbsFor(page: SeoPage): Array<{ name: string; path: string }> {
  const crumbs = [{ name: SITE_NAME, path: "/" }];
  if (page.path === "/") return crumbs;

  if (page.path.startsWith("/perevod")) {
    crumbs.push({ name: "Перевод", path: "/perevod" });
    if (page.speciesId && page.path !== "/perevod") {
      crumbs.push({ name: SPECIES_SEO[page.speciesId].name, path: page.path });
    }
    return crumbs;
  }

  if (page.path.startsWith("/guides")) {
    crumbs.push({ name: "Справочник", path: "/guides" });
    if (page.speciesId && page.path !== "/guides") {
      crumbs.push({ name: SPECIES_SEO[page.speciesId].name, path: page.path });
    }
    return crumbs;
  }

  if (page.path.startsWith("/articles")) {
    crumbs.push({ name: "Статьи", path: "/articles" });
    if (page.path !== "/articles") {
      crumbs.push({ name: page.title, path: page.path });
    }
    return crumbs;
  }

  if (page.path.endsWith(".pdf")) {
    crumbs.push({ name: page.title, path: page.path });
    return crumbs;
  }

  crumbs.push({ name: page.title, path: page.path });
  return crumbs;
}

export function jsonLdGraph(
  page: SeoPage,
  origin: string,
  article?: Article,
): Record<string, unknown> {
  const pageUrl = absoluteUrl(page.path, origin);
  const websiteId = `${origin}/#website`;
  const appId = `${origin}/#app`;
  const crumbs = breadcrumbsFor(page);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: SITE_NAME,
      url: `${origin}/`,
      inLanguage: SITE_LANGUAGE,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebApplication",
      "@id": appId,
      name: SITE_NAME,
      url: `${origin}/`,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      inLanguage: SITE_LANGUAGE,
      description: SITE_DESCRIPTION,
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "RUB",
      },
      isPartOf: { "@id": websiteId },
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: page.title,
      description: page.description,
      inLanguage: SITE_LANGUAGE,
      isPartOf: { "@id": websiteId },
      about: page.speciesId
        ? {
            "@type": "Animal",
            name: SPECIES_SEO[page.speciesId].name,
            scientificName: SPECIES_SEO[page.speciesId].latin,
            description: SPECIES_SEO[page.speciesId].about,
          }
        : {
            "@type": "Thing",
            name: "Сигналы животных",
            description: SITE_DESCRIPTION,
          },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path, origin),
      })),
    },
  ];

  if (article) {
    graph.push({
      "@type": "Article",
      "@id": `${pageUrl}#article`,
      headline: article.seoTitle ?? article.title,
      description: article.seoDescription ?? article.description,
      datePublished: article.published,
      inLanguage: SITE_LANGUAGE,
      isPartOf: { "@id": `${pageUrl}#webpage` },
      about: page.speciesId
        ? {
            "@type": "Animal",
            name: SPECIES_SEO[page.speciesId].name,
            scientificName: SPECIES_SEO[page.speciesId].latin,
          }
        : undefined,
    });
  }

  if (page.path === "/") {
    graph.push({
      "@type": "ItemList",
      name: "Виды",
      itemListElement: SPECIES_IDS.map((id, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: SPECIES_SEO[id].name,
        url: absoluteUrl(`/perevod/${id}`, origin),
      })),
    });
    graph.push({
      "@type": "FAQPage",
      "@id": `${origin}/#faq`,
      mainEntity: HOME_FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  if (page.path === "/faq") {
    graph.push({
      "@type": "FAQPage",
      "@id": `${origin}/faq#faq`,
      mainEntity: FAQ_PAGE.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
