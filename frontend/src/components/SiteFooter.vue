<script setup lang="ts">
import { RouterLink } from "vue-router";
import { OPERATOR_EMAIL, OPERATOR_NAME } from "../constants/legal";
import { PDF_DOCUMENTS } from "../content/documents";
</script>

<template>
  <footer class="site-footer">
    <p class="site-footer-note">
      Информация на сайте носит образовательный характер и не заменяет консультацию ветеринара.
    </p>
    <nav class="site-footer-nav" aria-label="Разделы сайта">
      <RouterLink to="/perevod">Перевод</RouterLink>
      <RouterLink to="/guides">Справочник</RouterLink>
      <RouterLink to="/articles">Статьи</RouterLink>
      <RouterLink to="/faq">FAQ</RouterLink>
      <RouterLink to="/how-it-works">Как работает</RouterLink>
      <a :href="`mailto:${OPERATOR_EMAIL}`">{{ OPERATOR_EMAIL }}</a>
    </nav>
    <nav class="site-footer-docs" aria-label="Документы">
      <div class="site-footer-docs-links">
        <a v-for="doc in PDF_DOCUMENTS" :key="doc.slug" :href="doc.pdf">
          {{ doc.shortTitle }}
        </a>
      </div>
    </nav>
    <p class="site-footer-operator muted">Оператор: {{ OPERATOR_NAME }}</p>
  </footer>
</template>
