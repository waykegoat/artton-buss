<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import LeadForm from '@/components/forms/LeadForm.vue'
import PageIntro from '@/components/ui/PageIntro.vue'
import { business } from '@/config/business'

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
        <div class="contact-direct__social">
          <a :href="business.social.vk" target="_blank" rel="noopener noreferrer">Мы в VK</a>
          <a :href="business.social.max" target="_blank" rel="noopener noreferrer">Мы в MAX</a>
        </div>
      </div>
    </template>
  </PageIntro>

  <section id="request" class="section section--muted contact-section">
    <div class="container contact-section__grid">
      <div>
        <p class="eyebrow">Быстрая связь</p>
        <h2>Позвоните или напишите нам</h2>
        <p>
          Можно оставить заявку — мы перезвоним. А если удобнее написать прямо сейчас, переходите в
          VK или MAX.
        </p>
        <div class="contact-social-actions" aria-label="Написать Art Ton">
          <a :href="business.social.vk" target="_blank" rel="noopener noreferrer">Мы в VK</a>
          <a :href="business.social.max" target="_blank" rel="noopener noreferrer">Мы в MAX</a>
        </div>
        <ul class="contact-area-list">
          <li v-for="area in business.serviceAreas" :key="area">{{ area }}</li>
        </ul>
      </div>
      <LeadForm />
    </div>
  </section>
</template>
