import { behaviors, contexts, rules, sounds, sources, species } from "./data.js";

export function catalogIntegrityIssues(): string[] {
  const issues: string[] = [];
  const speciesIds = new Set(species.map((row) => row.id));
  const sourceIds = new Set(sources.map((row) => row.id));
  const soundIds = new Set(sounds.map(([speciesId, id]) => `${speciesId}:${id}`));
  const contextIds = new Set(contexts.map(([speciesId, id]) => `${speciesId}:${id}`));
  const behaviorIds = new Set(behaviors.map(([speciesId, id]) => `${speciesId}:${id}`));

  for (const source of sources) {
    if (source.species_id && !speciesIds.has(source.species_id)) {
      issues.push(`источник ${source.id}: нет вида ${source.species_id}`);
    }
  }

  for (const [speciesId, id] of sounds) {
    if (!speciesIds.has(speciesId)) issues.push(`звук ${id}: нет вида ${speciesId}`);
  }
  for (const [speciesId, id] of contexts) {
    if (!speciesIds.has(speciesId)) issues.push(`контекст ${id}: нет вида ${speciesId}`);
  }
  for (const [speciesId, id] of behaviors) {
    if (!speciesIds.has(speciesId)) issues.push(`поведение ${id}: нет вида ${speciesId}`);
  }

  for (const rule of rules) {
    if (!speciesIds.has(rule.species_id)) {
      issues.push(`правило ${rule.id}: нет вида ${rule.species_id}`);
    }
    if (rule.sound_id && !soundIds.has(`${rule.species_id}:${rule.sound_id}`)) {
      issues.push(`правило ${rule.id}: нет звука ${rule.sound_id}`);
    }
    if (rule.context_id && !contextIds.has(`${rule.species_id}:${rule.context_id}`)) {
      issues.push(`правило ${rule.id}: нет контекста ${rule.context_id}`);
    }
    if (rule.behavior_id && !behaviorIds.has(`${rule.species_id}:${rule.behavior_id}`)) {
      issues.push(`правило ${rule.id}: нет поведения ${rule.behavior_id}`);
    }
    for (const sourceId of rule.sources ?? []) {
      if (!sourceIds.has(sourceId)) {
        issues.push(`правило ${rule.id}: нет источника ${sourceId}`);
      }
    }
  }

  return issues;
}

export function assertCatalogIntegrity(): void {
  const issues = catalogIntegrityIssues();
  if (issues.length) {
    throw new Error(`Каталог несогласован:\n${issues.join("\n")}`);
  }
}
