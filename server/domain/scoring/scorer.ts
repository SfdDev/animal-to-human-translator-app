import type { Rule, Species } from "../types.js";
import { policyFor } from "./policies/index.js";
import type { FilledFields, ScoredRule } from "./types.js";

export function scoreRule(species: Species, rule: Rule, filled: FilledFields): ScoredRule | null {
  if (rule.sound_id && filled.soundId && rule.sound_id !== filled.soundId) return null;
  if (rule.context_id && filled.contextId && rule.context_id !== filled.contextId) return null;
  if (rule.behavior_id && filled.behaviorId && rule.behavior_id !== filled.behaviorId) return null;

  const policy = policyFor(String(species.logic));
  const catchAll = Boolean(rule.sound_id && !rule.context_id && !rule.behavior_id);
  if (
    catchAll &&
    policy.skipWeakCatchAll &&
    Number(rule.weak) === 1 &&
    (filled.contextId || filled.behaviorId)
  ) {
    return null;
  }

  let conf = Number(rule.confidence);
  if (!Number.isFinite(conf)) conf = 0;
  const missing: string[] = [];

  if (rule.sound_id && !filled.soundId) {
    conf *= 0.4;
    missing.push("звук");
  }
  if (rule.context_id && !filled.contextId) {
    conf *= policy.contextMissingFactor;
    missing.push("контекст");
  }
  if (rule.behavior_id && !filled.behaviorId) {
    conf *= 0.72;
    missing.push("поведение");
  }

  if (!rule.sound_id && filled.soundId) conf *= 0.45;
  if (!rule.context_id && filled.contextId && policy.penalizeExtraContext) conf *= 0.35;
  if (!rule.behavior_id && filled.behaviorId) conf *= 0.9;

  conf = policy.adjust(conf, { filled, rule });

  if (!rule.sound_id && filled.soundId) conf *= 0.85;
  if (!rule.context_id && filled.contextId && policy.penalizeExtraContext) conf *= 0.92;

  conf = Math.max(0.08, Math.min(0.92, conf));
  return { ...rule, confidence: conf, missing };
}

export function sortScored(filled: FilledFields, scored: ScoredRule[]): ScoredRule[] {
  return [...scored].sort((a, b) => {
    const spec = (r: Rule) =>
      (r.sound_id && filled.soundId ? 1 : 0) +
      (r.context_id && filled.contextId ? 1 : 0) +
      (r.behavior_id && filled.behaviorId ? 1 : 0);
    const ds = spec(b) - spec(a);
    return ds !== 0 ? ds : b.confidence - a.confidence;
  });
}
