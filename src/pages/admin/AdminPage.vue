<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

useSeoMeta({
  title: 'Управление сайтом',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <section class="admin-placeholder">
    <div class="container">
      <p class="eyebrow">Art Ton CMS</p>
      <h1>Панель управления</h1>
      <p>Раздел будет подключён к защищённому API после выбора способа авторизации.</p>
    </div>
  </section>
</template>
