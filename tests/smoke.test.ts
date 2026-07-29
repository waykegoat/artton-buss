import { describe, expect, it } from 'vitest'

import { routes } from '@/router/routes'

describe('public routes', () => {
  it('contains all required public pages', () => {
    expect(routes.map((route) => route.path)).toEqual(
      expect.arrayContaining(['/', '/services', '/portfolio', '/contacts']),
    )
  })
})
