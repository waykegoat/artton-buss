import type { Env, LeadIntent } from '../types'

interface LeadNotification {
  id: string
  intent: LeadIntent
  name: string
  phone: string
  comment: string
}

export async function notifyTelegram(env: Env, lead: LeadNotification): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return

  const intent =
    lead.intent === 'ceiling-measure' ? 'Замер натяжного потолка' : 'Консультация по тонировке'
  const text = [
    'Новая заявка с сайта Art Ton',
    '',
    `Тип: ${intent}`,
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.comment ? `Комментарий: ${lead.comment}` : null,
    `ID: ${lead.id}`,
  ]
    .filter(Boolean)
    .join('\n')

  const response = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text,
        disable_web_page_preview: true,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Telegram notification failed: ${String(response.status)}`)
  }
}
