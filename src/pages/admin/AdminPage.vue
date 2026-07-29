<script setup lang="ts">
import { useSeoMeta } from '@unhead/vue'
import { onMounted, ref } from 'vue'

import type { PublicContent } from '../../../shared/content'
import { useAdminDraftStore } from '@/stores/adminDraft'
import { apiUrl, assetUrl, isDemoBuild } from '@/utils/url'

type LeadStatus = 'new' | 'contacted' | 'completed' | 'spam'

interface Lead {
  id: string
  intent: 'ceiling-measure' | 'tinting-consultation'
  name: string
  phone: string
  comment: string
  status: LeadStatus
  source: string
  createdAt: number
  updatedAt: number
}

const serviceLabels: Record<string, string> = {
  satin: 'Сатиновые потолки',
  matte: 'Матовые потолки',
  glossy: 'Глянцевые потолки',
  fabric: 'Тканевые потолки',
  'single-level': 'Одноуровневые потолки',
  'two-level': 'Двухуровневые потолки',
  'photo-print': 'Потолки с фотопечатью',
}

const statusLabels: Record<LeadStatus, string> = {
  new: 'Новая',
  contacted: 'Связались',
  completed: 'Завершена',
  spam: 'Спам',
}

const username = ref('')
const password = ref('')
const authenticated = ref(false)
const loading = ref(true)
const actionPending = ref(false)
const error = ref('')
const message = ref('')
const activeTab = ref<'leads' | 'content'>('leads')
const leads = ref<Lead[]>([])
const draftStore = useAdminDraftStore()
const contentDraft = draftStore.content

useSeoMeta({
  title: 'Управление сайтом',
  robots: 'noindex, nofollow',
})

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  headers.set('accept', 'application/json')
  if (options.body) headers.set('content-type', 'application/json')

  const response = await globalThis.fetch(apiUrl(url), {
    ...options,
    credentials: 'same-origin',
    headers,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error ?? 'Не удалось выполнить запрос')
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

function applyContent(content: PublicContent): void {
  draftStore.replace(content)
}

async function loadDashboard(loadContent = true): Promise<void> {
  const [content, leadPayload] = await Promise.all([
    request<PublicContent>('/api/admin/content'),
    request<{ leads: Lead[] }>('/api/admin/leads'),
  ])
  if (loadContent) applyContent(content)
  leads.value = leadPayload.leads
}

async function checkSession(): Promise<void> {
  if (isDemoBuild) {
    loading.value = false
    return
  }

  try {
    await request('/api/auth/session')
    authenticated.value = true
    const restored = draftStore.hydrate()
    await loadDashboard(!restored)
    draftStore.startPersistence()
    if (restored) message.value = 'Восстановлен несохранённый черновик'
  } catch {
    authenticated.value = false
  } finally {
    loading.value = false
  }
}

async function login(): Promise<void> {
  if (isDemoBuild) {
    error.value = 'В демо-версии вход отключён. Рабочая панель подключается вместе с сервером.'
    return
  }

  actionPending.value = true
  error.value = ''
  try {
    await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: username.value, password: password.value }),
    })
    authenticated.value = true
    password.value = ''
    await loadDashboard()
    draftStore.startPersistence()
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Не удалось войти'
  } finally {
    actionPending.value = false
  }
}

async function logout(): Promise<void> {
  await request('/api/auth/logout', { method: 'POST' })
  authenticated.value = false
  leads.value = []
}

async function saveContent(): Promise<void> {
  actionPending.value = true
  error.value = ''
  message.value = ''
  try {
    const saved = await request<PublicContent>('/api/admin/content', {
      method: 'PUT',
      body: JSON.stringify(contentDraft),
    })
    applyContent(saved)
    draftStore.clear()
    message.value = 'Изменения сохранены'
  } catch (reason) {
    error.value = reason instanceof Error ? reason.message : 'Не удалось сохранить изменения'
  } finally {
    actionPending.value = false
  }
}

