import type { ScoreContext, SpeciesScoringPolicy } from "../types.js";

export const referentialPolicy: SpeciesScoringPolicy = {
  logic: "referential",
  skipWeakCatchAll: false,
  contextMissingFactor: 0.92,
  penalizeExtraContext: false,
  adjust(confidence, ctx: ScoreContext) {
    if (ctx.filled.soundId && ctx.filled.soundId !== "unknown") {
      return Math.max(confidence, Number(ctx.rule.confidence) * 0.95);
    }
    return confidence;
  },
};
