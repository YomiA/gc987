/**
 * Fake backend for Eventos detail (`/activity/:type/:id`) and rebate
 * history (`/activity/rebate/record`). Nothing leaves the app.
 *
 * The first Eventos card on https://gc987.com/main/promo opens
 * `/activity/Assistance/3734@style_0`. Geometry and copy below were read
 * off that Assistance page at 390x844x3. Other event types reuse this
 * chrome until their own layouts are cloned.
 */

export interface PromoEventMeta {
  type: string
  /** Live path id, including optional `@style_N`. */
  routeId: string
  title: string
}

export interface RescueTier {
  loss: string
  rate: string
}

export interface ActivityDetail {
  type: string
  routeId: string
  title: string
  banner: string
  /** Caption after the banner clock. */
  countdownCaption: string
  rescueTitle: string
  lossCol: string
  claimCol: string
  tiers: RescueTier[]
  weekTitle: string
  myLossLabel: string
  claimableLabel: string
  myLossCents: number
  claimableCents: number
  rulesTitle: string
  rules: string[]
  receive: string
}

export const activityEventMeta: PromoEventMeta[] = [
  { type: 'Assistance', routeId: '3734@style_0', title: 'Fundo de Resgate de Perdas Semanais' },
  { type: 'Assistance', routeId: '2', title: 'Reembolso de Perdas' },
  { type: 'invite', routeId: '3', title: 'Convide Amigos' },
  { type: 'VIP', routeId: 'vip', title: 'VIP' },
  { type: 'SignIn', routeId: '5', title: 'Check-in Diário' },
  { type: 'member', routeId: '6', title: 'Dia do Membro' },
  { type: 'Assistance', routeId: '7', title: 'Ajuda de Amigos' },
  { type: 'RechargeReward', routeId: '8', title: 'Recarga de Terça' },
  { type: 'luckyBet', routeId: '9', title: 'Teste da Sorte' },
  { type: 'mysteryReward', routeId: '10', title: 'Bônus Aleatório' },
  { type: 'ValidBet', routeId: '11', title: 'Cashback de Apostas' },
  { type: 'custom', routeId: '12', title: 'Canal WhatsApp' },
  { type: 'mysteryReward', routeId: '13', title: 'Bônus Misterioso' },
  { type: 'custom', routeId: '14', title: 'Canal Telegram' },
]

const rescueTiers: RescueTier[] = [
  { loss: '100,00', rate: '1,00%' },
  { loss: '1.000,00', rate: '2,00%' },
  { loss: '5.000,00', rate: '3,00%' },
  { loss: '10.000,00', rate: '4,00%' },
  { loss: '50.000,00', rate: '8,00%' },
  { loss: '100.000,00', rate: '15,00%' },
  { loss: '5.000.000,00', rate: '30,00%' },
  { loss: '10.000.000,00', rate: '50,00%' },
]

const assistanceRules = [
  '1. Este evento é um evento de fundo de alívio semanal. Os membros que perderam dinheiro na semana passada podem obter fundos de alívio;',
  '2. O bônus deve ser coletado manualmente e será cancelado após o vencimento;',
  '3. O bônus (excluindo valor principal) requer 1 vezes de apostas válidas para sacar;',
  '4. Somente o proprietário da conta pode realizar operações manuais normais, caso contrário, o bônus será cancelado ou deduzido, congelado ou até mesmo colocado na lista negra;',
  '5. Para evitar diferenças na compreensão do texto, a plataforma se reserva o direito final de interpretação desta atividade.',
]

const assistanceDetail: Omit<ActivityDetail, 'type' | 'routeId' | 'title'> = {
  banner: '/images/activity/rescue_weekly_banner.png',
  countdownCaption: 'Evento de Contagem Regressiva: permanente',
  rescueTitle: 'Valor de resgate',
  lossCol: 'Valor da perda',
  claimCol: 'Coletável',
  tiers: rescueTiers,
  weekTitle: 'Lucro e perda da semana',
  myLossLabel: 'Minhas perdas',
  claimableLabel: 'Coletável',
  myLossCents: 0,
  claimableCents: 0,
  rulesTitle: 'Regras do evento',
  rules: assistanceRules,
  receive: 'Receber',
}

/** Session-local clock so the banner digits tick like the live page. */
export const activityCountdownEnd = Date.now() + 13 * 60 * 60 * 1000

export function pad2(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

export function remainingParts(endAt: number, now = Date.now()) {
  const ms = Math.max(0, endAt - now)
  const totalMin = Math.floor(ms / 60000)
  const day = Math.floor(totalMin / (60 * 24))
  const hrs = Math.floor(totalMin / 60) % 24
  const min = totalMin % 60
  return { day: pad2(day), hrs: pad2(hrs), min: pad2(min) }
}

export function activityPath(meta: PromoEventMeta): string {
  if (meta.type === 'VIP') return '/activity/vip'
  return `/activity/${meta.type}/${meta.routeId}`
}

export function getActivityDetail(type: string, routeId: string): ActivityDetail {
  const found =
    activityEventMeta.find((item) => item.type === type && item.routeId === routeId) ??
    activityEventMeta.find((item) => item.routeId === routeId)
  const meta = found ?? { type, routeId, title: 'Evento' }
  return {
    ...assistanceDetail,
    type: meta.type,
    routeId: meta.routeId,
    title: meta.title,
  }
}

export const rebateRecordCopy = {
  title: 'Taxa de reembolso',
  timeLabel: 'Tempo',
  platformLabel: 'Todos',
  betCol: 'Aposta',
  rateCol: 'Taxa de reembolso',
  empty: 'Sem Registros',
}

export const rebatePlatforms = [{ key: 'all', label: rebateRecordCopy.platformLabel }]
