<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Страница не найдена',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <section class="not-found">
    <div class="container">
      <p class="eyebrow">Ошибка 404</p>
      <h1>Такой страницы нет</h1>
      <RouterLink class="button" to="/">Вернуться на главную</RouterLink>
    </div>
  </section>
</template>
