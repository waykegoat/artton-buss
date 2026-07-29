import { normalizePublicContent } from '../shared/content'
import { getPublicContent, savePublicContent } from './lib/content'
import { json, methodNotAllowed, noContent, readJson, requireSameOrigin } from './lib/http'
import {
  clearLoginAttempts,
  consumeLeadLimit,
  getLoginAttempt,
  recordLoginFailure,
} from './lib/rate-limit'
import {
  clearSessionCookie,
  createSession,
  fingerprint,
  requireAdmin,
  sessionCookie,
  verifyPassword,
} from './lib/security'
import { notifyTelegram } from './lib/telegram'
import type { Env, LeadIntent, LeadStatus } from './types'

const allowedLeadIntents = new Set<LeadIntent>(['ceiling-measure', 'tinting-consultation'])
const allowedLeadStatuses = new Set<LeadStatus>(['new', 'contacted', 'completed', 'spam'])

interface LoginBody {
  username?: unknown
  password?: unknown
}

interface LeadBody {
  intent?: unknown
  name?: unknown
  phone?: unknown
  comment?: unknown
  consent?: unknown
  company?: unknown
}

function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') ?? 'local'
}

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

async function audit(
  env: Env,
  actor: string,
  action: string,
  entityType: string,
  entityId: string,
  details: unknown = {},
): Promise<void> {
  await env.DB.prepare(
    `INSERT INTO audit_log
     (id, actor, action, entity_type, entity_id, details_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      crypto.randomUUID(),
      actor,
      action,
      entityType,
      entityId,
      JSON.stringify(details),
      Date.now(),
    )
    .run()
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed()
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403)
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD_HASH || !env.SESSION_SECRET) {
    return json({ error: 'Admin access is not configured' }, 503)
  }

  let body: LoginBody
  try {
    body = await readJson<LoginBody>(request, 2_048)
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  const username = cleanText(body.username, 120)
  const password = typeof body.password === 'string' ? body.password : ''
  const attemptKey = await fingerprint(`${clientIp(request)}|${username.toLowerCase()}`)
  const attempt = await getLoginAttempt(env, attemptKey)

  if (attempt && attempt.blockedUntil > Date.now()) {
    return json({ error: 'Too many attempts. Try again later.' }, 429)
  }

  const passwordMatches = await verifyPassword(password, env.ADMIN_PASSWORD_HASH)
  const usernameMatches = username === env.ADMIN_USERNAME
  if (!passwordMatches || !usernameMatches) {
    await recordLoginFailure(env, attemptKey)
    return json({ error: 'Invalid credentials' }, 401)
  }

  await clearLoginAttempts(env, attemptKey)
  const token = await createSession(username, env.SESSION_SECRET)
  await audit(env, username, 'login', 'session', 'current')

  return json({ user: { username } }, 200, {
    'set-cookie': sessionCookie(request, token),
  })
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed()
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403)

  const session = await requireAdmin(request, env)
  if (session) await audit(env, session.sub, 'logout', 'session', 'current')

  return noContent({ 'set-cookie': clearSessionCookie(request) })
}

async function handleSession(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed()
  const session = await requireAdmin(request, env)
  if (!session) return json({ authenticated: false }, 401)
  return json({ authenticated: true, user: { username: session.sub } })
}

async function handlePublicContent(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return methodNotAllowed()
  return json(await getPublicContent(env), 200, { 'cache-control': 'public, max-age=60' })
}

async function handleAdminContent(request: Request, env: Env): Promise<Response> {
  const session = await requireAdmin(request, env)
  if (!session) return json({ error: 'Unauthorized' }, 401)

  if (request.method === 'GET') return json(await getPublicContent(env))
  if (request.method !== 'PUT') return methodNotAllowed()
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403)

  let value: unknown
  try {
    value = await readJson<unknown>(request)
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  const content = normalizePublicContent(value)
  if (!content) return json({ error: 'Invalid content' }, 422)

  await savePublicContent(env, content)
  await audit(env, session.sub, 'update', 'site_settings', 'public_content')
  return json(content)
}

async function handleCreateLead(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return methodNotAllowed()
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403)

  let body: LeadBody
  try {
    body = await readJson<LeadBody>(request)
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  if (cleanText(body.company, 100)) return json({ accepted: true }, 201)

  const intent = cleanText(body.intent, 40) as LeadIntent
  const name = cleanText(body.name, 80)
  const phone = cleanText(body.phone, 32)
  const comment = cleanText(body.comment, 1_000)
  const phoneDigits = phone.replaceAll(/\D/g, '')

  if (
    !allowedLeadIntents.has(intent) ||
    name.length < 2 ||
    phoneDigits.length < 10 ||
    phoneDigits.length > 15 ||
    body.consent !== true
  ) {
    return json({ error: 'Please check the form fields' }, 422)
  }

  const limitKey = await fingerprint(`lead|${clientIp(request)}`)
  if (!(await consumeLeadLimit(env, limitKey))) {
    return json({ error: 'Too many requests. Try again later.' }, 429)
  }

  const id = crypto.randomUUID()
  const now = Date.now()
  await env.DB.prepare(
    `INSERT INTO leads
     (id, intent, name, phone, comment, status, source, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'new', 'website', ?, ?)`,
  )
    .bind(id, intent, name, phone, comment, now, now)
    .run()

  try {
    await notifyTelegram(env, { id, intent, name, phone, comment })
  } catch (error) {
    console.error(error)
  }

  return json({ accepted: true, id }, 201)
}

async function handleLeads(request: Request, env: Env): Promise<Response> {
  const session = await requireAdmin(request, env)
  if (!session) return json({ error: 'Unauthorized' }, 401)
  if (request.method !== 'GET') return methodNotAllowed()

  const result = await env.DB.prepare(
    `SELECT id, intent, name, phone, comment, status, source,
            created_at AS createdAt, updated_at AS updatedAt
     FROM leads
     ORDER BY created_at DESC
     LIMIT 200`,
  ).all()

  return json({ leads: result.results })
}

async function handleLeadStatus(request: Request, env: Env, leadId: string): Promise<Response> {
  const session = await requireAdmin(request, env)
  if (!session) return json({ error: 'Unauthorized' }, 401)
  if (request.method !== 'PATCH') return methodNotAllowed()
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403)

  let body: { status?: unknown }
  try {
    body = await readJson<{ status?: unknown }>(request, 1_024)
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  const status = cleanText(body.status, 32) as LeadStatus
  if (!allowedLeadStatuses.has(status)) return json({ error: 'Invalid status' }, 422)

  const result = await env.DB.prepare('UPDATE leads SET status = ?, updated_at = ? WHERE id = ?')
    .bind(status, Date.now(), leadId)
    .run()

  if (!result.meta.changes) return json({ error: 'Lead not found' }, 404)

  await audit(env, session.sub, 'status_change', 'lead', leadId, { status })
  return json({ id: leadId, status })
}

async function handleMediaUpload(request: Request, env: Env): Promise<Response> {
  const session = await requireAdmin(request, env)
  if (!session) return json({ error: 'Unauthorized' }, 401)
  if (request.method !== 'POST') return methodNotAllowed()
  if (!requireSameOrigin(request)) return json({ error: 'Invalid origin' }, 403)

  const contentType = request.headers.get('content-type')?.split(';')[0] ?? ''
  const extensions: Record<string, string> = {
    'image/avif': 'avif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
  }
  const extension = extensions[contentType]
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (!extension || !request.body || contentLength <= 0 || contentLength > 8 * 1024 * 1024) {
    return json({ error: 'Unsupported image or file is too large' }, 422)
  }

  const key = `portfolio/${crypto.randomUUID()}.${extension}`
  const originalName = cleanText(request.headers.get('x-file-name'), 180)
  await env.MEDIA.put(key, request.body, {
    httpMetadata: {
      contentType,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: { originalName },
  })
  await audit(env, session.sub, 'upload', 'media', key, { contentType, originalName })

  return json({ key, url: `/media/${key}` }, 201)
}

async function handleMedia(request: Request, env: Env, key: string): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return methodNotAllowed()
  if (!key.startsWith('portfolio/') || key.includes('..')) return json({ error: 'Not found' }, 404)

  const object = await env.MEDIA.get(key)
  if (!object) return json({ error: 'Not found' }, 404)

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('x-content-type-options', 'nosniff')

  return new Response(request.method === 'HEAD' ? null : object.body, { headers })
}

function xmlEscape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function handleSitemap(request: Request): Response {
  const origin = new URL(request.url).origin
  const pages = ['/', '/services', '/portfolio', '/contacts']
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((path) => `  <url><loc>${xmlEscape(`${origin}${path}`)}</loc></url>`).join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'application/xml; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  })
}

function handleRobots(request: Request): Response {
  const origin = new URL(request.url).origin
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${origin}/sitemap.xml
`
  return new Response(body, {
    headers: {
      'cache-control': 'public, max-age=3600',
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  })
}

async function sha256Base64(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  const bytes = new Uint8Array(digest)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/api/auth/login') return handleLogin(request, env)
  if (path === '/api/auth/logout') return handleLogout(request, env)
  if (path === '/api/auth/session') return handleSession(request, env)
  if (path === '/api/content') return handlePublicContent(request, env)
  if (path === '/api/leads') return handleCreateLead(request, env)
  if (path === '/api/admin/content') return handleAdminContent(request, env)
  if (path === '/api/admin/leads') return handleLeads(request, env)
  if (path === '/api/admin/media') return handleMediaUpload(request, env)
  if (path.startsWith('/api/admin/leads/')) {
    return handleLeadStatus(request, env, path.slice('/api/admin/leads/'.length))
  }

  return json({ error: 'Not found' }, 404)
}

async function handleAssets(request: Request, env: Env): Promise<Response> {
  const response = await env.ASSETS.fetch(request)
  const headers = new Headers(response.headers)
  headers.set('referrer-policy', 'strict-origin-when-cross-origin')
  headers.set('x-content-type-options', 'nosniff')
  headers.set('x-frame-options', 'DENY')
  headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()')
  const contentType = headers.get('content-type') ?? ''

  if (response.ok && contentType.includes('text/html')) {
    const url = new URL(request.url)
    const canonicalUrl = `${url.origin}${url.pathname}`
    const structuredData = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: 'Art Ton',
      url: url.origin,
      telephone: '+79875051859',
      sameAs: ['https://vk.ru/art_ton_58'],
      areaServed: ['Заречный', 'Пенза', 'Пензенская область'],
      openingHours: 'Mo-Sa 09:00-20:00',
      serviceType: ['Натяжные потолки', 'Тонировка окон'],
    }).replaceAll('<', '\\u003c')
    const structuredDataHash = await sha256Base64(structuredData)
    const headMarkup = [
      `<link rel="canonical" href="${canonicalUrl}">`,
      `<meta property="og:url" content="${canonicalUrl}">`,
      `<meta property="og:type" content="website">`,
      `<meta property="og:locale" content="ru_RU">`,
      `<meta property="og:site_name" content="Art Ton">`,
      `<meta property="og:image" content="${url.origin}/og.png">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${url.origin}/og.png">`,
      `<script type="application/ld+json">${structuredData}</script>`,
    ].join('')
    const html = (await response.text()).replace('</head>', `${headMarkup}</head>`)

    headers.set(
      'content-security-policy',
      `default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' 'sha256-${structuredDataHash}'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
    )
    return new Response(html, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }

  headers.set(
    'content-security-policy',
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  )
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const path = new URL(request.url).pathname
      if (path.startsWith('/api/')) return await handleApi(request, env)
      if (path === '/sitemap.xml') return handleSitemap(request)
      if (path === '/robots.txt') return handleRobots(request)
      if (path.startsWith('/media/')) {
        return await handleMedia(request, env, decodeURIComponent(path.slice('/media/'.length)))
      }
      return await handleAssets(request, env)
    } catch (error) {
      console.error(error)
      return json({ error: 'Internal server error' }, 500)
    }
  },
} satisfies ExportedHandler<Env>
