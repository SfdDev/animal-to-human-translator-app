import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          pool: "threads",
          include: ["server/**/*.test.ts"],
          exclude: ["server/**/*.integration.test.ts"],
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          pool: "threads",
          fileParallelism: false,
          include: ["server/**/*.integration.test.ts"],
          testTimeout: 20_000,
        },
      },
      {
        plugins: [vue()],
        test: {
          name: "frontend",
          environment: "happy-dom",
          pool: "threads",
          include: ["frontend/src/**/*.test.ts"],
        },
      },
    ],
  },
});
