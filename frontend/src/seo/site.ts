import { isSpeciesId, SPECIES_IDS, TRANSLATE_PATH, type SpeciesId } from "../constants/species";

export const SITE_NAME = "Перевод сигналов животных";
export const SITE_LOCALE = "ru_RU";
export const SITE_LANGUAGE = "ru";
export const DEFAULT_SITE_ORIGIN = "http://localhost:5173";
export const THEME_COLOR = "#12150f";

export const SITE_DESCRIPTION =
  "Сопоставление типа звука, контекста и поведения с правилами из научных статей. Кошка, собака и курица читаются по разной логике. Запись не распознаётся.";

export type SpeciesSeo = {
  id: SpeciesId;
  name: string;
  nameGenitive: string;
  latin: string;
  title: string;
  description: string;
  about: string;
};

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  speciesId?: SpeciesId;
};

export const SPECIES_SEO: Record<SpeciesId, SpeciesSeo> = {
  cat: {
    id: "cat",
    name: "Кошка",
    nameGenitive: "кошки",
    latin: "Felis catus",
    title: "Перевод — кошка",
    description:
      "Перевод сигналов кошки: мяу — запрос к человеку, а не слово. Тип звука, контекст и поведение сопоставляются с правилами из статей.",
    about: "Взрослое мяу почти не используется между кошками: это запрос к человеку.",
  },
  dog: {
    id: "dog",
    name: "Собака",
    nameGenitive: "собаки",
    latin: "Canis familiaris",
    title: "Перевод — собака",
    description:
      "Перевод сигналов собаки: лай и рычание зависят от ситуации. Без контекста перевод слабый. Правила из статей, не словарь «гав».",
    about: "Лай не слова. Акустика связана с тревогой, изоляцией или игрой.",
  },
  chicken: {
    id: "chicken",
    name: "Курица",
    nameGenitive: "курицы",
    latin: "Gallus gallus domesticus",
    title: "Перевод — курица",
    description:
      "Перевод сигналов курицы: пищевой крик и тревоги на воздух или землю называют событие. Это ближе к переводу, чем лай или мяу.",
    about: "Тип крика указывает на событие: еда, угроза с воздуха или с земли.",
  },
};

export function siteOrigin(): string {
  const fromVite = typeof import.meta !== "undefined" ? import.meta.env?.VITE_SITE_URL : undefined;
  const fromProcess = typeof process !== "undefined" ? process.env.VITE_SITE_URL : undefined;
  const raw = String(fromVite || fromProcess || DEFAULT_SITE_ORIGIN).trim();
  return raw.replace(/\/+$/, "") || DEFAULT_SITE_ORIGIN;
}

export function absoluteUrl(path: string, origin = siteOrigin()): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${suffix === "/" ? "/" : suffix}`;
}

export function pageTitle(title: string): string {
  return title === SITE_NAME ? SITE_NAME : `${title} | ${SITE_NAME}`;
}

export function seoPages(): SeoPage[] {
  return [
    {
      path: "/",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    {
      path: TRANSLATE_PATH,
      title: "Перевод",
      description:
        "Выберите вид, затем звук, контекст или поведение. Приложение подберёт вероятный перевод из правил статей, уверенность, альтернативы и источники.",
    },
    ...SPECIES_IDS.map((id) => {
      const species = SPECIES_SEO[id];
      return {
        path: `${TRANSLATE_PATH}/${id}`,
        title: species.title,
        description: species.description,
        speciesId: id,
      };
    }),
  ];
}

export function seoForRoute(path: string, speciesId?: string): SeoPage {
  const pages = seoPages();
  if (speciesId && isSpeciesId(speciesId)) {
    return pages.find((page) => page.speciesId === speciesId) ?? pages[1]!;
  }
  const exact = pages.find((page) => page.path === path);
  if (exact) return exact;
  if (path.startsWith(`${TRANSLATE_PATH}`)) return pages[1]!;
  return pages[0]!;
}
