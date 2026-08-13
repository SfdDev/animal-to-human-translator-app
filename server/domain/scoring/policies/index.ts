import { gradedContextPolicy } from "./graded-context.js";
import { motivationalHumanPolicy } from "./motivational-human.js";
import { referentialPolicy } from "./referential.js";
import type { SpeciesScoringPolicy } from "../types.js";

const fallbackPolicy: SpeciesScoringPolicy = {
  logic: "default",
  skipWeakCatchAll: true,
  contextMissingFactor: 0.58,
  penalizeExtraContext: true,
  adjust: (confidence) => confidence,
};

const policies: SpeciesScoringPolicy[] = [
  motivationalHumanPolicy,
  gradedContextPolicy,
  referentialPolicy,
];

export function policyFor(logic: string): SpeciesScoringPolicy {
  return policies.find((policy) => policy.logic === logic) ?? fallbackPolicy;
}
