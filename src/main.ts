import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'

import App from '@/App.vue'
import { i18n } from '@/plugins/i18n'
import { routes } from '@/router/routes'
import '@/styles/main.css'

export const createApp = ViteSSG(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Vue SFC typing is supplied by vue-tsc.
  App,
  {
    routes,
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, behavior: 'smooth' }
      if (to.path !== from.path) return { top: 0 }
      return false
    },
  },
  ({ app }) => {
    app.use(createPinia())
    app.use(i18n)
  },
)
