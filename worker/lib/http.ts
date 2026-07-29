const securityHeaders = {
  'cache-control': 'no-store',
  'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
} as const

function createHeaders(initial: HeadersInit): Headers {
  const headers = new Headers(initial)
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value)
  }
  return headers
}

export function json(data: unknown, status = 200, headers: HeadersInit = {}): Response {
  return Response.json(data, {
    status,
    headers: createHeaders(headers),
  })
}

export function noContent(headers: HeadersInit = {}): Response {
  return new Response(null, {
    status: 204,
    headers: createHeaders(headers),
  })
}

export function methodNotAllowed(): Response {
  return json({ error: 'Method not allowed' }, 405, { allow: 'GET, POST, PUT, PATCH, DELETE' })
}

export async function readJson<T>(request: Request, maxBytes = 16_384): Promise<T> {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > maxBytes) throw new Error('PAYLOAD_TOO_LARGE')

  const text = await request.text()
  if (text.length > maxBytes) throw new Error('PAYLOAD_TOO_LARGE')

  return JSON.parse(text) as T
}

export function requireSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  return origin === new URL(request.url).origin
}
