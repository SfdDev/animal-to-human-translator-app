import { isSpeciesId, SPECIES_IDS, TRANSLATE_PATH, type SpeciesId } from "../constants/species";
import { ARTICLES_PATH, FAQ_PATH, GUIDES_PATH, HOW_IT_WORKS_PATH, articlePath, guidePath } from "../constants/paths";
import { ARTICLES } from "../content/articles";
import { PDF_DOCUMENTS } from "../content/documents";
import { SPECIES_GUIDES } from "../content/guides";

export { HOME_FAQ } from "../content/faq";

export const SITE_NAME = "Перевод сигналов животных";
export const HOME_TITLE = "Что означает мяукание, лай и крики — по науке";
export const SITE_LOCALE = "ru_RU";
export const SITE_LANGUAGE = "ru";
export const DEFAULT_SITE_ORIGIN = "http://localhost:5173";
export const THEME_COLOR = "#12150f";

export const SITE_DESCRIPTION =
  "Узнайте вероятный смысл сигнала кошки, собаки или курицы: выберите звук, ситуацию и поведение. Правила из научных статей, не игрушка-переводчик по записи.";

export type { FaqItem } from "../content/types";

export type SpeciesSeo = {
  id: SpeciesId;
  name: string;
  nameGenitive: string;
  latin: string;
  title: string;
  description: string;
  about: string;
  pageHeading: string;
  pageSubheading: string;
  seoIntro: string;
  seoExamples: string;
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
    title: "Что означает мяукание и другие звуки кошки",
    description:
      "Мяукание, мурчание, шипение: выберите звук и ситуацию — получите вероятный смысл по правилам из статей о коммуникации кошек с человеком. Не переводчик по записи.",
    about: "Взрослое мяу почти не используется между кошками: это запрос к человеку.",
    pageHeading: "Значение сигналов кошки: мяу, мурчание, шипение",
    pageSubheading:
      "Подберём вероятный смысл по правилам из статей о коммуникации кошек с человеком.",
    seoIntro:
      "Кошки используют голос в основном с людьми. Мяукание у двери, у миски или ночью может означать разное — важны тип звука и что происходит рядом.",
    seoExamples:
      "Выберите звук (мяу, мурчание, шипение, вой…) и при необходимости контекст: еда, дверь, одиночество, конфликт с другой кошкой. Для некоторых звуков достаточно только типа сигнала.",
  },
  dog: {
    id: "dog",
    name: "Собака",
    nameGenitive: "собаки",
    latin: "Canis familiaris",
    title: "Что означает лай, скуление и рычание собаки",
    description:
      "Лай, скуление, рычание и вой: выберите звук и ситуацию — получите вероятный смысл по правилам из статей об акустике и поведении собак. Не переводчик по записи.",
    about: "Лай не слова. Акустика связана с тревогой, изоляцией или игрой.",
    pageHeading: "Значение сигналов собаки: лай, вой, рычание",
    pageSubheading:
      "Подберём вероятный смысл по правилам из статей — с учётом ситуации и поведения.",
    seoIntro:
      "Лай при игре и лай от одиночества звучат по-разному, но без контекста их легко перепутать. Рычание может быть предупреждением или частью игры — смотрите на ситуацию.",
    seoExamples:
      "Выберите звук (лай, скуление, рычание, вой…) и контекст: тревога, одиночество, игра, прогулка, конфликт. Для лая доступны и поведенческие подсказки: у двери, игровая поза, напряжённая стойка.",
  },
  chicken: {
    id: "chicken",
    name: "Курица",
    nameGenitive: "курицы",
    latin: "Gallus gallus domesticus",
    title: "Что означают крики курицы: еда, опасность",
    description:
      "Пищевой крик и тревоги на воздух или землю: выберите тип крика и ситуацию — получите вероятный смысл по правилам из статей о референциальных сигналах кур. Не переводчик по записи.",
    about: "Тип крика указывает на событие: еда, угроза с воздуха или с земли.",
    pageHeading: "Значение сигналов курицы: пищевой крик и тревога",
    pageSubheading: "Подберём вероятный смысл по правилам из статей о референциальных криках.",
    seoIntro:
      "У кур часть криков ближе к «сообщению о событии»: нашлась еда, опасность с неба или с земли. Это другая логика, чем у кошачьего мяу или собачьего лая.",
    seoExamples:
      "Выберите тип крика (пищевой, воздушная тревога, наземная тревога…) и контекст: избранная еда, курица рядом, поиск на земле, осмотр неба.",
  },
};

