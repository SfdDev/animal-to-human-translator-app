import { beforeEach, describe, expect, it } from "vitest";
import { router, translateLocation } from "./index";

describe("translateLocation", () => {
  it("ведёт на перевод без вида", () => {
    expect(translateLocation()).toEqual({ name: "translate" });
  });

  it("ведёт на страницу вида", () => {
    expect(translateLocation("dog")).toEqual({ name: "translate", params: { speciesId: "dog" } });
  });

  it("игнорирует неизвестный вид", () => {
    expect(translateLocation("fox")).toEqual({ name: "translate" });
  });
});

describe("router", () => {
  beforeEach(async () => {
    await router.push("/");
  });

  it("редиректит старые пути видов", async () => {
    await router.push("/cat");
    expect(router.currentRoute.value.path).toBe("/perevod/cat");
  });

  it("сбрасывает неизвестный вид на /perevod", async () => {
    await router.push("/perevod/fox");
    expect(router.currentRoute.value.name).toBe("translate");
    expect(router.currentRoute.value.params.speciesId).toBeUndefined();
  });

  it("ставит заголовок страницы перевода", async () => {
    await router.push("/perevod/chicken");
    expect(document.title).toBe(
      "Что означают крики курицы: еда, опасность | Перевод сигналов животных",
    );
  });

  it("редиректит удалённую политику на главную", async () => {
    await router.push("/privacy");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("открывает FAQ и статьи", async () => {
    await router.push("/faq");
    expect(router.currentRoute.value.name).toBe("faq");
    expect(document.title).toMatch(/Частые вопросы/);

    await router.push("/articles/myaukanie-u-dveri");
    expect(router.currentRoute.value.name).toBe("article");
    expect(document.title).toMatch(/мяукание кошки у двери/);
  });

  it("открывает пагинацию статей по URL", async () => {
    await router.push("/articles/page/2");
    expect(router.currentRoute.value.name).toBe("articles-page");
    expect(router.currentRoute.value.params.page).toBe("2");
    expect(router.currentRoute.value.path).toBe("/articles/page/2");
  });

  it("неизвестный slug статьи ведёт к списку", async () => {
    await router.push("/articles/no-such-article");
    expect(router.currentRoute.value.name).toBe("articles");
  });

  it("редиректит старые русские URL контента", async () => {
    await router.push("/kak-rabotaet");
    expect(router.currentRoute.value.path).toBe("/how-it-works");
    await router.push("/spravochnik/cat");
    expect(router.currentRoute.value.path).toBe("/guides/cat");
    await router.push("/stati/myaukanie-u-dveri");
    expect(router.currentRoute.value.path).toBe("/articles/myaukanie-u-dveri");
  });

  it("редиректит /docs без файла на главную", async () => {
    await router.push("/docs");
    expect(router.currentRoute.value.path).toBe("/");
  });

  it("неизвестные адреса ведут на главную", async () => {
    await router.push("/no-such-page");
    expect(router.currentRoute.value.path).toBe("/");
  });
});