async function updateLeadStatus(lead: Lead, event: Event): Promise<void> {
  const status = (event.target as HTMLSelectElement).value as LeadStatus
  const previous = lead.status
  lead.status = status
  try {
    await request(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  } catch (reason) {
    lead.status = previous
    error.value = reason instanceof Error ? reason.message : 'Не удалось изменить статус'
  }
}

function updatePriceValue(key: string, event: Event): void {
  const price = contentDraft.prices[key]
  if (!price) return
  const raw = (event.target as HTMLInputElement).value
  price.value = raw ? Number(raw) : null
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

onMounted(() => {
  void checkSession()
})
</script>

<template>
  <section v-if="loading" class="admin-loading" aria-live="polite">Загружаем панель…</section>

  <section v-else-if="!authenticated" class="admin-login">
    <div class="admin-login__panel">
      <RouterLink class="brand" to="/" aria-label="Art Ton — на главную">
        <img :src="assetUrl('/logo-hq.png')" alt="" width="52" height="52" />
        <span>Art Ton</span>
      </RouterLink>
      <div>
        <p class="eyebrow">Панель управления</p>
        <h1>Вход</h1>
        <p>Введите отдельный логин и пароль администратора.</p>
      </div>
      <form @submit.prevent="login">
        <label>
          <span>Логин</span>
          <input v-model.trim="username" name="username" autocomplete="username" required />
        </label>
        <label>
          <span>Пароль</span>
          <input
            v-model="password"
            name="password"
            type="password"
            autocomplete="current-password"
            minlength="12"
            required
          />
        </label>
        <button class="button" type="submit" :disabled="actionPending">
          {{ actionPending ? 'Проверяем…' : 'Войти' }}
        </button>
        <p v-if="error" class="form-status form-status--error" role="alert">{{ error }}</p>
      </form>
    </div>
  </section>

  <div v-else class="admin-shell">
    <header class="admin-header">
      <div>
        <strong>Art Ton</strong>
        <span>Управление сайтом</span>
      </div>
      <div class="admin-header__actions">
        <RouterLink to="/">Открыть сайт</RouterLink>
        <button type="button" @click="logout">Выйти</button>
      </div>
    </header>

    <main class="admin-main">
      <header class="admin-main__heading">
        <div>
          <p class="eyebrow">Админ-панель</p>
          <h1>Сайт и заявки</h1>
        </div>
        <nav class="admin-tabs" aria-label="Разделы панели">
          <button type="button" :aria-pressed="activeTab === 'leads'" @click="activeTab = 'leads'">
            Заявки
            <span>{{ leads.filter((lead) => lead.status === 'new').length }}</span>
          </button>
          <button
            type="button"
            :aria-pressed="activeTab === 'content'"
            @click="activeTab = 'content'"
          >
            Контент и цены
          </button>
        </nav>
      </header>

      <p v-if="error" class="form-status form-status--error" role="alert">{{ error }}</p>
      <p v-if="message" class="form-status form-status--success" role="status">{{ message }}</p>

      <section v-if="activeTab === 'leads'" class="admin-section">
        <div class="admin-section__heading">
          <div>
            <h2>Заявки с сайта</h2>
            <p>Новые обращения также отправляются в Telegram.</p>
          </div>
          <button class="admin-refresh" type="button" @click="loadDashboard()">Обновить</button>
        </div>

        <div v-if="leads.length" class="lead-list">
          <article v-for="lead in leads" :key="lead.id">
            <div class="lead-list__meta">
              <span>
                {{ lead.intent === 'ceiling-measure' ? 'Замер потолка' : 'Тонировка окон' }}
              </span>
              <time :datetime="new Date(lead.createdAt).toISOString()">
                {{ formatDate(lead.createdAt) }}
              </time>
            </div>
            <h3>{{ lead.name }}</h3>
            <a :href="`tel:${lead.phone}`">{{ lead.phone }}</a>
            <p v-if="lead.comment">{{ lead.comment }}</p>
            <label>
              <span>Статус</span>
              <select :value="lead.status" @change="updateLeadStatus(lead, $event)">
                <option v-for="(label, value) in statusLabels" :key="value" :value="value">
                  {{ label }}
                </option>
              </select>
            </label>
          </article>
        </div>
        <p v-else class="admin-empty">Заявок пока нет.</p>
      </section>

      <section v-else class="admin-section">
        <div class="admin-section__heading">
          <div>
            <h2>Факты о компании</h2>
            <p>Эти данные отображаются на публичных страницах.</p>
          </div>
        </div>

        <form class="content-form" @submit.prevent="saveContent">
          <div class="content-form__facts">
            <label>
              <span>Стаж, лет</span>
              <input
                v-model.number="contentDraft.facts.experienceYears"
                type="number"
                min="0"
                max="100"
                required
              />
            </label>
            <label>
              <span>Гарантия до, лет</span>
              <input
                v-model.number="contentDraft.facts.warrantyYears"
                type="number"
                min="0"
                max="100"
                required
              />
            </label>
            <label>
              <span>График работы</span>
              <input v-model.trim="contentDraft.facts.hours" maxlength="80" required />
            </label>
            <label>
              <span>Регион работы</span>
              <input v-model.trim="contentDraft.facts.serviceRegion" maxlength="160" required />
            </label>
          </div>

          <div class="admin-section__heading content-form__prices-heading">
            <div>
              <h2>Цены</h2>
              <p>Цена появится на сайте только после включения переключателя.</p>
            </div>
          </div>

          <div class="price-editor">
            <fieldset v-for="(price, key) in contentDraft.prices" :key="key">
              <legend>{{ serviceLabels[key] ?? key }}</legend>
              <label>
                <span>Цена от</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  :value="price.value ?? ''"
                  @input="updatePriceValue(key, $event)"
                />
              </label>
              <label>
                <span>Единица</span>
                <input v-model.trim="price.unit" maxlength="20" />
              </label>
              <label class="price-editor__toggle">
                <input v-model="price.visible" type="checkbox" />
                <span>Показывать на сайте</span>
              </label>
            </fieldset>
          </div>

          <button class="button" type="submit" :disabled="actionPending">
            {{ actionPending ? 'Сохраняем…' : 'Сохранить изменения' }}
          </button>
        </form>
      </section>
    </main>
  </div>
</template>
