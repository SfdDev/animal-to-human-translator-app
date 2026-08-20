import type { CookieConsent } from "../constants/cookies";

/** Подключать счётчики и рекламу только после согласия пользователя. */
export function applyConsentScripts(consent: CookieConsent): void {
  if (consent.analytics) loadAnalytics();
  if (consent.marketing) loadMarketing();
}

function loadAnalytics(): void {
  // TODO: Яндекс.Метрика или иная аналитика — только после consent.analytics === true
  // Пример: insertScript("https://mc.yandex.ru/metrika/tag.js", "yandex-metrika");
}

function loadMarketing(): void {
  // TODO: рекламные пиксели (VK, myTarget и т. п.) — только после consent.marketing === true
}
