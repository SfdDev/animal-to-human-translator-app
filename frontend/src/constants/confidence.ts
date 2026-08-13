export function confidencePercent(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.round(Math.min(1, Math.max(0, n)) * 100);
}

export function confidenceLabel(value: unknown): string {
  return `Уверенность ${confidencePercent(value)}%`;
}
