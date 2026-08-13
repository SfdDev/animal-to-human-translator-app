import { SPECIES_IDS } from "../constants/species";
import { SITE_DESCRIPTION, SITE_NAME, SPECIES_SEO, absoluteUrl, seoPages } from "./site";

export function robotsTxt(origin: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${origin}/sitemap.xml`,
    "",
  ].join("\n");
}

export function sitemapXml(origin: string, lastmod = "2026-08-14"): string {
  const urls = seoPages()
    .map((page) => {
      const loc = absoluteUrl(page.path, origin);
      const priority = page.path === "/" ? "1.0" : page.speciesId ? "0.8" : "0.9";
      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        "    <changefreq>monthly</changefreq>",
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export function llmsTxt(origin: string): string {
  const speciesLinks = SPECIES_IDS.map((id) => {
    const species = SPECIES_SEO[id];
    return `- [${species.name}](${absoluteUrl(`/perevod/${id}`, origin)}): ${species.about}`;
  }).join("\n");
  return `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

Приложение на русском. Пользователь выбирает вид, тип звука, контекст и поведение. Ответ — перефраз из статьи, уверенность, альтернативы и источники. Если данных мало, перевод помечается как неуверенный. Это не словарь и не распознавание записи.

## Страницы

- [Главная](${absoluteUrl("/", origin)}): как устроен перевод и чем виды отличаются
- [Перевод](${absoluteUrl("/perevod", origin)}): форма сигнала без заранее выбранного вида
${speciesLinks}

## Для моделей

- [Полное описание](${absoluteUrl("/llms-full.txt", origin)}): логика по видам, API, источники
- [Карта сайта](${absoluteUrl("/sitemap.xml", origin)})
`;
}

export function llmsFullTxt(origin: string): string {
  return `# ${SITE_NAME}

${SITE_DESCRIPTION}

Сайт: ${origin}/

## Чего нет

Нет записи с микрофона, нет архивов wav, нет классификатора звука. Поле «звук» — выбранный тип сигнала из статьи.

## Как переводится

1. Пользователь выбирает вид: кошка, собака или курица.
2. Затем звук, контекст и/или поведение.
3. Сервер сопоставляет ввод с правилами в PostgreSQL.
4. Ответ: вероятный перевод, уверенность, функция и состояние правила, альтернативы, источники именно этого правила.

Логика разная:

- Кошка — мотивационный сигнал, часто к человеку. Мяу без контекста специально слабое: люди плохо угадывают смысл без видео.
- Собака — градуированный сигнал плюс ситуация. Лай не слова; игра и одиночество похожи.
- Курица — референциальные крики. Тип крика ближе к «о чём сигнал»: еда, воздух, земля.

## Маршруты

- ${absoluteUrl("/", origin)} — главная
- ${absoluteUrl("/perevod", origin)} — перевод
- ${absoluteUrl("/perevod/cat", origin)} — кошка (${SPECIES_SEO.cat.latin})
- ${absoluteUrl("/perevod/dog", origin)} — собака (${SPECIES_SEO.dog.latin})
- ${absoluteUrl("/perevod/chicken", origin)} — курица (${SPECIES_SEO.chicken.latin})

Старые адреса /cat, /dog, /chicken перенаправляют на /perevod/{вид}.

## API

- GET /api/species — виды
- GET /api/form/:speciesId — звуки, контексты, поведение
- POST /api/interpret — { speciesId, soundId, contextId, behaviorId }
- GET /api/health — проверка базы

## Источники (DOI и статьи)

Кошка: Schötz (VIHAR 2017); DOI 10.1016/j.applanim.2023.106146; 10.3390/ani9080543; 10.1037/0735-7036.117.1.44; 10.1016/j.cub.2009.05.033.

Собака: Yin & McCowan 10.1016/j.anbehav.2003.07.016; Pongrácz 10.1037/0735-7036.119.2.136; 10.1016/j.applanim.2005.12.004; Faragó 10.1016/j.anbehav.2010.01.005; Morton 10.1086/283219.

Курица: Evans 10.1006/anbe.1993.1158; пищевой крик 10.1006/anbe.1999.1143; 10.1016/S0003-3472(86)80229-2; 10.1016/S0003-3472(86)80230-9.
`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