export const TRANSLATE_PAGE_TITLE = "Перевод сигнала животного — кошка, собака, курица";
export const TRANSLATE_PAGE_DESCRIPTION =
  "Выберите животное, тип звука, контекст и поведение — сервис подберёт вероятный перевод по правилам из научных статей. Без записи с микрофона.";
export const TRANSLATE_PAGE_HEADING = "Выберите животное и сигнал";
export const TRANSLATE_PAGE_SUBHEADING =
  "Подберём вероятный смысл по научным правилам — с уверенностью, альтернативами и источниками.";

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
      title: HOME_TITLE,
      description: SITE_DESCRIPTION,
    },
    {
      path: TRANSLATE_PATH,
      title: TRANSLATE_PAGE_TITLE,
      description: TRANSLATE_PAGE_DESCRIPTION,
    },
    {
      path: FAQ_PATH,
      title: "Частые вопросы о сигналах животных",
      description:
        "Что означает мяукание и лай, можно ли записать звук, чем сервис отличается от переводчика по записи и когда нужен ветеринар.",
    },
    {
      path: HOW_IT_WORKS_PATH,
      title: "Как работает перевод сигналов животных",
      description:
        "Вы выбираете вид, звук и ситуацию — сервис сопоставляет это с правилами из научных статей. Без микрофона и без словаря «гав = да».",
    },
    {
      path: GUIDES_PATH,
      title: "Справочник сигналов кошки, собаки и курицы",
      description:
        "Краткие обзоры логики сигналов по видам и ссылки на перевод и статьи о типичных ситуациях.",
    },
    {
      path: ARTICLES_PATH,
      title: "Статьи о значении звуков животных",
      description:
        "Разборы мяукания у двери и у миски, лая при игре и одиночестве, рычания и пищевого крика курицы.",
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
    ...SPECIES_IDS.map((id) => {
      const guide = SPECIES_GUIDES[id];
      return {
        path: guidePath(id),
        title: guide.title,
        description: guide.description,
        speciesId: id,
      };
    }),
    ...ARTICLES.map((article) => ({
      path: articlePath(article.slug),
      title: article.title,
      description: article.description,
      speciesId: article.speciesId,
    })),
    ...PDF_DOCUMENTS.map((doc) => ({
      path: doc.pdf,
      title: doc.title,
      description: `Юридический документ (PDF): ${doc.title}`,
    })),
  ];
}

export function seoForRoute(path: string, speciesId?: string): SeoPage {
  const pages = seoPages();
  const exact = pages.find((page) => page.path === path);
  if (exact) return exact;

  if (speciesId && isSpeciesId(speciesId)) {
    if (path.startsWith(GUIDES_PATH)) {
      return pages.find((page) => page.path === guidePath(speciesId)) ?? pages[0]!;
    }
    if (path.startsWith(TRANSLATE_PATH)) {
      return pages.find((page) => page.path === `${TRANSLATE_PATH}/${speciesId}`) ?? pages[1]!;
    }
  }

  if (path.startsWith(`${ARTICLES_PATH}/`)) {
    return pages.find((page) => page.path === ARTICLES_PATH) ?? pages[0]!;
  }
  if (path.startsWith(GUIDES_PATH)) {
    return pages.find((page) => page.path === GUIDES_PATH) ?? pages[0]!;
  }
  if (path.startsWith(TRANSLATE_PATH)) {
    return pages.find((page) => page.path === TRANSLATE_PATH) ?? pages[1]!;
  }
  return pages[0]!;
}
