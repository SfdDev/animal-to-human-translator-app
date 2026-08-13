import { Router } from "express";

export type HealthCheck = () => Promise<void>;

export function healthRouter(check: HealthCheck): Router {
  const router = Router();
  router.get("/health", async (_req, res) => {
    try {
      await check();
      res.json({ ok: true });
    } catch {
      res.status(503).json({ ok: false });
    }
  });
  return router;
}
