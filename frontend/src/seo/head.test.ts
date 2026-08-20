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
    expect(document.title).toBe(
      `Что означает мяукание и другие звуки кошки | ${SITE_NAME}`,
    );
  });
});
