<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { leadIntents, type LeadIntent } from '@/config/business'

const props = withDefaults(
  defineProps<{
    initialIntent?: LeadIntent
  }>(),
  {
    initialIntent: 'ceiling-measure',
  },
)

const form = reactive({
  intent: props.initialIntent,
  name: '',
  phone: '',
  comment: '',
  consent: false,
})

const status = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const selectedIntent = computed(() => leadIntents[form.intent])

watch(
  () => props.initialIntent,
  (intent) => {
    form.intent = intent
  },
)

async function submit(): Promise<void> {
  status.value = 'submitting'

  try {
    const response = await globalThis.fetch('/api/leads', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!response.ok) throw new Error('Lead request failed')

    status.value = 'success'
    form.name = ''
    form.phone = ''
    form.comment = ''
    form.consent = false
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form class="lead-form" @submit.prevent="submit">
    <fieldset class="lead-form__intent">
      <legend>Что вас интересует?</legend>
      <label>
        <input v-model="form.intent" type="radio" value="ceiling-measure" />
        <span>Натяжной потолок</span>
      </label>
      <label>
        <input v-model="form.intent" type="radio" value="tinting-consultation" />
        <span>Тонировка окон</span>
      </label>
    </fieldset>

    <div class="lead-form__fields">
      <label>
        <span>Ваше имя</span>
        <input v-model.trim="form.name" name="name" autocomplete="name" required />
      </label>
      <label>
        <span>Телефон</span>
        <input
          v-model.trim="form.phone"
          name="phone"
          type="tel"
          autocomplete="tel"
          inputmode="tel"
          placeholder="+7 (___) ___-__-__"
          required
        />
      </label>
      <label class="lead-form__comment">
        <span>Комментарий <small>необязательно</small></span>
        <textarea
          v-model.trim="form.comment"
          name="comment"
          rows="3"
          placeholder="Коротко опишите задачу"
        ></textarea>
      </label>
    </div>

    <label class="lead-form__consent">
      <input v-model="form.consent" type="checkbox" required />
      <span>Согласен на обработку персональных данных для ответа на заявку</span>
    </label>

    <button class="button" type="submit" :disabled="status === 'submitting'">
      {{ status === 'submitting' ? 'Отправляем…' : selectedIntent.label }}
    </button>

    <p v-if="status === 'success'" class="form-status form-status--success" role="status">
      Заявка отправлена. Мы свяжемся с вами.
    </p>
    <p v-else-if="status === 'error'" class="form-status form-status--error" role="alert">
      Пока не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.
    </p>
  </form>
</template>
