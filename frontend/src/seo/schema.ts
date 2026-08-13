import { SPECIES_IDS } from "../constants/species";
import {
  SITE_DESCRIPTION,
  SITE_LANGUAGE,
  SITE_NAME,
  SPECIES_SEO,
  absoluteUrl,
  type SeoPage,
} from "./site";

export function jsonLdGraph(page: SeoPage, origin: string): Record<string, unknown> {
  const pageUrl = absoluteUrl(page.path, origin);
  const websiteId = `${origin}/#website`;
  const appId = `${origin}/#app`;
  const crumbs = [{ name: SITE_NAME, path: "/" }];
  if (page.path !== "/") {
    crumbs.push({ name: "Перевод", path: "/perevod" });
    if (page.speciesId) {
      crumbs.push({ name: SPECIES_SEO[page.speciesId].name, path: page.path });
    }
  }

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
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
