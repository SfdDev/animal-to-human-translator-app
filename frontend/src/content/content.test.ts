import { describe, expect, it } from "vitest";
import {
  articlesByCategory,
  parseArticleCategory,
} from "./article-categories";
import {
  ARTICLES_PER_PAGE,
  articlePageCount,
  paginateArticles,
  parseArticlePage,
} from "./article-pagination";
import { articleBySlug, relatedArticles } from "./article-queries";
import { FAQ_PAGE, HOME_FAQ } from "./faq";
import { SPECIES_GUIDES, guideBySpecies } from "./guides";
import type { Article } from "./types";

const sampleArticles: Article[] = [
  {
    slug: "cat-one",
    title: "Кошка 1",
    description: "d",
    summary: "s",
    speciesId: "cat",
    published: "2026-01-01",
    body: [{ type: "p", text: "t" }],
  },
  {
    slug: "cat-two",
    title: "Кошка 2",
    description: "d",
    summary: "s",
    speciesId: "cat",
    published: "2026-01-02",
    body: [{ type: "p", text: "t" }],
  },
  {
    slug: "dog-one",
    title: "Собака 1",
    description: "d",
    summary: "s",
    speciesId: "dog",
    published: "2026-01-03",
    body: [{ type: "p", text: "t" }],
  },
  {
    slug: "chicken-one",
    title: "Курица 1",
    description: "d",
    summary: "s",
    speciesId: "chicken",
    published: "2026-01-04",
    body: [{ type: "p", text: "t" }],
  },
  {
    slug: "cat-three",
    title: "Кошка 3",
    description: "d",
    summary: "s",
    speciesId: "cat",
    published: "2026-01-05",
    body: [{ type: "p", text: "t" }],
  },
];

describe("content", () => {
  it("FAQ на странице шире, чем на главной", () => {
    expect(FAQ_PAGE.length).toBeGreaterThan(HOME_FAQ.length);
  });

  it("есть справочники для всех видов", () => {
    expect(guideBySpecies("cat")?.heading).toMatch(/кошк/i);
    expect(guideBySpecies("dog")).toBe(SPECIES_GUIDES.dog);
    expect(guideBySpecies("fox")).toBeUndefined();
  });

  it("статьи доступны по slug из переданного списка", () => {
    expect(articleBySlug("cat-one", sampleArticles)?.speciesId).toBe("cat");
    expect(articleBySlug("no-such", sampleArticles)).toBeUndefined();
  });

  it("категории фильтруют статьи: все / кошки / собаки / курицы", () => {
    const categories = articlesByCategory(sampleArticles);
    expect(categories.map((c) => c.id)).toEqual(["all", "cat", "dog", "chicken"]);
    expect(categories[0]!.articles).toHaveLength(sampleArticles.length);
    expect(categories[1]!.articles.every((a) => a.speciesId === "cat")).toBe(true);
    expect(categories[2]!.articles.every((a) => a.speciesId === "dog")).toBe(true);
    expect(categories[3]!.articles.every((a) => a.speciesId === "chicken")).toBe(true);
    expect(parseArticleCategory("dog")).toBe("dog");
    expect(parseArticleCategory("nope")).toBe("all");
  });

  it("пагинирует статьи по 4 на страницу", () => {
    expect(ARTICLES_PER_PAGE).toBe(4);
    expect(parseArticlePage("2")).toBe(2);
    expect(parseArticlePage("0")).toBe(1);
    expect(articlePageCount(sampleArticles.length)).toBe(Math.ceil(sampleArticles.length / 4));
    expect(paginateArticles(sampleArticles, 1)).toHaveLength(4);
    expect(paginateArticles(sampleArticles, 2)).toHaveLength(1);
  });

  it("предлагает связанные статьи того же вида", () => {
    const related = relatedArticles("cat-one", 6, sampleArticles);
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((a) => a.speciesId === "cat")).toBe(true);
    expect(related.some((a) => a.slug === "cat-one")).toBe(false);
    expect(relatedArticles("chicken-one", 6, sampleArticles)).toEqual([]);
  });

  it("юридические PDF отделены от статей", async () => {
    const { PDF_DOCUMENTS, pdfBySlug } = await import("./documents");
    expect(PDF_DOCUMENTS.map((d) => d.slug)).toEqual([
      "politika-konfidencialnosti",
      "politika-cookie",
      "soglasie-obrabotka-pdn",
      "polzovatelskoe-soglashenie",
    ]);
    expect(pdfBySlug("politika-konfidencialnosti")?.pdf).toBe(
      "/docs/politika-konfidencialnosti.pdf",
    );
    expect(pdfBySlug("myaukanie-u-dveri")).toBeUndefined();
  });
});
