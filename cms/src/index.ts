import type { Core } from "@strapi/strapi";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

type SeedArticle = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  speciesId: "cat" | "dog" | "chicken";
  published: string;
  body: unknown;
  translateSoundHint?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

async function setPublicArticlePermissions(strapi: Core.Strapi): Promise<void> {
  const role = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });
  if (!role) return;

  for (const action of ["find", "findOne"] as const) {
    const existing = await strapi.db.query("plugin::users-permissions.permission").findOne({
      where: {
        role: role.id,
        action: `api::article.article.${action}`,
      },
    });
    if (!existing) {
      await strapi.db.query("plugin::users-permissions.permission").create({
        data: {
          action: `api::article.article.${action}`,
          role: role.id,
        },
      });
    }
  }
}

async function seedArticlesIfEmpty(strapi: Core.Strapi): Promise<void> {
  const count = await strapi.db.query("api::article.article").count();
  if (count > 0) return;

  const seedPath = join(process.cwd(), "data", "articles.seed.json");
  if (!existsSync(seedPath)) {
    strapi.log.warn(`No seed file at ${seedPath}`);
    return;
  }

  const articles = JSON.parse(readFileSync(seedPath, "utf8")) as SeedArticle[];
  for (const article of articles) {
    await strapi.documents("api::article.article").create({
      data: {
        title: article.title,
        slug: article.slug,
        summary: article.summary,
        description: article.description,
        speciesId: article.speciesId,
        published: article.published,
        body: article.body as never,
        translateSoundHint: article.translateSoundHint || undefined,
        seoTitle: article.seoTitle || article.title,
        seoDescription: article.seoDescription || article.description,
      },
      status: "published",
    });
  }
  strapi.log.info(`Seeded ${articles.length} articles from articles.seed.json`);
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setPublicArticlePermissions(strapi);
    await seedArticlesIfEmpty(strapi);
  },
};
