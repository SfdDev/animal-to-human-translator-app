import type { FormOptions, OptionRow } from "../types/translator";

export type SoundSelection = {
  soundId: string;
  contextId: string;
  behaviorId: string;
};

/** Контексты, для которых есть правила у выбранного звука. Без звука — пусто. */
export function contextOptionsForSound(form: FormOptions, soundId: string): OptionRow[] {
  if (!soundId) return [];
  const allowed = new Set(form.bySound[soundId]?.contexts ?? []);
  return form.contexts.filter((row) => allowed.has(row.id));
}

/** Поведение, для которого есть правила у выбранного звука. Без звука — пусто. */
export function behaviorOptionsForSound(form: FormOptions, soundId: string): OptionRow[] {
  if (!soundId) return [];
  const allowed = new Set(form.bySound[soundId]?.behaviors ?? []);
  return form.behaviors.filter((row) => allowed.has(row.id));
}

export function soundFieldHint(form: FormOptions | null, soundId: string): string {
  if (!form || soundId) return "";
  return "Сначала выберите звук — покажем контексты и поведение, для которых есть правила.";
}

/** Контекст заблокирован, пока нет звука или нет правил с контекстом. */
export function isContextFieldDisabled(form: FormOptions | null, soundId: string): boolean {
  if (!form || !soundId) return true;
  return contextOptionsForSound(form, soundId).length === 0;
}

/** Поведение заблокировано, пока нет звука или нет правил с поведением. */
export function isBehaviorFieldDisabled(form: FormOptions | null, soundId: string): boolean {
  if (!form || !soundId) return true;
  return behaviorOptionsForSound(form, soundId).length === 0;
}

/** Сбрасывает контекст/поведение, если они не подходят к звуку. */
export function pruneSelectionBySound(form: FormOptions, selection: SoundSelection): void {
  if (!selection.soundId) {
    selection.contextId = "";
    selection.behaviorId = "";
    return;
  }
  const allowed = form.bySound[selection.soundId];
  const contexts = new Set(allowed?.contexts ?? []);
  const behaviors = new Set(allowed?.behaviors ?? []);
  if (selection.contextId && !contexts.has(selection.contextId)) selection.contextId = "";
  if (selection.behaviorId && !behaviors.has(selection.behaviorId)) selection.behaviorId = "";
}
