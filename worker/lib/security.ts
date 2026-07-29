import type { Env, SessionPayload } from '../types'

const sessionCookieName = 'artton_session'
const encoder = new TextEncoder()

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function decodeBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const padded = value
    .replaceAll('-', '+')
    .replaceAll('_', '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false

  let difference = 0
  for (let index = 0; index < left.length; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }
  return difference === 0
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

export async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [, algorithm, iterationsText, saltText, expectedText] = encodedHash.split('$')
  if (algorithm !== 'pbkdf2-sha256' || !iterationsText || !saltText || !expectedText) return false

  const iterations = Number(iterationsText)
  if (!Number.isSafeInteger(iterations) || iterations < 100_000 || iterations > 1_000_000) {
    return false
  }

  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const derived = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: decodeBase64Url(saltText),
      iterations,
    },
    passwordKey,
    256,
  )

  return constantTimeEqual(new Uint8Array(derived), decodeBase64Url(expectedText))
}

export async function createSession(username: string, secret: string): Promise<string> {
  const payload: SessionPayload = {
    sub: username,
    exp: Date.now() + 12 * 60 * 60 * 1000,
    nonce: crypto.randomUUID(),
  }
  const payloadText = encodeBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = await crypto.subtle.sign(
    'HMAC',
    await importHmacKey(secret),
    encoder.encode(payloadText),
  )
  return `${payloadText}.${encodeBase64Url(new Uint8Array(signature))}`
}

export async function verifySession(token: string, secret: string): Promise<SessionPayload | null> {
  const [payloadText, signatureText] = token.split('.')
  if (!payloadText || !signatureText) return null

  const valid = await crypto.subtle.verify(
    'HMAC',
    await importHmacKey(secret),
    decodeBase64Url(signatureText),
    encoder.encode(payloadText),
  )
  if (!valid) return null

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(payloadText)),
    ) as SessionPayload
    if (!payload.sub || !payload.nonce || payload.exp <= Date.now()) return null
    return payload
  } catch {
    return null
  }
}

export function getSessionToken(request: Request): string | null {
  const cookie = request.headers.get('cookie')
  if (!cookie) return null

  for (const item of cookie.split(';')) {
    const [name, ...valueParts] = item.trim().split('=')
    if (name === sessionCookieName) return valueParts.join('=')
  }
  return null
}

export function sessionCookie(request: Request, token: string): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${sessionCookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=43200${secure}`
}

export function clearSessionCookie(request: Request): string {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : ''
  return `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`
}

export async function requireAdmin(request: Request, env: Env): Promise<SessionPayload | null> {
  if (!env.SESSION_SECRET) return null
  const token = getSessionToken(request)
  if (!token) return null
  return verifySession(token, env.SESSION_SECRET)
}

export async function fingerprint(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return encodeBase64Url(new Uint8Array(digest))
}
