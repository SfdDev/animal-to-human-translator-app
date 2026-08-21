import type { Plugin } from "vite";
import { fetchStrapiArticles } from "../api/strapi-articles";
import type { Article } from "../content/types";
import { llmsFullTxt, llmsTxt, robotsTxt, sitemapXml } from "./files";
import { siteOrigin } from "./site";

async function articlesForBuild(): Promise<Article[]> {
  try {
    return (await fetchStrapiArticles()) ?? [];
  } catch {
    return [];
  }
}

export function seoFilesPlugin(): Plugin {
  return {
    name: "seo-files",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_ORIGIN__", siteOrigin());
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0] ?? "";

        if (path === "/robots.txt") {
          res.statusCode = 200;
          res.setHeader("Content-Type", contentType(path));
          res.end(robotsTxt(siteOrigin()));
          return;
        }
        if (path === "/llms.txt") {
          res.statusCode = 200;
          res.setHeader("Content-Type", contentType(path));
          res.end(llmsTxt(siteOrigin()));
          return;
        }
        if (path === "/llms-full.txt") {
          res.statusCode = 200;
          res.setHeader("Content-Type", contentType(path));
          res.end(llmsFullTxt(siteOrigin()));
          return;
        }
        if (path === "/sitemap.xml") {
          void articlesForBuild().then((articles) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", contentType(path));
            res.end(sitemapXml(siteOrigin(), undefined, articles));
          });
          return;
        }
        next();
      });
    },
    async generateBundle() {
      const origin = siteOrigin();
      const articles = await articlesForBuild();
      const files: Record<string, string> = {
        "robots.txt": robotsTxt(origin),
        "sitemap.xml": sitemapXml(origin, undefined, articles),
        "llms.txt": llmsTxt(origin),
        "llms-full.txt": llmsFullTxt(origin),
      };
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({
          type: "asset",
          fileName,
          source,
        });
      }
    },
  };
}

function contentType(path: string): string {
  if (path.endsWith(".xml")) return "application/xml; charset=utf-8";
  if (path.endsWith(".txt")) return "text/plain; charset=utf-8";
  return "text/plain; charset=utf-8";
}
