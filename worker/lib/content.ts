import {
  defaultPublicContent,
  normalizePublicContent,
  type PublicContent,
} from '../../shared/content'
import type { Env } from '../types'

export async function getPublicContent(env: Env): Promise<PublicContent> {
  const row = await env.DB.prepare(
    'SELECT value_json AS valueJson FROM site_settings WHERE key = ? LIMIT 1',
  )
    .bind('public_content')
    .first<{ valueJson: string }>()

  if (!row) return structuredClone(defaultPublicContent)

  try {
    return (
      normalizePublicContent(JSON.parse(row.valueJson)) ?? structuredClone(defaultPublicContent)
    )
  } catch {
    return structuredClone(defaultPublicContent)
  }
}

export async function savePublicContent(env: Env, content: PublicContent): Promise<void> {
  const now = Date.now()
  await env.DB.prepare(
    `INSERT INTO site_settings (key, value_json, updated_at)
     VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at`,
  )
    .bind('public_content', JSON.stringify(content), now)
    .run()
}
