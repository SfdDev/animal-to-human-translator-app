import { beforeEach, describe, expect, it, vi } from "vitest";
import * as strapiApi from "../api/strapi-articles";
import { getArticle, listArticles } from "./article-repository";
import type { Article } from "./types";

const sample: Article = {
  slug: "test-article",
  title: "Тест",
  description: "Описание",
  summary: "Кратко",
  speciesId: "cat",
  published: "2026-01-01",
  body: [{ type: "p", text: "Текст" }],
  seoTitle: "SEO",
};

describe("article-repository", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("возвращает пустой список, если Strapi недоступен", async () => {
    vi.spyOn(strapiApi, "fetchStrapiArticles").mockResolvedValue(null);
    expect(await listArticles()).toEqual([]);
  });

  it("возвращает статьи из Strapi", async () => {
    vi.spyOn(strapiApi, "fetchStrapiArticles").mockResolvedValue([sample]);
    const list = await listArticles();
    expect(list).toHaveLength(1);
    expect(list[0]?.title).toBe("Тест");
  });

  it("возвращает undefined, если статьи нет", async () => {
    vi.spyOn(strapiApi, "fetchStrapiArticleBySlug").mockResolvedValue(null);
    expect(await getArticle("missing")).toBeUndefined();
  });
});

describe("mapStrapiArticle", () => {
  it("мапит плоский ответ Strapi 5", async () => {
    const { mapStrapiArticle } = await import("../api/strapi-articles");
    const mapped = mapStrapiArticle({
      title: "Тест",
      slug: "test-slug",
      summary: "Кратко",
      description: "Описание",
      speciesId: "dog",
      published: "2026-01-01",
      body: [{ type: "p", text: "Текст" }],
      seoTitle: "SEO title",
      seoDescription: "SEO desc",
    });
    expect(mapped).toMatchObject({
      slug: "test-slug",
      speciesId: "dog",
      seoTitle: "SEO title",
      seoDescription: "SEO desc",
    });
  });
});
