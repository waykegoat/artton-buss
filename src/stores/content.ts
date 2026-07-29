import { defineStore } from 'pinia'
import { ref } from 'vue'

import { defaultPublicContent, type PublicContent } from '../../shared/content'

export const useContentStore = defineStore('content', () => {
  const content = ref<PublicContent>(structuredClone(defaultPublicContent))
  const isLoaded = ref(false)

  async function load(): Promise<void> {
    try {
      const response = await globalThis.fetch('/api/content', {
        headers: { accept: 'application/json' },
      })
      if (!response.ok) return
      content.value = (await response.json()) as PublicContent
      isLoaded.value = true
    } catch {
      // SSG defaults remain available when the API is offline during local design work.
    }
  }

  return { content, isLoaded, load }
})
