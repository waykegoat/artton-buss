<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

import PageIntro from '@/components/ui/PageIntro.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { leadIntents } from '@/config/business'
import { services } from '@/content/site'
import { useContentStore } from '@/stores/content'

const ceilingServices = services.filter((service) => service.category === 'ceilings')
const tintingServices = services.filter((service) => service.category === 'tinting')
const contentStore = useContentStore()

useSeoMeta({
  title: 'Натяжные потолки и тонировка окон',
  description:
    'Натяжные потолки, трековое освещение, двухуровневые конструкции, фотопечать и тонировка окон в Заречном, Пензе и Пензенской области.',
})
</script>

<template>
  <PageIntro
    eyebrow="Услуги"
    title="Два направления — один стандарт работы"
    description="Для потолков начинаем с бесплатного замера. Для тонировки окон — с консультации и подбора плёнки под вашу задачу."
  >
    <template #aside>
      <img
        src="/images/2layer/2layer2.jpg"
        alt="Светлый натяжной потолок со встроенным освещением"
        width="720"
        height="540"
      />
    </template>
  </PageIntro>

  <section class="section">
    <div class="container">
      <SectionHeading
        eyebrow="01 / Натяжные потолки"
        title="Свет, форма и фактура"
        description="Подбираем конструкцию не отдельно от интерьера, а вместе с освещением и назначением комнаты."
      />
      <div class="service-detail-list">
        <article v-for="(service, index) in ceilingServices" :key="service.id">
          <div class="service-detail-list__image">
            <img
              :src="service.image"
              :alt="service.imageAlt"
              width="720"
              height="540"
              :loading="index === 0 ? 'eager' : 'lazy'"
              decoding="async"
            />
          </div>
          <div class="service-detail-list__content">
            <span>0{{ index + 1 }}</span>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <ul>
              <li v-for="feature in service.features" :key="feature">{{ feature }}</li>
            </ul>
            <p
              v-if="contentStore.content.prices[service.id]?.visible"
              class="service-detail-list__price"
            >
              от {{ contentStore.content.prices[service.id]?.value?.toLocaleString('ru-RU') }}
              {{ contentStore.content.prices[service.id]?.unit }}
            </p>
          </div>
        </article>
      </div>
      <RouterLink class="button" to="/contacts?intent=ceiling-measure#request">
        {{ leadIntents['ceiling-measure'].label }}
      </RouterLink>
    </div>
  </section>

  <section class="section section--dark tinting-feature">
    <div class="container">
      <SectionHeading
        eyebrow="02 / Тонировка окон"
        title="Приватность без тяжёлых штор"
        description="Подходит для окон дома, квартиры, офиса, балкона или веранды. На консультации уточним желаемый эффект и особенности остекления."
      />
      <div class="tinting-feature__grid">
        <div class="tinting-feature__media">
          <img
            :src="tintingServices[0]?.image"
            :alt="tintingServices[0]?.imageAlt"
            width="720"
            height="960"
            loading="lazy"
          />
        </div>
        <div class="tinting-feature__content">
          <p class="tinting-feature__lead">
            Зеркальная и солнцезащитная плёнка меняет восприятие окна и помогает сделать
            пространство комфортнее.
          </p>
          <ul>
            <li v-for="feature in tintingServices[0]?.features" :key="feature">{{ feature }}</li>
          </ul>
          <p
            v-if="contentStore.content.prices['window-tinting']?.visible"
            class="tinting-feature__price"
          >
            от
            {{ contentStore.content.prices['window-tinting']?.value?.toLocaleString('ru-RU') }}
            {{ contentStore.content.prices['window-tinting']?.unit }}
          </p>
          <p>
            Точный вариант плёнки нельзя выбирать только по фотографии — сначала обсуждаем объект и
            ожидаемый результат.
          </p>
          <RouterLink
            class="button button--light"
            to="/contacts?intent=tinting-consultation#request"
          >
            {{ leadIntents['tinting-consultation'].label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
