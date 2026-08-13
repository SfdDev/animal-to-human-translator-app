import type { ScoreContext, SpeciesScoringPolicy } from "../types.js";

export const gradedContextPolicy: SpeciesScoringPolicy = {
  logic: "graded_context",
  skipWeakCatchAll: true,
  contextMissingFactor: 0.58,
  penalizeExtraContext: true,
  adjust(confidence, ctx: ScoreContext) {
    if (ctx.filled.soundId === "bark" && !ctx.filled.contextId && !ctx.filled.behaviorId) {
      return Math.min(confidence, 0.32);
    }
    return confidence;
  },
};
