import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const root = dirname(fileURLToPath(import.meta.url));
const api = process.env.API_PROXY ?? "http://127.0.0.1:3001";

export default defineConfig({
  root,
  preview: {
    host: true,
    port: 4173,
    strictPort: true,
    proxy: {
      "/api": api,
    },
  },
});
