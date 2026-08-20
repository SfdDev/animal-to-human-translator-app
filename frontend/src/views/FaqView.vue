<script setup lang="ts">
import { RouterLink } from "vue-router";
import ContentPage from "../components/ContentPage.vue";
import { FAQ_PAGE } from "../content/faq";
</script>

<template>
  <ContentPage>
    <p class="kicker">Справочник</p>
    <h1>Частые вопросы</h1>
    <p class="content-lede muted">
      Как устроен перевод сигналов, чем сервис отличается от приложений с микрофоном и когда нужен
      ветеринар.
    </p>

    <div class="home-faq-list content-faq">
      <details v-for="item in FAQ_PAGE" :key="item.question" class="home-faq-item">
        <summary>{{ item.question }}</summary>
        <p class="muted">{{ item.answer }}</p>
      </details>
    </div>

    <p class="content-cta-row">
      <RouterLink class="cta" to="/perevod">Подобрать перевод</RouterLink>
      <RouterLink class="content-text-link" to="/how-it-works">Как это работает</RouterLink>
    </p>
  </ContentPage>
</template>
