export const business = {
  name: 'Art Ton',
  phone: {
    display: '+7 (987) 505-18-59',
    href: 'tel:+79875051859',
  },
  serviceAreas: ['Заречный', 'Пенза', 'Пензенская область'],
  coverageLabel: 'Заречный, Пенза и Пензенская область',
} as const

export type LeadIntent = 'ceiling-measure' | 'tinting-consultation'

export const leadIntents = {
  'ceiling-measure': {
    label: 'Записаться на бесплатный замер',
    shortLabel: 'Запись на замер',
  },
  'tinting-consultation': {
    label: 'Получить консультацию по тонировке',
    shortLabel: 'Консультация',
  },
} satisfies Record<LeadIntent, { label: string; shortLabel: string }>
