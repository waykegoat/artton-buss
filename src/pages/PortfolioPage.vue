<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

import PageIntro from '@/components/ui/PageIntro.vue'

useSeoMeta({
  title: 'Портфолио',
  description: 'Реализованные проекты натяжных потолков Art Ton в Пензе и области.',
})
</script>

<template>
  <PageIntro
    eyebrow="Портфолио"
    title="Наши работы говорят за нас"
    description="Здесь появятся реальные проекты с типом потолка, освещением и особенностями монтажа."
  />
</template>
