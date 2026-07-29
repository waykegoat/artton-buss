import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/pages/ServicesPage.vue'),
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('@/pages/PortfolioPage.vue'),
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: () => import('@/pages/ContactsPage.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/admin/AdminPage.vue'),
    meta: { noIndex: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { noIndex: true },
  },
]
