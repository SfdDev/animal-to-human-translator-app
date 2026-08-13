import type { Plugin } from "vite";
import { llmsFullTxt, llmsTxt, robotsTxt, sitemapXml } from "./files";
import { siteOrigin } from "./site";

const FILES: Record<string, (origin: string) => string> = {
  "/robots.txt": robotsTxt,
  "/sitemap.xml": sitemapXml,
  "/llms.txt": llmsTxt,
  "/llms-full.txt": llmsFullTxt,
};

export function seoFilesPlugin(): Plugin {
  return {
    name: "seo-files",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_ORIGIN__", siteOrigin());
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = req.url?.split("?")[0] ?? "";
        const build = FILES[path];
        if (!build) {
          next();
          return;
        }
        const body = build(siteOrigin());
        res.statusCode = 200;
        res.setHeader("Content-Type", contentType(path));
        res.end(body);
      });
    },
    generateBundle() {
      const origin = siteOrigin();
      for (const [path, build] of Object.entries(FILES)) {
        this.emitFile({
          type: "asset",
          fileName: path.slice(1),
          source: build(origin),
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
