import { describe, expect, it } from "vitest";
import { llmsTxt, robotsTxt, sitemapXml } from "./files";
import { jsonLdGraph } from "./schema";
import { seoForRoute, seoPages, siteOrigin } from "./site";

const origin = "https://example.test";

describe("seo pages", () => {
  it("держит главную, перевод и три вида", () => {
    expect(seoPages().map((page) => page.path)).toEqual([
      "/",
      "/perevod",
      "/perevod/cat",
      "/perevod/dog",
      "/perevod/chicken",
    ]);
  });

  it("берёт карточку вида по id", () => {
    expect(seoForRoute("/perevod/cat", "cat").title).toBe("Перевод — кошка");
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
  });

  it("описывает сайт для моделей", () => {
    expect(llmsTxt(origin)).toContain("# Перевод сигналов животных");
    expect(llmsTxt(origin)).toContain("https://example.test/llms-full.txt");
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
  });

  it("для вида указывает Animal", () => {
    const graph = jsonLdGraph(seoForRoute("/perevod/chicken", "chicken"), origin);
    const page = (graph["@graph"] as Array<{ about?: { scientificName?: string } }>).find(
      (node) => node.about?.scientificName,
    );
    expect(page?.about?.scientificName).toBe("Gallus gallus domesticus");
  });
});

describe("siteOrigin", () => {
  it("без env остаётся локальным адресом", () => {
    expect(siteOrigin()).toMatch(/^https?:\/\//);
  });
});
