<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LeadForm from '@/components/forms/LeadForm.vue'
import PageIntro from '@/components/ui/PageIntro.vue'
import { business, type LeadIntent } from '@/config/business'

const route = useRoute()
const initialIntent = computed<LeadIntent>(() =>
  route.query.intent === 'tinting-consultation' ? 'tinting-consultation' : 'ceiling-measure',
)

useSeoMeta({
  title: 'Контакты и запись',
  description:
    'Связаться с Art Ton в Заречном и Пензе: запись на бесплатный замер потолка или консультация по тонировке окон.',
})
</script>

<template>
  <PageIntro
    eyebrow="Контакты"
    title="Расскажите, что нужно сделать"
    description="Для потолка согласуем бесплатный замер. Для тонировки сначала разберём задачу на консультации."
  >
    <template #aside>
      <div class="contact-direct">
        <span>Позвонить</span>
        <a :href="business.phone.href">{{ business.phone.display }}</a>
        <p>{{ business.coverageLabel }}</p>
      </div>
    </template>
  </PageIntro>

  <section id="request" class="section section--muted contact-section">
    <div class="container contact-section__grid">
      <div>
        <p class="eyebrow">Заявка</p>
        <h2>Выберите направление</h2>
        <p>
          Оставьте номер телефона и короткий комментарий. Мы используем данные только для ответа на
          заявку.
        </p>
        <ul class="contact-area-list">
          <li v-for="area in business.serviceAreas" :key="area">{{ area }}</li>
        </ul>
      </div>
      <LeadForm :initial-intent="initialIntent" />
    </div>
  </section>
</template>
