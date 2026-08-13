import { Router } from "express";
import { UnknownSpeciesError } from "../../application/errors.js";
import type { InterpretSignal } from "../../application/interpret-signal.js";
import type { InterpretInput } from "../../domain/types.js";
import { HttpError } from "../http-error.js";

export function interpretRouter(interpret: InterpretSignal): Router {
  const router = Router();

  router.post("/interpret", async (req, res, next) => {
    const body = req.body as InterpretInput;
    if (!body?.speciesId) {
      next(new HttpError(400, "Нужен speciesId"));
      return;
    }
    try {
      res.json(
        await interpret.execute({
          speciesId: body.speciesId,
          soundId: body.soundId ?? "",
          contextId: body.contextId ?? "",
          behaviorId: body.behaviorId ?? "",
        }),
      );
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
