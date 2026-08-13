import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { FormOptions, InterpretResult } from "../types/translator";

export const useTranslatorStore = defineStore(
  "translator",
  () => {
    const speciesId = ref("");
    const soundId = ref("");
    const contextId = ref("");
    const behaviorId = ref("");
    const result = ref<InterpretResult | null>(null);

    const formEmpty = computed(() => !soundId.value && !contextId.value && !behaviorId.value);

    function clearForm(): void {
      soundId.value = "";
      contextId.value = "";
      behaviorId.value = "";
      result.value = null;
    }

    /** Keep fields only when this is the same page (refresh). Wipe on a new species route. */
    function adoptSpecies(id: string): void {
      if (speciesId.value === id) return;
      speciesId.value = id;
      clearForm();
    }

    function setResult(value: InterpretResult | null): void {
      result.value = value;
    }

    function pruneInvalid(opts: FormOptions): void {
      const sounds = new Set(opts.sounds.map((row) => row.id));
      const contexts = new Set(opts.contexts.map((row) => row.id));
      const behaviors = new Set(opts.behaviors.map((row) => row.id));
      let changed = false;
      if (soundId.value && !sounds.has(soundId.value)) {
        soundId.value = "";
        changed = true;
      }
      if (contextId.value && !contexts.has(contextId.value)) {
        contextId.value = "";
        changed = true;
      }
      if (behaviorId.value && !behaviors.has(behaviorId.value)) {
        behaviorId.value = "";
        changed = true;
      }
      if (changed) result.value = null;
    }

    function leavePage(): void {
      speciesId.value = "";
      clearForm();
    }

    return {
      speciesId,
      soundId,
      contextId,
      behaviorId,
      result,
      formEmpty,
      clearForm,
      leavePage,
      adoptSpecies,
      setResult,
      pruneInvalid,
    };
  },
  { persist: { key: "translator-session" } },
);
