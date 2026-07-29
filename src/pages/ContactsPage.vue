<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

import PageIntro from '@/components/ui/PageIntro.vue'
import { business, leadIntents } from '@/config/business'

useSeoMeta({
  title: 'Контакты',
  description:
    'Связаться с Art Ton в Заречном и Пензе: запись на замер потолка или консультация по тонировке.',
})
</script>

<template>
  <PageIntro
    eyebrow="Контакты"
    title="Обсудим ваш потолок"
    description="Оставьте контакты — уточним задачу, ответим на вопросы и согласуем удобное время замера."
  />

  <section id="request" class="contact-options">
    <div class="container contact-options__grid">
      <div>
        <p class="eyebrow">Позвонить сейчас</p>
        <a class="contact-options__phone" :href="business.phone.href">
          {{ business.phone.display }}
        </a>
        <p>Работаем в Заречном, Пензе и по Пензенской области.</p>
      </div>
      <div class="contact-options__actions">
        <RouterLink class="button" to="/contacts?intent=ceiling-measure#request">
          {{ leadIntents['ceiling-measure'].label }}
        </RouterLink>
        <RouterLink
          class="button button--secondary"
          to="/contacts?intent=tinting-consultation#request"
        >
          {{ leadIntents['tinting-consultation'].label }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>
