import { describe, expect, it } from 'vitest'

import { hasHoneypotValue, validateLead } from '../shared/lead'

describe('lead validation', () => {
  it('normalizes a valid ceiling measurement request', () => {
    expect(
      validateLead({
        intent: 'ceiling-measure',
        name: '  Анна  ',
        phone: '+7 (987) 505-18-59',
        comment: '  Две комнаты  ',
        consent: true,
      }),
    ).toEqual({
      intent: 'ceiling-measure',
      name: 'Анна',
      phone: '+7 (987) 505-18-59',
      comment: 'Две комнаты',
    })
  })

  it.each([
    ['an unsupported intent', { intent: 'callback' }],
    ['a short name', { name: 'Я' }],
    ['a short phone', { phone: '123' }],
    ['missing consent', { consent: false }],
  ])('rejects %s', (_, override) => {
    expect(
      validateLead({
        intent: 'tinting-consultation',
        name: 'Иван',
        phone: '+7 987 505-18-59',
        consent: true,
        ...override,
      }),
    ).toBeNull()
  })

  it('detects the anti-spam honeypot without exposing its value', () => {
    expect(hasHoneypotValue({ company: 'Spam LLC' })).toBe(true)
    expect(hasHoneypotValue({ company: '   ' })).toBe(false)
  })
})
