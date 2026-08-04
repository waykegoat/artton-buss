<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { business } from '@/config/business'
import { assetUrl } from '@/utils/url'

const { t } = useI18n()
const route = useRoute()
const isMenuOpen = ref(false)

const navigation = computed(() => [
  { label: t('navigation.home'), to: '/' },
  { label: t('navigation.services'), to: '/services' },
  { label: t('navigation.portfolio'), to: '/portfolio' },
  { label: t('navigation.contacts'), to: '/contacts' },
])

function closeMenu(): void {
  isMenuOpen.value = false
}

watch(() => route.path, closeMenu)
</script>

<template>
  <header class="site-header" @keydown.esc="closeMenu">
    <div class="container site-header__inner">
      <RouterLink class="brand" to="/" aria-label="Art Ton — на главную" @click="closeMenu">
        <img :src="assetUrl('/logo-hq.png')" alt="" width="52" height="52" />
        <span>Art Ton</span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="main-navigation"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="sr-only">{{ isMenuOpen ? 'Закрыть меню' : 'Открыть меню' }}</span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </button>

      <nav id="main-navigation" class="navigation" :data-open="isMenuOpen">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :aria-current="route.path === item.to ? 'page' : undefined"
          @click="closeMenu"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <a class="button button--small header-cta" :href="business.phone.href">Позвонить</a>
    </div>
  </header>
</template>
