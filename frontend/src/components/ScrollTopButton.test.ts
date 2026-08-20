import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ScrollTopButton from "./ScrollTopButton.vue";

describe("ScrollTopButton", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("скрыта вверху страницы", async () => {
    const wrapper = mount(ScrollTopButton);
    await flushPromises();
    expect(wrapper.find(".scroll-top").exists()).toBe(false);
  });

  it("появляется после прокрутки и поднимает вверх", async () => {
    const scrollTo = vi.fn();
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo;
    Object.defineProperty(window, "scrollY", { value: 400, writable: true, configurable: true });

    const wrapper = mount(ScrollTopButton);
    window.dispatchEvent(new Event("scroll"));
    await flushPromises();

    const btn = wrapper.find(".scroll-top");
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
