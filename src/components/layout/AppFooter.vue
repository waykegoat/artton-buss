<script setup lang="ts">
import { business } from '@/config/business'
import { useContentStore } from '@/stores/content'

const contentStore = useContentStore()
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <div>
        <strong>{{ business.name }}</strong>
        <p>Натяжные потолки и тонировка в Заречном, Пензе и Пензенской области.</p>
        <p>{{ contentStore.content.facts.hours }}</p>
      </div>
      <nav aria-label="Ссылки в подвале">
        <RouterLink to="/services">Услуги</RouterLink>
        <RouterLink to="/portfolio">Портфолио</RouterLink>
        <RouterLink to="/contacts">Контакты</RouterLink>
        <a :href="business.social.vk" target="_blank" rel="noopener noreferrer">VK</a>
        <a :href="business.social.max" target="_blank" rel="noopener noreferrer">MAX</a>
      </nav>
      <div>
        <a class="site-footer__phone" :href="business.phone.href">
          {{ business.phone.display }}
        </a>
        <p>© {{ new Date().getFullYear() }} {{ business.name }}</p>
      </div>
    </div>
  </footer>
</template>
