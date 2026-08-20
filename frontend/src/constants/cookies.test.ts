import { describe, expect, it } from "vitest";
import { COOKIE_CONSENT_KEY, defaultConsent, parseConsent } from "./cookies";

describe("cookie consent", () => {
  it("парсит сохранённое согласие", () => {
    const raw = JSON.stringify(defaultConsent({ analytics: true, marketing: false }));
    const parsed = parseConsent(raw);
    expect(parsed?.analytics).toBe(true);
    expect(parsed?.marketing).toBe(false);
    expect(parsed?.necessary).toBe(true);
  });

  it("отклоняет битый json", () => {
    expect(parseConsent("{")).toBeNull();
  });

  it("использует стабильный ключ хранения", () => {
    expect(COOKIE_CONSENT_KEY).toBe("translator-cookie-consent");
  });
});
