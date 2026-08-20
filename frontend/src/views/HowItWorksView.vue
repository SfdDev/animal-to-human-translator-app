<script setup lang="ts">
import { RouterLink } from "vue-router";
import ContentPage from "../components/ContentPage.vue";
</script>

<template>
  <ContentPage>
    <p class="kicker">О сервисе</p>
    <h1>Как работает перевод сигналов</h1>
    <p class="content-lede muted">
      Кратко: вы описываете сигнал — вид, звук, ситуацию — сервис сопоставляет это с правилами из
      научных статей и показывает вероятный смысл со ссылками на источники.
    </p>

    <section class="content-section">
      <h2>1. Вы выбираете вид</h2>
      <p>
        Кошка, собака и курица читаются по разной логике. Одно «универсальное» правило на всех
        животных не подходит: мяу — чаще запрос к человеку, лай зависит от ситуации, крики кур
        ближе к сообщению о событии.
      </p>
    </section>

    <section class="content-section">
      <h2>2. Звук, контекст, поведение</h2>
      <p>
        Сначала звук. Затем — только те контексты и поведения, для которых в каталоге есть правила
        с этим звуком. Если у звука нет узких правил с ситуацией, достаточно самого звука.
      </p>
    </section>

    <section class="content-section">
      <h2>3. Вероятный перевод</h2>
      <p>
        Ответ — перефраз из статьи, оценка уверенности, альтернативные трактовки и источники
        именно этого правила. Если данных мало, перевод помечается как неуверенный.
      </p>
    </section>

    <section class="content-section">
      <h2>Чего нет</h2>
      <ul>
        <li>записи с микрофона и распознавания аудио;</li>
        <li>словаря «гав = да» или фраз от первого лица;</li>
        <li>диагноза и замены консультации ветеринара.</li>
      </ul>
    </section>

    <section class="content-section">
      <h2>Куда дальше</h2>
      <ul>
        <li>
          <RouterLink to="/perevod">Форма перевода</RouterLink> — подобрать смысл сигнала;
        </li>
        <li>
          <RouterLink to="/guides">Справочник по видам</RouterLink> — кошка, собака, курица;
        </li>
        <li>
          <RouterLink to="/articles">Статьи</RouterLink> — разборы типичных ситуаций;
        </li>
        <li>
          <RouterLink to="/faq">FAQ</RouterLink> — частые вопросы.
        </li>
      </ul>
    </section>

    <p class="content-cta-row">
      <RouterLink class="cta" to="/perevod">Открыть перевод</RouterLink>
    </p>
  </ContentPage>
</template>
