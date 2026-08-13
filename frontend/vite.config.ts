import vue from "@vitejs/plugin-vue";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { seoFilesPlugin } from "./src/seo/vite-plugin";

const root = dirname(fileURLToPath(import.meta.url));
const api = process.env.API_PROXY ?? "http://127.0.0.1:3001";

export default defineConfig({
  root,
  envDir: join(root, ".."),
  plugins: [vue(), seoFilesPlugin()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: process.env.CHOKIDAR_USEPOLLING === "true",
    },
    proxy: {
      "/api": api,
    },
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    proxy: {
      "/api": api,
    },
  },
});
