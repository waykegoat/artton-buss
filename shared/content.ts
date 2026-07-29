export interface PriceSetting {
  value: number | null
  unit: string
  visible: boolean
}

export interface PublicContent {
  facts: {
    experienceYears: number
    warrantyYears: number
    hours: string
    serviceRegion: string
  }
  prices: Record<string, PriceSetting>
}

export const defaultPublicContent: PublicContent = {
  facts: {
    experienceYears: 16,
    warrantyYears: 20,
    hours: 'Пн–Сб 9:00–20:00',
    serviceRegion: 'Заречный, Пенза и Пензенская область',
  },
  prices: {
    classic: { value: null, unit: '₽/м²', visible: false },
    'track-light': { value: null, unit: '₽', visible: false },
    'two-level': { value: null, unit: '₽/м²', visible: false },
    'photo-print': { value: null, unit: '₽/м²', visible: false },
    'window-tinting': { value: null, unit: '₽/м²', visible: false },
  },
}

const priceKeys = Object.keys(defaultPublicContent.prices)

function isPriceSetting(value: unknown): value is PriceSetting {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<PriceSetting>
  return (
    (candidate.value === null ||
      (typeof candidate.value === 'number' &&
        Number.isFinite(candidate.value) &&
        candidate.value >= 0 &&
        candidate.value <= 10_000_000)) &&
    typeof candidate.unit === 'string' &&
    candidate.unit.length <= 20 &&
    typeof candidate.visible === 'boolean'
  )
}

export function normalizePublicContent(value: unknown): PublicContent | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<PublicContent>
  const facts = candidate.facts

  if (
    !facts ||
    !Number.isInteger(facts.experienceYears) ||
    facts.experienceYears < 0 ||
    facts.experienceYears > 100 ||
    !Number.isInteger(facts.warrantyYears) ||
    facts.warrantyYears < 0 ||
    facts.warrantyYears > 100 ||
    typeof facts.hours !== 'string' ||
    facts.hours.length > 80 ||
    typeof facts.serviceRegion !== 'string' ||
    facts.serviceRegion.length > 160
  ) {
    return null
  }

  const prices: Record<string, PriceSetting> = {}
  for (const key of priceKeys) {
    const price = candidate.prices?.[key]
    if (!isPriceSetting(price)) return null
    prices[key] = price
  }

  return {
    facts: {
      experienceYears: facts.experienceYears,
      warrantyYears: facts.warrantyYears,
      hours: facts.hours.trim(),
      serviceRegion: facts.serviceRegion.trim(),
    },
    prices,
  }
}
