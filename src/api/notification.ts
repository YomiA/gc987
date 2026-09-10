/**
 * Mock data for /notification (Perfil -> Suporte, "Centro de Mensagens").
 *
 * Copy and channel rows are the values on https://gc987.com/notification at
 * 390x844x3. The Telegram / WhatsApp destinations are the public official
 * channels the live tenant config already exposes; nothing that identifies a
 * signed-in account is stored here. Online chat is off for this tenant
 * (`onlineServices: []`), so the first card has no Contato.
 */

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

export const supportChannels: SupportChannel[] = [
  {
    key: 'telegram-support',
    nickname: 'Atendimento ao cliente Telegram 24 horas da',
    account: 'Serviço Telegram',
    logo: `${IMAGES}/telegram-support.png`,
    url: 'https://t.me/Gc98_Suporte',
  },
  {
    key: 'telegram-channel',
    nickname: 'GC987.COM | Canal Oficial ®',
    account: 'GC987.COM | Canal Oficial ®',
    logo: `${IMAGES}/telegram-channel.png`,
    url: 'https://t.me/Gc987Slots',
  },
  {
    key: 'whatsapp-channel',
    nickname: 'GC987.COM | Canal Oficial ®',
    account: 'GC987.COM | Canal Oficial ®',
    logo: `${IMAGES}/whatsapp-channel.png`,
    url: 'https://whatsapp.com/channel/0029Vb6R6J1C6ZvdXVCo8k3a',
  },
]

export function getNotificationTabs(): Promise<NotificationTab[]> {
  return Promise.resolve(notificationTabs)
}

export function getSupportChannels(): Promise<SupportChannel[]> {
  return Promise.resolve(supportChannels)
}
