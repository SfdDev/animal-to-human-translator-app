import { afterEach, describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { applySeo } from "./head";
import { HOME_TITLE, SITE_NAME } from "./site";

function route(path: string, speciesId?: string) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/:pathMatch(.*)*", component: { template: "<div />" } }],
  });
  return router.push(path).then(() => {
    const to = router.currentRoute.value;
    if (speciesId) {
      to.params.speciesId = speciesId;
    }
    applySeo(to);
    return to;
  });
}

describe("applySeo", () => {
  afterEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("ставит title, description и schema", async () => {
    await route("/");
    expect(document.title).toBe(`${HOME_TITLE} | ${SITE_NAME}`);
    expect(
      document.head.querySelector('meta[name="description"]')?.getAttribute("content"),
    ).toMatch(/научных статей/);
    const schema = document.getElementById("seo-schema")?.textContent ?? "";
    expect(schema).toContain("WebApplication");
    expect(schema).toContain("FAQPage");
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toMatch(
      /\/$/,
    );
  });

  it("для вида пишет заголовок перевода", async () => {
    await route("/perevod/cat", "cat");
    expect(document.title).toBe(`Что означает мяукание и другие звуки кошки | ${SITE_NAME}`);
  });
});

describe("applyArticleSeo", () => {
  afterEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("берёт seoTitle и seoDescription, если заданы", async () => {
    const { applyArticleSeo } = await import("./head");
    applyArticleSeo({
      slug: "test-slug",
      title: "Обычный заголовок",
      description: "Обычное описание",
      summary: "Кратко",
      speciesId: "cat",
      published: "2026-01-01",
      body: [{ type: "p", text: "Текст" }],
      seoTitle: "SEO заголовок статьи",
      seoDescription: "SEO описание статьи",
    });
    expect(document.title).toBe(`SEO заголовок статьи | ${SITE_NAME}`);
    expect(
      document.head.querySelector('meta[name="description"]')?.getAttribute("content"),
    ).toBe("SEO описание статьи");
    const schema = document.getElementById("seo-schema")?.textContent ?? "";
    expect(schema).toContain('"@type":"Article"');
    expect(schema).toContain("SEO заголовок статьи");
  });
});
