<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()
const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  void contentStore.load()
})

useHead({
  htmlAttrs: { lang: 'ru' },
  titleTemplate: (title) => (title ? `${title} — Art Ton` : 'Art Ton'),
})
</script>

<template>
  <RouterView v-if="isAdminRoute" />
  <div v-else class="app-shell">
    <AppHeader />
    <main id="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
