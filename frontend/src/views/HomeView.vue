<script setup lang="ts">
import { RouterLink } from "vue-router";
import PawMark from "../components/PawMark.vue";
import { translateLocation } from "../router";
import { useTranslatorStore } from "../stores/translator";

useTranslatorStore().leavePage();

const kinds = [
  {
    id: "cat",
    name: "Кошка",
    label: "Сигнал к человеку, не «слово»",
    text: "Взрослое мяу почти не звучит между кошками — это запрос к человеку. Тип звука читается увереннее, чем «смысл мяу» без ситуации.",
  },
  {
    id: "dog",
    name: "Собака",
    label: "Сила звука зависит от ситуации",
    text: "Лай — не слова. Акустика связана с тревогой, изоляцией или игрой, но игра и одиночество похожи. Без контекста перевод слабый.",
  },
  {
    id: "chicken",
    name: "Курица",
    label: "Крик указывает на событие",
    text: "Пищевой крик и тревоги на воздух или землю называют, что случилось. Это ближе к переводу, чем лай или мяу.",
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
        <p class="kicker">Сигналы животных</p>
        <h1>Смысл сигнала зависит от вида и ситуации</h1>
        <p class="home-lede">
          Приложение сопоставляет тип звука, контекст и поведение с правилами из научных статей. У
          кошки, собаки и курицы логика разная: одно и то же «звучит похоже» не значит одно и то же.
        </p>
        <RouterLink class="cta" :to="translateLocation()">Попробовать</RouterLink>
      </header>

      <section class="home-section">
        <p class="kicker">Как это устроено</p>
        <h2>От вида к правилу из статьи</h2>
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
        <p class="kicker">Виды</p>
        <h2>Откройте перевод для одного животного</h2>
        <div class="home-kinds">
          <RouterLink
            v-for="kind in kinds"
            :key="kind.id"
            class="home-kind"
            :to="translateLocation(kind.id)"
          >
            <h3>{{ kind.name }}</h3>
            <p class="note">{{ kind.label }}</p>
            <p class="muted">{{ kind.text }}</p>
            <span class="home-kind-go">Перейти к переводу</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>
</template>
