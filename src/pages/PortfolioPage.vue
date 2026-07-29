<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { computed, ref } from 'vue'

import PortfolioCard from '@/components/portfolio/PortfolioCard.vue'
import PageIntro from '@/components/ui/PageIntro.vue'
import type { PortfolioCategory } from '@/content/site'
import { portfolio } from '@/content/site'

type Filter = 'all' | PortfolioCategory

const activeFilter = ref<Filter>('all')
const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Все работы' },
  { value: 'track', label: 'Трековый свет' },
  { value: 'two-level', label: 'Два уровня' },
  { value: 'photo-print', label: 'Фотопечать' },
  { value: 'tinting', label: 'Тонировка' },
]

const visibleProjects = computed(() =>
  activeFilter.value === 'all'
    ? portfolio
    : portfolio.filter((project) => project.category === activeFilter.value),
)

useSeoMeta({
  title: 'Портфолио натяжных потолков и тонировки',
  description:
    'Реальные работы Art Ton: натяжные потолки, трековое освещение, двухуровневые конструкции, фотопечать и тонировка окон.',
})
</script>

<template>
  <PageIntro
    eyebrow="Портфолио"
    title="Реальные работы Art Ton"
    description="Без стоковых интерьеров: здесь объекты, которые действительно выполнены нашей командой."
  >
    <template #aside>
      <div class="portfolio-intro-stack" aria-hidden="true">
        <img src="/images/tracklight/tracklight4.jpg" alt="" width="480" height="360" />
        <img src="/images/tonirovka/tonirovka4.jpg" alt="" width="360" height="480" />
      </div>
    </template>
  </PageIntro>

  <section class="section portfolio-page">
    <div class="container">
      <div class="portfolio-filters" aria-label="Фильтр работ">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :aria-pressed="activeFilter === filter.value"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>

      <div class="portfolio-grid">
        <PortfolioCard
          v-for="(project, index) in visibleProjects"
          :key="project.id"
          :project="project"
          :priority="index < 2"
        />
      </div>
    </div>
  </section>
</template>
