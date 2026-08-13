import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import type { GetCatalog } from "../application/get-catalog.js";
import type { InterpretSignal } from "../application/interpret-signal.js";
import type { AppConfig } from "../config/env.js";
import { HttpError } from "./http-error.js";
import { catalogRouter } from "./routes/catalog.js";
import { healthRouter, type HealthCheck } from "./routes/health.js";
import { interpretRouter } from "./routes/interpret.js";

export function createHttpApp(
  config: AppConfig,
  catalog: GetCatalog,
  interpret: InterpretSignal,
  health: HealthCheck = async () => undefined,
): express.Express {
  const app = express();
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json());
  app.use("/api", healthRouter(health));
  app.use("/api", catalogRouter(catalog));
  app.use("/api", interpretRouter(interpret));
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  });
  return app;
}
