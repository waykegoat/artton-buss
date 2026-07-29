<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

import PageIntro from '@/components/ui/PageIntro.vue'
import { leadIntents } from '@/config/business'

useSeoMeta({
  title: 'Натяжные потолки и тонировка',
  description: 'Натяжные потолки и тонировка Art Ton в Заречном, Пензе и Пензенской области.',
})
</script>

<template>
  <PageIntro
    eyebrow="Услуги"
    title="Два направления — один стандарт качества"
    description="Для потолков начинаем с замера, для тонировки — с консультации и выбора решения."
  />

  <section class="service-split service-split--page">
    <div class="container service-split__grid">
      <article>
        <p class="eyebrow">01 / Потолки</p>
        <h2>Натяжные потолки</h2>
        <p>Конструкции, профили и сценарии освещения под конкретное помещение.</p>
        <RouterLink class="button" to="/contacts?intent=ceiling-measure#request">
          {{ leadIntents['ceiling-measure'].label }}
        </RouterLink>
      </article>
      <article>
        <p class="eyebrow">02 / Тонировка</p>
        <h2>Тонировка</h2>
        <p>Консультация по материалам, особенностям и ожидаемому результату.</p>
        <RouterLink class="button" to="/contacts?intent=tinting-consultation#request">
          {{ leadIntents['tinting-consultation'].label }}
        </RouterLink>
      </article>
    </div>
  </section>
</template>
