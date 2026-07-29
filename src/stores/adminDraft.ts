import { defineStore } from 'pinia'
import { reactive, ref, watch } from 'vue'

import {
  defaultPublicContent,
  normalizePublicContent,
  type PublicContent,
} from '../../shared/content'

const storageKey = 'artton.admin.content-draft'

export const useAdminDraftStore = defineStore('admin-draft', () => {
  const content = reactive<PublicContent>(globalThis.structuredClone(defaultPublicContent))
  const hasDraft = ref(false)
  const persistenceStarted = ref(false)

  function replace(value: PublicContent): void {
    Object.assign(content.facts, value.facts)
    for (const [key, price] of Object.entries(value.prices)) {
      if (content.prices[key]) Object.assign(content.prices[key], price)
    }
  }

  function hydrate(): boolean {
    if (typeof globalThis.localStorage === 'undefined') return false
    const raw = globalThis.localStorage.getItem(storageKey)
    if (!raw) return false

    try {
      const parsed = normalizePublicContent(JSON.parse(raw))
      if (!parsed) return false
      replace(parsed)
      hasDraft.value = true
      return true
    } catch {
      globalThis.localStorage.removeItem(storageKey)
      return false
    }
  }

  function startPersistence(): void {
    if (persistenceStarted.value || typeof globalThis.localStorage === 'undefined') return
    persistenceStarted.value = true
    watch(
      content,
      (value) => {
        globalThis.localStorage.setItem(storageKey, JSON.stringify(value))
        hasDraft.value = true
      },
      { deep: true, flush: 'sync' },
    )
  }

  function clear(): void {
    if (typeof globalThis.localStorage !== 'undefined') {
      globalThis.localStorage.removeItem(storageKey)
    }
    hasDraft.value = false
  }

  return { content, hasDraft, replace, hydrate, startPersistence, clear }
})
