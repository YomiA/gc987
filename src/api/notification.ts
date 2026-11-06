/**
 * /notification (Perfil -> Suporte, "Centro de Mensagens").
 *
 * The first tab's rows come from POST /customerCares. The other two tabs stay
 * the empty "Sem Registros" block. `inviteCode` is a request header only when
 * the registration link carried one.
 */

import { request } from './http'
import { assetUrl } from '../utils/assetUrl'
import { readInviteCode } from '../utils/inviteCode'

export interface NotificationTab {
  key: string
  label: string
}

export interface SupportChannel {
  key: string
  nickname: string
  account: string
  logo: string
  url: string
}

export interface CustomerCare {
  customer_care_name?: string
  icon?: string
  route_path?: string
  desc?: string
}

const IMAGES = '/images/notification'

export const notificationTabs: NotificationTab[] = [
  { key: 'suporte', label: 'Suporte' },
  { key: 'notificacao', label: 'Notificação' },
  { key: 'anuncio', label: 'Anúncio' },
]

export const supportCopy = {
  title: 'Apoio online 24/7',
  hint: 'Serviço ao cliente disponível para ajudar a solucionar problemas e responder a dúvidas apresentadas.',
  contact: 'Contato',
  avatar: `${IMAGES}/customer-service.png`,
}

export function getNotificationTabs(): Promise<NotificationTab[]> {
  return Promise.resolve(notificationTabs)
}

function externalUrl(value: string) {
  const raw = value.trim()
  if (!raw) return ''
  if (/^(https?:|mailto:|tel:)/i.test(raw)) return raw
  if (raw.startsWith('/')) return raw
  return `https://${raw}`
}

/** Support rows for the first tab. No invite code means the header is absent. */
export async function getSupportChannels(): Promise<SupportChannel[]> {
  const inviteCode = readInviteCode()
  const resp = await request<{ code?: number; data?: CustomerCare[] }>('/customerCares', {
    method: 'POST',
    body: {},
    ...(inviteCode ? { headers: { inviteCode } } : {}),
  })
  const list = Array.isArray(resp.data) ? resp.data : []
  return list.map((item, index) => ({
    key: `${index}-${item.customer_care_name || 'care'}`,
    nickname: item.customer_care_name || '',
    account: item.desc || '',
    logo: assetUrl(item.icon),
    url: externalUrl(item.route_path || ''),
  }))
}
