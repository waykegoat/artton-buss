export interface Env {
  DB: D1Database
  ASSETS: Fetcher
  ADMIN_USERNAME?: string
  ADMIN_PASSWORD_HASH?: string
  SESSION_SECRET?: string
  TELEGRAM_BOT_TOKEN?: string
  TELEGRAM_CHAT_ID?: string
}

export interface SessionPayload {
  sub: string
  exp: number
  nonce: string
}

export type { LeadIntent } from '../shared/lead'
export type LeadStatus = 'new' | 'contacted' | 'completed' | 'spam'
