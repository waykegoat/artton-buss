export type LeadIntent = 'ceiling-measure' | 'tinting-consultation'

export interface LeadPayload {
  intent?: unknown
  name?: unknown
  phone?: unknown
  comment?: unknown
  consent?: unknown
  company?: unknown
}

export interface ValidLead {
  intent: LeadIntent
  name: string
  phone: string
  comment: string
}

const allowedLeadIntents = new Set<LeadIntent>(['ceiling-measure', 'tinting-consultation'])

export function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function hasHoneypotValue(payload: LeadPayload): boolean {
  return cleanText(payload.company, 100).length > 0
}

export function validateLead(payload: LeadPayload): ValidLead | null {
  const intent = cleanText(payload.intent, 40) as LeadIntent
  const name = cleanText(payload.name, 80)
  const phone = cleanText(payload.phone, 32)
  const comment = cleanText(payload.comment, 1_000)
  const phoneDigits = phone.replaceAll(/\D/g, '')

  if (
    !allowedLeadIntents.has(intent) ||
    name.length < 2 ||
    phoneDigits.length < 10 ||
    phoneDigits.length > 15 ||
    payload.consent !== true
  ) {
    return null
  }

  return { intent, name, phone, comment }
}
