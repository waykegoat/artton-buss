<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string | undefined
    title: string
    description?: string | undefined
    align?: 'start' | 'center'
  }>(),
  {
    eyebrow: undefined,
    description: undefined,
    align: 'start',
  },
)
</script>

<template>
  <header class="section-heading" :data-align="align">
    <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="description" class="section-heading__description">{{ description }}</p>
  </header>
</template>
