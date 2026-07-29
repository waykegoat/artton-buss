<script setup lang="ts">
import type { PortfolioItem } from '@/content/site'

defineProps<{
  project: PortfolioItem
  priority?: boolean
}>()
</script>

<template>
  <article class="portfolio-card">
    <img
      :src="project.image"
      :alt="project.imageAlt"
      width="720"
      height="540"
      :loading="priority ? 'eager' : 'lazy'"
      decoding="async"
    />
    <div class="portfolio-card__content">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
    </div>
  </article>
</template>
