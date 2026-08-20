import { describe, expect, it } from "vitest";
import { llmsTxt, robotsTxt, sitemapXml } from "./files";
import { jsonLdGraph } from "./schema";
import { seoForRoute, seoPages, siteOrigin } from "./site";

const origin = "https://example.test";

describe("seo pages", () => {
  it("держит главную, перевод, контент и виды", () => {
    const paths = seoPages().map((page) => page.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/perevod");
    expect(paths).toContain("/faq");
    expect(paths).toContain("/how-it-works");
    expect(paths).toContain("/guides");
    expect(paths).toContain("/guides/cat");
    expect(paths).toContain("/articles");
    expect(paths).toContain("/articles/myaukanie-u-dveri");
    expect(paths).toContain("/docs/politika-konfidencialnosti.pdf");
    expect(paths).toContain("/docs/politika-cookie.pdf");
    expect(paths).not.toContain("/docs/myaukanie-u-dveri.pdf");
    expect(paths).not.toContain("/privacy");
    expect(paths).toContain("/perevod/dog");
  });

  it("берёт карточку вида по пути перевода", () => {
    expect(seoForRoute("/perevod/cat", "cat").title).toBe(
      "Что означает мяукание и другие звуки кошки",
    );
  });

  it("берёт справочник вида по пути", () => {
    expect(seoForRoute("/guides/dog", "dog").title).toBe("Справочник сигналов собаки");
  });
});

describe("static seo files", () => {
  it("указывает sitemap в robots", () => {
    expect(robotsTxt(origin)).toContain("Sitemap: https://example.test/sitemap.xml");
    expect(robotsTxt(origin)).toContain("Disallow: /api/");
  });

  it("кладёт абсолютные адреса в sitemap", () => {
    const xml = sitemapXml(origin);
    expect(xml).toContain("<loc>https://example.test/</loc>");
    expect(xml).toContain("<loc>https://example.test/perevod/dog</loc>");
    expect(xml).toContain("<loc>https://example.test/articles/myaukanie-u-dveri</loc>");
    expect(xml).toContain("<loc>https://example.test/docs/politika-konfidencialnosti.pdf</loc>");
    expect(xml).not.toContain("<loc>https://example.test/docs/myaukanie-u-dveri.pdf</loc>");
  });

  it("описывает сайт для моделей", () => {
    expect(llmsTxt(origin)).toContain("# Перевод сигналов животных");
    expect(llmsTxt(origin)).toContain("https://example.test/llms-full.txt");
    expect(llmsTxt(origin)).toContain("/faq");
    expect(llmsTxt(origin)).toContain("/articles");
  });
});

describe("json-ld", () => {
  it("собирает WebSite и WebApplication", () => {
    const graph = jsonLdGraph(seoForRoute("/"), origin);
    const types = (graph["@graph"] as Array<{ "@type": string }>).map((node) => node["@type"]);
    expect(types).toContain("WebSite");
    expect(types).toContain("WebApplication");
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("ItemList");
    expect(types).toContain("FAQPage");
  });

  it("для вида указывает Animal", () => {
    const graph = jsonLdGraph(seoForRoute("/perevod/chicken", "chicken"), origin);
    const page = (graph["@graph"] as Array<{ about?: { scientificName?: string } }>).find(
      (node) => node.about?.scientificName,
    );
    expect(page?.about?.scientificName).toBe("Gallus gallus domesticus");
  });

  it("для FAQ страницы добавляет FAQPage", () => {
    const graph = jsonLdGraph(seoForRoute("/faq"), origin);
    const types = (graph["@graph"] as Array<{ "@type": string }>).map((node) => node["@type"]);
    expect(types).toContain("FAQPage");
  });
});

describe("siteOrigin", () => {
  it("без env остаётся локальным адресом", () => {
    expect(siteOrigin()).toMatch(/^https?:\/\//);
  });
});
