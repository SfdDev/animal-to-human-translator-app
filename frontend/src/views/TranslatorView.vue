<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { confidenceLabel, confidencePercent } from "../constants/confidence";
import { isSpeciesId } from "../constants/species";
import { useTranslatorForm } from "../composables/use-translator-form";
import {
  SPECIES_SEO,
  TRANSLATE_PAGE_HEADING,
  TRANSLATE_PAGE_SUBHEADING,
} from "../seo/site";

const {
  store,
  speciesId,
  speciesList,
  opts,
  contextOptions,
  behaviorOptions,
  soundHint,
  contextDisabled,
  behaviorDisabled,
  error,
  loading,
  ready,
  bootError,
  outEl,
  onSubmit,
  sourceMeta,
} = useTranslatorForm();

const speciesSeo = computed(() =>
  speciesId.value && isSpeciesId(speciesId.value) ? SPECIES_SEO[speciesId.value] : null,
);

const pageHeading = computed(
  () => speciesSeo.value?.pageHeading ?? TRANSLATE_PAGE_HEADING,
);

const pageSubheading = computed(
  () => speciesSeo.value?.pageSubheading ?? TRANSLATE_PAGE_SUBHEADING,
);

function filled(value: string): boolean {
  return Boolean(value && value !== "—");
}
</script>

<template>
  <p v-if="bootError" class="error">{{ bootError }}</p>
  <div v-else-if="ready" class="shell">
    <aside class="pane pane-in">
      <p class="kicker">Перевод</p>
      <h1>{{ pageHeading }}</h1>
      <p class="note page-subheading">{{ pageSubheading }}</p>
      <section class="block-card">
        <h2>Вид</h2>
        <div class="species">
          <RouterLink
            v-for="s in speciesList"
            :key="s.id"
            :to="{ name: 'translate', params: { speciesId: s.id } }"
            :class="{ on: speciesId === s.id }"
          >
            {{ s.name }}
          </RouterLink>
        </div>
        <p v-if="opts" class="note">
          {{ opts.species.logic_label }}. {{ opts.species.logic_note }}
        </p>
        <p v-else-if="speciesId" class="note">Загружаем звуки и контексты для этого вида.</p>
        <p v-else class="note">Выберите вид. От него зависят звук, контекст и поведение.</p>
      </section>
      <section class="block-card">
        <h2>Сигнал</h2>
        <fieldset :disabled="!opts">
          <label class="field">
            <span>Звук</span>
            <select v-model="store.soundId">
              <option value="">Не выбран</option>
              <option v-for="row in opts?.sounds ?? []" :key="row.id" :value="row.id">
                {{ row.label }}
              </option>
            </select>
          </label>
          <p v-if="soundHint" class="note">{{ soundHint }}</p>
          <label class="field">
            <span>Контекст</span>
            <select v-model="store.contextId" :disabled="contextDisabled">
              <option value="">Не выбран</option>
              <option v-for="row in contextOptions" :key="row.id" :value="row.id">
                {{ row.label }}
              </option>
            </select>
          </label>
          <label class="field">
            <span>Поведение</span>
            <select v-model="store.behaviorId" :disabled="behaviorDisabled">
              <option value="">Не выбрано</option>
              <option v-for="row in behaviorOptions" :key="row.id" :value="row.id">
                {{ row.label }}
              </option>
            </select>
          </label>
          <button
            type="button"
            class="go"
            :class="{ loading }"
            :disabled="loading || !opts"
            @click="onSubmit"
          >
            <span v-if="loading" class="spinner" aria-hidden="true" />
            {{ loading ? "Ищем перевод…" : "Показать вероятный перевод" }}
          </button>
        </fieldset>
        <p v-if="error" class="error">{{ error }}</p>
      </section>
      <section v-if="speciesSeo" class="block-card translate-seo">
        <h2>О сигналах {{ speciesSeo.nameGenitive }}</h2>
        <p class="muted">{{ speciesSeo.seoIntro }}</p>
        <p class="muted">{{ speciesSeo.seoExamples }}</p>
      </section>
    </aside>
    <section ref="outEl" class="pane pane-out" :aria-busy="loading">
      <p class="kicker">Вероятный перевод</p>
      <h2 class="pane-out-title">Что означает сигнал</h2>
      <p class="legal-disclaimer">
        Информация носит образовательный характер и не заменяет консультацию ветеринара.
      </p>
      <div v-if="loading" class="loading-pane">
        <div class="spinner spinner-lg" aria-hidden="true" />
        <p class="gloss">Ищем перевод…</p>
        <p class="muted">Сверяем сигнал с правилами в базе.</p>
      </div>
      <article v-else-if="store.result" class="result">
        <div v-if="store.result.uncertain" class="warn">
          Мало данных или сигнал неоднозначен. Это не научный факт.
        </div>
        <p class="gloss">{{ store.result.gloss }}</p>
        <p v-if="filled(store.result.function) || filled(store.result.state)" class="muted">
          <template v-if="filled(store.result.function)">{{ store.result.function }}.</template>
          <template v-if="filled(store.result.function) && filled(store.result.state)"> </template>
          <template v-if="filled(store.result.state)">{{ store.result.state }}.</template>
        </p>
        <p v-if="store.result.input" class="muted">
          Звук: {{ store.result.input.sound }}. Контекст: {{ store.result.input.context }}.
          Поведение: {{ store.result.input.behavior }}.
        </p>
        <p class="confidence">{{ confidenceLabel(store.result.confidence) }}</p>
        <div class="bar">
          <span :style="{ width: confidencePercent(store.result.confidence) + '%' }" />
        </div>
        <div v-if="store.result.alternatives.length">
          <h3>Альтернативные трактовки</h3>
          <ul>
            <li v-for="(a, i) in store.result.alternatives" :key="i">
              <strong>{{ confidenceLabel(a.confidence) }}. </strong>{{ a.gloss }}
              <span v-if="a.why" class="muted"> {{ a.why }}</span>
            </li>
          </ul>
        </div>
        <p v-else class="muted">Других трактовок в базе для этого входа нет.</p>
        <h3>Источники перевода</h3>
        <div v-for="s in store.result.sources" :key="s.id" class="src">
          <div>{{ s.title }}</div>
          <div class="muted">{{ sourceMeta(s) }}</div>
          <div v-if="s.doi" class="muted">DOI: {{ s.doi }}</div>
          <a v-if="s.url" :href="s.url" target="_blank" rel="noreferrer">{{ s.url }}</a>
        </div>
      </article>
      <div v-else class="empty">
        <p class="gloss">
          {{ opts ? "Введите данные в поля." : speciesId ? "Загружаем форму…" : "Выберите вид." }}
        </p>
        <p class="muted">
          <template v-if="opts">
            Слева выберите звук, контекст или поведение — затем нажмите кнопку. Пока поля пустые,
            перевод не показывается.
          </template>
          <template v-else-if="speciesId">Дождитесь полей слева, затем выберите сигнал.</template>
          <template v-else
            >Слева нажмите кошку, собаку или курицу — без вида перевод не строится.</template
          >
        </p>
      </div>
    </section>
  </div>
</template>
