/** Ключ и схема согласия на cookie / localStorage (152-ФЗ, подготовка к рекламе). */

export const COOKIE_CONSENT_KEY = "translator-cookie-consent";

export type CookieCategory = "necessary" | "analytics" | "marketing";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export const COOKIE_CATEGORIES: Array<{
  id: CookieCategory;
  label: string;
  required: boolean;
  summary: string;
}> = [
  {
    id: "necessary",
    label: "Необходимые",
    required: true,
    summary: "Работа сайта, черновик формы в localStorage, запоминание вашего выбора здесь.",
  },
  {
    id: "analytics",
    label: "Аналитика",
    required: false,
    summary: "Статистика посещений (например, Яндекс.Метрика). Пока не подключена.",
  },
  {
    id: "marketing",
    label: "Реклама",
    required: false,
    summary: "Рекламные пиксели и персонализация объявлений. Пока не подключены.",
  },
];

export function defaultConsent(
  partial?: Partial<Pick<CookieConsent, "analytics" | "marketing">>,
): CookieConsent {
  return {
    necessary: true,
    analytics: partial?.analytics ?? false,
    marketing: partial?.marketing ?? false,
    decidedAt: new Date().toISOString(),
  };
}

export function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<CookieConsent>;
    if (data.necessary !== true) return null;
    return defaultConsent({
      analytics: Boolean(data.analytics),
      marketing: Boolean(data.marketing),
    });
  } catch {
    return null;
  }
}

export function saveConsent(consent: CookieConsent): void {
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
}
