import type { ScoreContext, SpeciesScoringPolicy } from "../types.js";

export const motivationalHumanPolicy: SpeciesScoringPolicy = {
  logic: "motivational_human",
  skipWeakCatchAll: true,
  contextMissingFactor: 0.58,
  penalizeExtraContext: true,
  adjust(confidence, ctx: ScoreContext) {
    if (ctx.filled.soundId === "meow" && !ctx.filled.contextId) {
      return Math.min(confidence, 0.32);
    }
    return confidence;
  },
};
