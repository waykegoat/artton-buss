import type { Env } from '../types'

interface LoginAttempt {
  attempts: number
  blockedUntil: number
}

export async function getLoginAttempt(env: Env, key: string): Promise<LoginAttempt | null> {
  return env.DB.prepare(
    'SELECT attempts, blocked_until AS blockedUntil FROM login_attempts WHERE fingerprint = ? LIMIT 1',
  )
    .bind(key)
    .first<LoginAttempt>()
}

export async function recordLoginFailure(env: Env, key: string): Promise<void> {
  const now = Date.now()
  const blockedUntil = now + 15 * 60 * 1000
  await env.DB.prepare(
    `INSERT INTO login_attempts (fingerprint, attempts, blocked_until, updated_at)
     VALUES (?, 1, 0, ?)
     ON CONFLICT(fingerprint) DO UPDATE SET
       attempts = login_attempts.attempts + 1,
       blocked_until = CASE
         WHEN login_attempts.attempts + 1 >= 5 THEN ?
         ELSE login_attempts.blocked_until
       END,
       updated_at = excluded.updated_at`,
  )
    .bind(key, now, blockedUntil)
    .run()
}

export async function clearLoginAttempts(env: Env, key: string): Promise<void> {
  await env.DB.prepare('DELETE FROM login_attempts WHERE fingerprint = ?').bind(key).run()
}

export async function consumeLeadLimit(env: Env, key: string): Promise<boolean> {
  const now = Date.now()
  const windowLength = 10 * 60 * 1000
  const row = await env.DB.prepare(
    `SELECT count, window_started_at AS windowStartedAt
     FROM request_limits WHERE fingerprint = ? LIMIT 1`,
  )
    .bind(key)
    .first<{ count: number; windowStartedAt: number }>()

  if (!row || now - row.windowStartedAt >= windowLength) {
    await env.DB.prepare(
      `INSERT INTO request_limits (fingerprint, count, window_started_at, updated_at)
       VALUES (?, 1, ?, ?)
       ON CONFLICT(fingerprint) DO UPDATE SET
         count = 1,
         window_started_at = excluded.window_started_at,
         updated_at = excluded.updated_at`,
    )
      .bind(key, now, now)
      .run()
    return true
  }

  if (row.count >= 5) return false

  await env.DB.prepare(
    'UPDATE request_limits SET count = count + 1, updated_at = ? WHERE fingerprint = ?',
  )
    .bind(now, key)
    .run()
  return true
}
