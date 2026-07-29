<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description: string
}>()
</script>

<template>
  <section class="page-intro">
    <div class="container page-intro__grid">
      <div class="page-intro__inner">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
      </div>
      <div v-if="$slots.aside" class="page-intro__aside">
        <slot name="aside" />
      </div>
    </div>
  </section>
</template>
