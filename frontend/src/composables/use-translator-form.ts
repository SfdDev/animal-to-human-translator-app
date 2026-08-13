import { computed, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import { fetchForm, fetchSpecies, interpret } from "../api/translator";
import { isSpeciesId } from "../constants/species";
import { useTranslatorStore } from "../stores/translator";
import type { FormOptions, Species } from "../types/translator";

export function useTranslatorForm() {
  const route = useRoute();
  const store = useTranslatorStore();
  const speciesId = computed(() => {
    const id = route.params.speciesId;
    return typeof id === "string" ? id : "";
  });
  const hasSpecies = computed(() => isSpeciesId(speciesId.value));

  const speciesList = ref<Species[]>([]);
  const opts = ref<FormOptions | null>(null);
  const error = ref("");
  const loading = ref(false);
  const ready = ref(false);
  const bootError = ref("");
  const outEl = ref<HTMLElement | null>(null);

  async function loadForm(id: string): Promise<void> {
    opts.value = await fetchForm(id);
    store.pruneInvalid(opts.value);
  }

  onMounted(async () => {
    store.adoptSpecies(speciesId.value);
    try {
      speciesList.value = await fetchSpecies();
      if (hasSpecies.value) await loadForm(speciesId.value);
      ready.value = true;
    } catch (err) {
      bootError.value =
        err instanceof Error ? err.message : "Не удалось связаться с API. Запустите npm run dev.";
    }
  });

  watch(speciesId, async (id) => {
    store.adoptSpecies(id);
    error.value = "";
    loading.value = false;
    opts.value = null;
    if (!isSpeciesId(id)) return;
    try {
      await loadForm(id);
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Не удалось загрузить форму для этого вида.";
    }
  });

  onBeforeRouteLeave(() => {
    store.leavePage();
  });

  async function onSubmit(): Promise<void> {
    if (loading.value) return;
    loading.value = true;
    error.value = "";
    if (!hasSpecies.value || !opts.value) {
      error.value = hasSpecies.value ? "Дождитесь загрузки формы" : "Выберите вид";
      store.setResult(null);
      loading.value = false;
      outEl.value?.scrollTo({ top: 0 });
      return;
    }
    if (store.formEmpty) {
      error.value = "Введите данные в поля";
      store.setResult(null);
      loading.value = false;
      outEl.value?.scrollTo({ top: 0 });
      return;
    }
    try {
      store.setResult(
        await interpret({
          speciesId: speciesId.value,
          soundId: store.soundId,
          contextId: store.contextId,
          behaviorId: store.behaviorId,
        }),
      );
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      store.setResult(null);
    }
    loading.value = false;
    outEl.value?.scrollTo({ top: 0 });
  }

  function sourceMeta(s: NonNullable<typeof store.result>["sources"][number]): string {
    return [s.authors, s.year, s.venue].filter(Boolean).join(". ");
  }

  return {
    store,
    speciesId,
    speciesList,
    opts,
    error,
    loading,
    ready,
    bootError,
    outEl,
    onSubmit,
    sourceMeta,
  };
}
