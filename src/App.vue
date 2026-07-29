<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { business } from '@/config/business'
import { useContentStore } from '@/stores/content'
import { assetUrl } from '@/utils/url'

const contentStore = useContentStore()
const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const siteUrl = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')

onMounted(() => {
  void contentStore.load()
})

useHead(() => {
  const canonicalUrl = siteUrl && !isAdminRoute.value ? `${siteUrl}${route.path}` : undefined
  const socialImage = siteUrl ? `${siteUrl}/og.png` : assetUrl('/og.png')
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: business.name,
    url: siteUrl || undefined,
    telephone: '+79875051859',
    sameAs: [business.social.vk, business.social.max],
    areaServed: business.serviceAreas,
    openingHours: 'Mo-Sa 09:00-20:00',
    serviceType: ['Натяжные потолки', 'Тонировка окон'],
  }

  return {
    htmlAttrs: { lang: 'ru' },
    titleTemplate: (title) => (title ? `${title} — Art Ton` : 'Art Ton'),
    link: canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : [],
    meta: canonicalUrl
      ? [
          { property: 'og:url', content: canonicalUrl },
          { property: 'og:type', content: 'website' },
          { property: 'og:locale', content: 'ru_RU' },
          { property: 'og:site_name', content: business.name },
          { property: 'og:image', content: socialImage },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:image', content: socialImage },
        ]
      : [],
    script: isAdminRoute.value
      ? []
      : [
          {
            type: 'application/ld+json',
            textContent: JSON.stringify(structuredData),
          },
        ],
  }
})
</script>

<template>
  <RouterView v-if="isAdminRoute" />
  <div v-else class="app-shell">
    <a class="skip-link" href="#main-content">К содержанию</a>
    <AppHeader />
    <main id="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
