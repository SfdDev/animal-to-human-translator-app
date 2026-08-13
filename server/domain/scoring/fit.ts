export const WEAK_FIT = 0.45;
export const MEDIUM_FIT = 0.7;

export type RuleFit = "weak" | "medium" | "strong";

export function ruleFit(confidence: number, weak = false): RuleFit {
  if (weak || confidence < WEAK_FIT) return "weak";
  if (confidence < MEDIUM_FIT) return "medium";
  return "strong";
}

export function asConfidence(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
