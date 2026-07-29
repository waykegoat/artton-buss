import { describe, expect, it } from 'vitest'

import { defaultPublicContent, normalizePublicContent } from '../shared/content'

describe('public content validation', () => {
  it('accepts the default public content', () => {
    expect(normalizePublicContent(defaultPublicContent)).toEqual(defaultPublicContent)
  })

  it('rejects a visible price outside the supported range', () => {
    const content = globalThis.structuredClone(defaultPublicContent)
    const classicPrice = content.prices.classic
    if (!classicPrice) throw new Error('Missing classic price fixture')

    classicPrice.value = 100_000_000
    classicPrice.visible = true

    expect(normalizePublicContent(content)).toBeNull()
  })

  it('rejects unreasonably long service regions', () => {
    const content = globalThis.structuredClone(defaultPublicContent)
    content.facts.serviceRegion = 'x'.repeat(161)

    expect(normalizePublicContent(content)).toBeNull()
  })
})
