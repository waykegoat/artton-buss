<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

import { business, leadIntents } from '@/config/business'

useSeoMeta({
  title: 'Натяжные потолки и тонировка в Заречном и Пензе',
  description:
    'Натяжные потолки и тонировка в Заречном, Пензе и Пензенской области. Бесплатный замер потолка, понятная смета и аккуратная работа.',
})
</script>

<template>
  <section class="hero">
    <div class="container hero__inner">
      <p class="eyebrow">{{ business.coverageLabel }}</p>
      <h1>Потолок, который завершает интерьер</h1>
      <p class="hero__lead">
        Проектируем и устанавливаем натяжные потолки — от лаконичных решений до сложного света.
      </p>
      <div class="hero__actions">
        <RouterLink class="button" to="/contacts?intent=ceiling-measure#request">
          {{ leadIntents['ceiling-measure'].label }}
        </RouterLink>
        <RouterLink class="text-link" to="/portfolio">Посмотреть работы</RouterLink>
      </div>
    </div>
  </section>

  <section class="service-split">
    <div class="container service-split__grid">
      <article>
        <p class="eyebrow">Натяжные потолки</p>
        <h2>От замера до чистого монтажа</h2>
        <p>Подберём конструкцию и свет, подготовим точный расчёт и согласуем дату установки.</p>
        <RouterLink class="text-link" to="/contacts?intent=ceiling-measure#request">
          {{ leadIntents['ceiling-measure'].shortLabel }}
        </RouterLink>
      </article>
      <article>
        <p class="eyebrow">Тонировка</p>
        <h2>Сначала консультация</h2>
        <p>Уточним задачу, предложим подходящий вариант и заранее объясним условия работы.</p>
        <RouterLink class="text-link" to="/contacts?intent=tinting-consultation#request">
          {{ leadIntents['tinting-consultation'].shortLabel }}
        </RouterLink>
      </article>
    </div>
  </section>
</template>
