import { describe, expect, it } from "vitest";
import { ARTICLES, articleBySlug } from "./articles";
import { FAQ_PAGE, HOME_FAQ } from "./faq";
import { SPECIES_GUIDES, guideBySpecies } from "./guides";

describe("content", () => {
  it("FAQ на странице шире, чем на главной", () => {
    expect(FAQ_PAGE.length).toBeGreaterThan(HOME_FAQ.length);
  });

  it("есть справочники для всех видов", () => {
    expect(guideBySpecies("cat")?.heading).toMatch(/кошк/i);
    expect(guideBySpecies("dog")).toBe(SPECIES_GUIDES.dog);
    expect(guideBySpecies("fox")).toBeUndefined();
  });

  it("статьи имеют уникальные slug и доступны по id", () => {
    const slugs = ARTICLES.map((article) => article.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(articleBySlug("myaukanie-u-dveri")?.speciesId).toBe("cat");
    expect(articleBySlug("no-such")).toBeUndefined();
  });

  it("категории фильтруют статьи: все / кошки / собаки / курицы", async () => {
    const { articlesByCategory, ARTICLES: all } = await import("./articles");
    const categories = articlesByCategory();
    expect(categories.map((c) => c.id)).toEqual(["all", "cat", "dog", "chicken"]);
    expect(categories[0]!.articles).toHaveLength(all.length);
    expect(categories[1]!.articles.every((a) => a.speciesId === "cat")).toBe(true);
    expect(categories[2]!.articles.every((a) => a.speciesId === "dog")).toBe(true);
    expect(categories[3]!.articles.every((a) => a.speciesId === "chicken")).toBe(true);
  });

  it("пагинирует статьи по 4 на страницу", async () => {
    const {
      ARTICLES: all,
      ARTICLES_PER_PAGE,
      articlePageCount,
      paginateArticles,
      parseArticlePage,
    } = await import("./articles");
    expect(ARTICLES_PER_PAGE).toBe(4);
    expect(parseArticlePage("2")).toBe(2);
    expect(parseArticlePage("0")).toBe(1);
    expect(articlePageCount(all.length)).toBe(Math.ceil(all.length / 4));
    expect(paginateArticles(all, 1)).toHaveLength(Math.min(4, all.length));
    expect(paginateArticles(all, 2).length).toBe(Math.max(0, all.length - 4));
  });

  it("предлагает связанные статьи того же вида", async () => {
    const { relatedArticles } = await import("./articles");
    const related = relatedArticles("myaukanie-u-dveri");
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((a) => a.speciesId === "cat")).toBe(true);
    expect(related.some((a) => a.slug === "myaukanie-u-dveri")).toBe(false);
    expect(relatedArticles("pishchevoi-krik-kuritsy")).toEqual([]);
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
