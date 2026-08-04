<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'

import PortfolioCard from '@/components/portfolio/PortfolioCard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import { business } from '@/config/business'
import { faq, portfolio, processSteps, services } from '@/content/site'
import { useContentStore } from '@/stores/content'
import { assetUrl } from '@/utils/url'

const featuredServices = services.filter((service) =>
  ['track-light', 'light-lines', 'window-tinting'].includes(service.id),
)
const featuredProjectIds = ['track-1', 'air-1', 'photo-3', 'tinting-1']
const featuredProjects = featuredProjectIds.flatMap((id) => {
  const project = portfolio.find((item) => item.id === id)
  return project ? [project] : []
})
const contentStore = useContentStore()

useSeoMeta({
  title: 'Монтаж натяжных потолков и солнцезащитных плёнок в Пензе и Заречном',
  description:
    'Натяжные потолки и тонировка окон в Заречном, Пензе и Пензенской области. Бесплатный замер потолка, консультация по тонировке и реальные работы.',
})
</script>

<template>
  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__content">
        <p class="eyebrow">{{ business.coverageLabel }}</p>
        <h1>Монтаж натяжных потолков и солнцезащитных плёнок с долгосрочной гарантией качества.</h1>
        <p class="hero__lead">
          Устанавливаем натяжные потолки, проектируем освещение и тонируем окна. Решение начинается
          с вашей задачи, а не с готового шаблона.
        </p>
        <div class="hero__actions">
          <a class="button" :href="business.phone.href">Позвонить</a>
          <a
            class="button button--secondary"
            :href="business.social.vk"
            target="_blank"
            rel="noopener noreferrer"
          >
            Мы в VK
          </a>
          <a
            class="button button--secondary"
            :href="business.social.max"
            target="_blank"
            rel="noopener noreferrer"
          >
            Мы в MAX
          </a>
        </div>
        <ul class="hero__facts" aria-label="Основные преимущества">
          <li>{{ contentStore.content.facts.experienceYears }} лет опыта</li>
          <li>Гарантия до {{ contentStore.content.facts.warrantyYears }} лет</li>
          <li>{{ contentStore.content.facts.hours }}</li>
        </ul>
      </div>

      <figure class="hero-visual">
        <img
          :src="assetUrl('/images/tracklight/tracklight1.jpg')"
          alt="Натяжной потолок Art Ton со встроенной трековой системой"
          width="960"
          height="720"
          fetchpriority="high"
        />
        <figcaption>
          <span>Реализованный проект</span>
          <strong>Трековое освещение</strong>
        </figcaption>
      </figure>
    </div>
    <div class="hero-marquee" aria-hidden="true">
      <span>Натяжные потолки</span>
      <span>Трековый свет</span>
      <span>Фотопечать</span>
      <span>Тонировка окон</span>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <SectionHeading
        eyebrow="Возможности"
        title="Не просто ровная поверхность"
        description="Потолок задаёт свет и геометрию интерьера, а тонировка помогает управлять приватностью и яркостью."
      />

      <div class="service-showcase">
        <article
          v-for="(service, index) in featuredServices"
          :key="service.id"
          class="service-card"
        >
          <div class="service-card__image">
            <img
              :src="service.image"
              :alt="service.imageAlt"
              width="720"
              height="520"
              loading="lazy"
              decoding="async"
            />
            <span>0{{ index + 1 }}</span>
          </div>
          <div class="service-card__content">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <RouterLink class="text-link" to="/services">Подробнее об услуге</RouterLink>
          </div>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container">
      <SectionHeading
        eyebrow="Портфолио"
        title="Результат видно сразу"
        description="Показываем реальные объекты без визуализаций и чужих фотографий."
      />

      <div class="portfolio-grid portfolio-grid--featured">
        <PortfolioCard
          v-for="(project, index) in featuredProjects"
          :key="project.id"
          :project="project"
          :priority="index === 0"
        />
      </div>

      <div class="section-action">
        <RouterLink class="button button--light" to="/portfolio">Открыть всё портфолио</RouterLink>
      </div>
    </div>
  </section>

  <section class="section process">
    <div class="container">
      <SectionHeading
        eyebrow="Как работаем"
        title="Понятный путь до результата"
        description="Разные услуги начинаются по-разному, но на каждом этапе вы понимаете, что будет дальше."
      />
      <ol class="process-list">
        <li v-for="step in processSteps" :key="step.number">
          <span>{{ step.number }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section section--muted">
    <div class="container">
      <SectionHeading eyebrow="Вопросы" title="Коротко о главном" />
      <div class="faq-list">
        <details v-for="item in faq" :key="item.question">
          <summary>{{ item.question }} <span aria-hidden="true">+</span></summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container cta-panel">
      <div>
        <p class="eyebrow">Начнём с вашей задачи</p>
        <h2>Потолок — на замер.<br />Тонировка — на консультацию.</h2>
      </div>
      <div class="cta-panel__actions">
        <a class="button" :href="business.phone.href">Позвонить</a>
        <div class="social-actions">
          <a :href="business.social.vk" target="_blank" rel="noopener noreferrer">Мы в VK</a>
          <a :href="business.social.max" target="_blank" rel="noopener noreferrer">Мы в MAX</a>
        </div>
        <a class="phone-link" :href="business.phone.href">{{ business.phone.display }}</a>
      </div>
    </div>
  </section>
</template>
