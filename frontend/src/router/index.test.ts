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
    expect(document.title).toBe("Перевод — курица | Перевод сигналов животных");
  });

  it("неизвестные адреса ведут на главную", async () => {
    await router.push("/no-such-page");
    expect(router.currentRoute.value.path).toBe("/");
  });
});
