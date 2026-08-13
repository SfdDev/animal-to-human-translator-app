import type { Rule } from "../types.js";

export type FilledFields = {
  soundId: string | null;
  contextId: string | null;
  behaviorId: string | null;
};

export type ScoredRule = Rule & { confidence: number; missing: string[]; weak: number };

export type ScoreContext = {
  filled: FilledFields;
  rule: Rule;
};

export interface SpeciesScoringPolicy {
  readonly logic: string;
  skipWeakCatchAll: boolean;
  contextMissingFactor: number;
  penalizeExtraContext: boolean;
  adjust(confidence: number, ctx: ScoreContext): number;
}
