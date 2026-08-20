<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import PawMark from "./PawMark.vue";

const visible = ref(false);
const THRESHOLD = 280;

function currentTop(): number {
  const app = document.getElementById("app");
  return Math.max(
    window.scrollY || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
    app?.scrollTop || 0,
  );
}

function update(): void {
  visible.value = currentTop() > THRESHOLD;
}

function toTop(): void {
  const opts = { top: 0, behavior: "smooth" as const };
  window.scrollTo(opts);
  document.documentElement.scrollTo(opts);
  document.body.scrollTo(opts);
  document.getElementById("app")?.scrollTo(opts);
}

onMounted(() => {
  update();
  window.addEventListener("scroll", update, { passive: true });
  document.getElementById("app")?.addEventListener("scroll", update, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", update);
  document.getElementById("app")?.removeEventListener("scroll", update);
});
</script>

<template>
  <button
    v-if="visible"
    type="button"
    class="scroll-top"
    aria-label="Наверх"
    title="Наверх"
    @click="toTop"
  >
    <PawMark />
  </button>
</template>
