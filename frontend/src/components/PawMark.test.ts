import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import PawMark from "./PawMark.vue";

describe("PawMark", () => {
  it("рисует скрытую декоративную иконку", () => {
    const wrapper = mount(PawMark);
    expect(wrapper.find("svg").attributes("aria-hidden")).toBe("true");
  });
});
