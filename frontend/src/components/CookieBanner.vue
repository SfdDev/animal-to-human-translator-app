<script setup lang="ts">
import { ref } from "vue";
import { COOKIE_CATEGORIES } from "../constants/cookies";
import { useCookieConsent } from "../composables/use-cookie-consent";
import { docPdfPath } from "../constants/paths";

const { hasDecision, acceptAll, rejectOptional, savePreferences } = useCookieConsent();

const settingsOpen = ref(false);
const analytics = ref(false);
const marketing = ref(false);

function openSettings(): void {
  settingsOpen.value = true;
}

function saveSettings(): void {
  savePreferences(analytics.value, marketing.value);
  settingsOpen.value = false;
}
</script>

<template>
  <aside
    v-if="!hasDecision"
    class="cookie-banner"
    role="dialog"
    aria-labelledby="cookie-banner-title"
    aria-describedby="cookie-banner-desc"
  >
    <p id="cookie-banner-title" class="cookie-banner-title">Cookie и локальное хранение</p>
    <p id="cookie-banner-desc" class="cookie-banner-text">
      Сайт использует необходимые cookie и <code>localStorage</code> для работы перевода. Аналитика
      и реклама подключаются только с вашего согласия.
      <a :href="docPdfPath('politika-cookie')">Подробности в политике cookie</a>.
    </p>

    <div v-if="settingsOpen" class="cookie-banner-settings">
      <label
        v-for="category in COOKIE_CATEGORIES"
        :key="category.id"
        class="cookie-banner-option"
        :class="{ locked: category.required }"
      >
        <input v-if="category.id === 'necessary'" type="checkbox" checked disabled />
        <input v-else-if="category.id === 'analytics'" v-model="analytics" type="checkbox" />
        <input v-else v-model="marketing" type="checkbox" />
        <span>
          <strong>{{ category.label }}</strong>
          <span class="muted">{{ category.summary }}</span>
        </span>
      </label>
      <button
        type="button"
        class="cookie-banner-btn cookie-banner-btn-primary"
        @click="saveSettings"
      >
        Сохранить выбор
      </button>
    </div>

    <div v-else class="cookie-banner-actions">
      <button type="button" class="cookie-banner-btn cookie-banner-btn-primary" @click="acceptAll">
        Принять все
      </button>
      <button type="button" class="cookie-banner-btn" @click="rejectOptional">
        Только необходимые
      </button>
      <button type="button" class="cookie-banner-btn cookie-banner-btn-ghost" @click="openSettings">
        Настроить
      </button>
    </div>
  </aside>
</template>
