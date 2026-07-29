<script setup lang="ts">
import { useHead } from '@unhead/vue'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

useHead({
  htmlAttrs: { lang: 'ru' },
  titleTemplate: (title) => (title ? `${title} — Art Ton` : 'Art Ton'),
})
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main id="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
