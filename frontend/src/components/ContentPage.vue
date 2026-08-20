<script setup lang="ts">
import { RouterLink } from "vue-router";

withDefaults(
  defineProps<{
    backTo?: string;
    backLabel?: string;
  }>(),
  {
    backTo: "/",
    backLabel: "← На главную",
  },
);
</script>

<template>
  <div class="content-page">
    <div class="content-inner">
      <RouterLink class="content-back" :to="backTo">{{ backLabel }}</RouterLink>
      <slot />
    </div>
  </div>
</template>
