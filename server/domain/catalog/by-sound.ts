import type { Rule } from "../types.js";

/** Какие контексты и поведения встречаются в правилах для каждого звука вида. */
export function buildBySound(
  rules: Rule[],
): Record<string, { contexts: string[]; behaviors: string[] }> {
  const map = new Map<string, { contexts: Set<string>; behaviors: Set<string> }>();

  for (const rule of rules) {
    if (!rule.sound_id) continue;
    let entry = map.get(rule.sound_id);
    if (!entry) {
      entry = { contexts: new Set(), behaviors: new Set() };
      map.set(rule.sound_id, entry);
    }
    if (rule.context_id) entry.contexts.add(rule.context_id);
    if (rule.behavior_id) entry.behaviors.add(rule.behavior_id);
  }

  const out: Record<string, { contexts: string[]; behaviors: string[] }> = {};
  for (const [soundId, sets] of map) {
    out[soundId] = {
      contexts: [...sets.contexts].sort(),
      behaviors: [...sets.behaviors].sort(),
    };
  }
  return out;
}
