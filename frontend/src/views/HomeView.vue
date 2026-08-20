<script setup lang="ts">
import { RouterLink } from "vue-router";
import PawMark from "../components/PawMark.vue";
import { translateLocation } from "../router";
import { HOME_FAQ } from "../seo/site";
import { useTranslatorStore } from "../stores/translator";

useTranslatorStore().leavePage();

const kinds = [
  {
    id: "cat",
    name: "Кошка",
    label: "Мяукание — сигнал к человеку, не «слово»",
    text: "Взрослое мяу почти не звучит между кошками. Тип звука и ситуация (еда, дверь, одиночество) важнее «угадайки» без контекста.",
  },
  {
    id: "dog",
    name: "Собака",
    label: "Лай зависит от ситуации",
    text: "Лай при игре, от одиночества или от тревоги — разные правила. Без контекста перевод остаётся слабым.",
  },
  {
    id: "chicken",
    name: "Курица",
    label: "Крик указывает на событие",
    text: "Пищевой крик и тревоги на воздух или землю называют, что случилось. Ближе к «переводу», чем лай или мяу.",
  },
] as const;
</script>

<template>
  <div class="home">
    <div class="home-inner">
      <div class="home-logo" aria-hidden="true">
        <PawMark />
      </div>
      <header class="home-hero">
        <p class="kicker">Справочник сигналов животных</p>
        <h1>Что означает звук вашего питомца — с учётом вида и ситуации</h1>
        <p class="home-lede">
          Выберите животное, тип звука и что происходит рядом — сервис подберёт вероятный перевод по
          правилам из этологических статей. У кошки, собаки и курицы логика разная. Это не
          распознавание записи и не «переводчик мыслей».
        </p>
        <RouterLink class="cta" :to="translateLocation()">Подобрать перевод</RouterLink>
      </header>

      <section class="home-section">
        <p class="kicker">Как это работает</p>
        <h2>Как понять сигнал животного без догадок</h2>
        <div class="home-steps">
          <article class="block-card">
            <p class="kicker">1</p>
            <h3>Вид</h3>
            <p class="muted">
              Кошка, собака и курица читаются по разной логике. Одно правило на всех видов не
              подходит.
            </p>
          </article>
          <article class="block-card">
            <p class="kicker">2</p>
            <h3>Звук, контекст, поведение</h3>
            <p class="muted">
              Вы выбираете, что слышно и что происходит рядом: еда, одиночество, игра, угроза.
            </p>
          </article>
          <article class="block-card">
            <p class="kicker">3</p>
            <h3>Вероятный перевод</h3>
            <p class="muted">
              Ответ — перефраз из статьи, уверенность, другие трактовки и источники именно этого
              правила.
            </p>
          </article>
        </div>
      </section>

      <section class="home-section">
        <p class="kicker">Отличие</p>
        <h2>Чем это не похоже на переводчик по записи</h2>
        <div class="home-contrast block-card">
          <p class="muted">
            Приложения с микрофоном слушают запись и выдают игривую фразу от первого лица — «я хочу
            есть», «открой дверь». Здесь другой подход:
          </p>
          <ul class="home-list">
            <li>вы сами выбираете тип сигнала из справочника — без записи звука;</li>
            <li>учитываются вид, контекст и поведение — как в научных работах;</li>
            <li>
              ответ сопровождается уверенностью, альтернативами и ссылками на статьи — не «словарь
              гав = да».
            </li>
          </ul>
        </div>
      </section>

      <section class="home-section">
        <p class="kicker">Виды</p>
        <h2>Кошка, собака, курица — разная логика</h2>
        <div class="home-kinds">
          <RouterLink
            v-for="kind in kinds"
            :key="kind.id"
            class="home-kind"
            :to="`/guides/${kind.id}`"
          >
            <h3>{{ kind.name }}</h3>
            <p class="note">{{ kind.label }}</p>
            <p class="muted">{{ kind.text }}</p>
            <span class="home-kind-go">Открыть справочник</span>
          </RouterLink>
        </div>
      </section>

      <section class="home-section">
        <p class="kicker">Читать</p>
        <h2>Статьи и разборы ситуаций</h2>
        <p class="muted home-inline-links">
          <RouterLink to="/articles">Все статьи</RouterLink>
          ·
          <RouterLink to="/how-it-works">Как работает сервис</RouterLink>
          ·
          <RouterLink to="/faq">Полный FAQ</RouterLink>
        </p>
      </section>

      <section class="home-section home-faq">
        <p class="kicker">Вопросы</p>
        <h2>Частые вопросы</h2>
        <div class="home-faq-list">
          <details v-for="item in HOME_FAQ" :key="item.question" class="home-faq-item">
            <summary>{{ item.question }}</summary>
            <p class="muted">{{ item.answer }}</p>
          </details>
        </div>
        <p class="home-faq-more">
          <RouterLink to="/faq">Ещё вопросы в FAQ →</RouterLink>
        </p>
      </section>
    </div>
  </div>
</template>
