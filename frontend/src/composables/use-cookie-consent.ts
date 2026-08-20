import { computed, ref } from "vue";
import { applyConsentScripts } from "../consent/scripts";
import {
  COOKIE_CONSENT_KEY,
  defaultConsent,
  parseConsent,
  saveConsent,
  type CookieConsent,
} from "../constants/cookies";

const consent = ref<CookieConsent | null>(null);
const initialized = ref(false);

function readStored(): CookieConsent | null {
  try {
    return parseConsent(localStorage.getItem(COOKIE_CONSENT_KEY));
  } catch {
    return null;
  }
}

function commit(next: CookieConsent): void {
  consent.value = next;
  try {
    saveConsent(next);
  } catch {
    // localStorage недоступен — применяем скрипты только в текущей сессии
  }
  applyConsentScripts(next);
}

export function useCookieConsent() {
  if (!initialized.value) {
    consent.value = readStored();
    if (consent.value) applyConsentScripts(consent.value);
    initialized.value = true;
  }

  const hasDecision = computed(() => consent.value !== null);

  function acceptAll(): void {
    commit(defaultConsent({ analytics: true, marketing: true }));
  }

  function rejectOptional(): void {
    commit(defaultConsent({ analytics: false, marketing: false }));
  }

  function savePreferences(analytics: boolean, marketing: boolean): void {
    commit(defaultConsent({ analytics, marketing }));
  }

  return {
    consent,
    hasDecision,
    acceptAll,
    rejectOptional,
    savePreferences,
  };
}
