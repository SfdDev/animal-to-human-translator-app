import { Router } from "express";
import { UnknownSpeciesError } from "../../application/errors.js";
import type { GetCatalog } from "../../application/get-catalog.js";
import { HttpError } from "../http-error.js";

export function catalogRouter(catalog: GetCatalog): Router {
  const router = Router();

  router.get("/species", async (_req, res, next) => {
    try {
      res.json(await catalog.listSpecies());
    } catch (err) {
      next(err);
    }
  });

  router.get("/form/:speciesId", async (req, res, next) => {
    try {
      res.json(await catalog.formOptions(String(req.params.speciesId)));
    } catch (err) {
      if (err instanceof UnknownSpeciesError) {
        next(new HttpError(404, err.message));
        return;
      }
      next(err);
    }
  });

  return router;
}
