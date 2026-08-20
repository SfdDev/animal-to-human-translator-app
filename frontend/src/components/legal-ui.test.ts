import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { beforeEach, describe, expect, it } from "vitest";
import CookieBanner from "./CookieBanner.vue";
import SiteFooter from "./SiteFooter.vue";
import SiteHeader from "./SiteHeader.vue";
import { COOKIE_CONSENT_KEY } from "../constants/cookies";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: { template: "<div/>" } },
    { path: "/faq", name: "faq", component: { template: "<div/>" } },
    { path: "/articles", name: "articles", component: { template: "<div/>" } },
    { path: "/guides", name: "guides", component: { template: "<div/>" } },
    { path: "/how-it-works", name: "how", component: { template: "<div/>" } },
    { path: "/perevod", name: "translate", component: { template: "<div/>" } },
  ],
});

describe("SiteHeader", () => {
  it("показывает бренд и основные разделы", async () => {
    await router.push("/");
    const wrapper = mount(SiteHeader, { global: { plugins: [router] } });
    expect(wrapper.find(".site-brand").attributes("href")).toBe("/");
    expect(wrapper.find('a[href="/"]').exists()).toBe(true);
    expect(wrapper.text()).toMatch(/Главная/);
    expect(wrapper.find('a[href="/perevod"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/guides"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/articles"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/faq"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/how-it-works"]').exists()).toBe(true);
  });

  it("подсвечивает активный раздел", async () => {
    await router.push("/articles");
    const wrapper = mount(SiteHeader, { global: { plugins: [router] } });
    expect(wrapper.find('a[href="/articles"]').classes()).toContain("on");
  });
});

describe("SiteFooter", () => {
  it("содержит навигацию, PDF и дисклеймер", () => {
    const wrapper = mount(SiteFooter, { global: { plugins: [router] } });
    expect(wrapper.text()).toMatch(/ветеринара/);
    expect(wrapper.text()).not.toMatch(/Юридические документы/);
    expect(wrapper.find('a[href="/privacy"]').exists()).toBe(false);
    expect(wrapper.find('a[href="/faq"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/articles"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/docs/politika-konfidencialnosti.pdf"]').exists()).toBe(true);
    expect(wrapper.find('a[href="/docs/politika-cookie.pdf"]').exists()).toBe(true);
    expect(
      wrapper.find('a[href="/docs/politika-konfidencialnosti.pdf"]').attributes("target"),
    ).toBeUndefined();
  });
});

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("показывает баннер без сохранённого согласия", async () => {
    const wrapper = mount(CookieBanner, { global: { plugins: [router] } });
    await flushPromises();
    expect(wrapper.find(".cookie-banner").exists()).toBe(true);
    expect(wrapper.text()).toMatch(/Cookie/);
    expect(wrapper.find('a[href="/docs/politika-cookie.pdf"]').exists()).toBe(true);
  });

  it("скрывается после «Только необходимые»", async () => {
    const wrapper = mount(CookieBanner, { global: { plugins: [router] } });
    await flushPromises();
    await wrapper.get(".cookie-banner-actions button:nth-child(2)").trigger("click");
    expect(wrapper.find(".cookie-banner").exists()).toBe(false);
    const saved = JSON.parse(localStorage.getItem(COOKIE_CONSENT_KEY) ?? "{}") as {
      analytics: boolean;
      marketing: boolean;
    };
    expect(saved.analytics).toBe(false);
    expect(saved.marketing).toBe(false);
  });

  it("не показывается повторно после выбора", async () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        decidedAt: new Date().toISOString(),
      }),
    );
    const wrapper = mount(CookieBanner, { global: { plugins: [router] } });
    await flushPromises();
    expect(wrapper.find(".cookie-banner").exists()).toBe(false);
  });
});
