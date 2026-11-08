/**
 * Fake backend for /main/promo. Nothing leaves the app.
 *
 * Tab labels, card order, badge/shiny flags and the banner list are the values
 * read off https://gc987.com/main/promo at 390x844x3; the banners themselves are
 * the live PNGs downloaded into public/images/promo-page/ by
 * scripts/download-assets-promo-page.mjs.
 *
 * The Rebate / VIP payloads below are the live tRPC responses the page loads
 * (activity.activityDetail id=3847 type=Rebate, vip.list, vip.info), trimmed to
 * the fields the six panels render. Money arrives in cents, exactly as the API
 * sends it, and `formatAmount` groups it for the language the UI is showing.
 */

import { activityEventMeta } from './activity'
import { request } from './http'
import { assetUrl } from '../utils/assetUrl'
import { formatAmount } from '../utils/money'

export interface PromoTab {
  key: string
  label: string
}

export interface PromoEvent {
  id: number
  image: string
  /** Live cards 6 and 7 show the 14px red badge. */
  badge: boolean
  /** Same two cards run the infinite white sweep. */
  shiny: boolean
  /** Live `activity.type` used in `/activity/:type/:id`. */
  type: string
  /** Live path id, including optional `@style_N`. */
  routeId: string
  title: string
}

/**
 * Left rail of the Rebate panel. The live payload enables `gameTypes:
 * ["ELECTRONIC"]`, so only that tile is rendered; the other three stay in the
 * DOM with `display: none`, which is what `enabled: false` reproduces.
 */
export interface RebateCategory {
  key: string
  label: string
  /** Only the checked tile has artwork; the disabled ones use a glyph. */
  icon: string
  enabled: boolean
}

export interface RebateRow {
  platformId: number
  name: string
  /**
   * File stem under src/assets/promo/providers. The live logos are
   * `currentColor` SVGs behind an ion-icon, so they have to be inlined to come
   * out white; an <img> would paint them black.
   */
  slug: string
  /** Valid bet, in cents. */
  bet: number
  /** Achieved rebate rate, in basis points (live value 0). */
  rate: number
  /** First tier of rebateRatioList: bet this much... */
  tierBet: number
  /** ...to earn this rate, in basis points (40 -> 0,40%). */
  tierRate: number
  /** Claimable amount, in cents. */
  claimable: number
  /** 0..1, drives the bar behind the tier line (live value 0). */
  progress: number
}

export interface VipLevel {
  level: number
  /** vipLeves.vipIcon. Empty when that level has none; the row then uses the local crown. */
  icon?: string
  /** Bônus tab: valid bet required to reach the level, in cents. */
  promotionBet: number
  /**
   * Upgrade recharge in cents. Omitted when that level has no upgradeRechargeAmt.
   * The column is shown when any level includes it.
   */
  promotionRecharge?: number
  promotionReward: number
  dailyReward: number
  weeklyReward: number
  monthlyReward: number
  /** 0 not started, 1 in progress, 2 ready to claim, 3 claimed. */
  promotionStatus?: number
  dailyStatus?: number
  weeklyStatus?: number
  monthlyStatus?: number
  /** "Instruções para manter o nível" table. */
  retentionBet: number
  retentionRecharge: number
}

export function promoTabList(): PromoTab[] {
  return promoTabs
}

/** Rule copy shown under the VIP list. It is not part of /vipList. */
export function vipStaticCopy() {
  return { rules: vipRules, retentionRules: vipRetentionRules }
}

const promoTabs: PromoTab[] = [
  { key: 'eventos', label: 'Eventos' },
  { key: 'rebate', label: 'Rebate' },
  { key: 'vip', label: 'VIP' },
  { key: 'resgate', label: 'Código de Resgate' },
  { key: 'historico', label: 'Histórico' },
  { key: 'pendente', label: 'Pendente' },
]

const BASE = '/images/promo-page'

const promoEvents: PromoEvent[] = [
  'weekly-compensation',
  'loss-rebate',
  'invite-friend',
  'vip-bonus',
  'daily-checkin',
  'member-day',
  'friend-help',
  'tuesday-recharge',
  'lucky-test',
  'random-bonus',
  'bet-cashback',
  'whatsapp-channel',
  'mystery-bonus',
  'telegram-channel',
].map((name, i) => {
  const meta = activityEventMeta[i] ?? activityEventMeta[0]
  return {
    id: i + 1,
    image: `${BASE}/${name}.png`,
    badge: i === 5 || i === 6,
    shiny: i === 5 || i === 6,
    type: meta.type,
    routeId: meta.routeId,
    title: meta.title,
  }
})

const rebateCategories: RebateCategory[] = [
  { key: 'CHESS', label: 'Cartas', icon: '', enabled: false },
  { key: 'ELECTRONIC', label: 'Slot', icon: `${BASE}/sort-electronic-on.png`, enabled: true },
  { key: 'FISHING', label: 'Pesca', icon: '', enabled: false },
  { key: 'VIDEO', label: 'Cassino', icon: '', enabled: false },
]

/** ELECTRONIC platforms, in the order activity.activityDetail returns them. */
const rebateRows: RebateRow[] = [
  [43, 'FASTSPIN', 'fastspin'],
  [23, 'PG', 'pg'],
  [42, 'inout', 'inout'],
  [40, 'RUBYPLAY', 'rubyplay'],
  [39, 'PLAYSON', 'playson'],
  [38, 'POPOK', 'popok'],
  [37, 'FaChai', 'fachai'],
  [36, 'G759', 'g759'],
  [35, 'CP', 'cp'],
  [34, 'PP', 'pp'],
  [33, 'Spribe', 'spribe'],
  [29, 'JDB', 'jdb'],
  [26, 'CQ9', 'cq9'],
  [25, 'Tada', 'tada'],
].map(([platformId, name, slug]) => ({
  platformId: platformId as number,
  name: name as string,
  slug: slug as string,
  bet: 0,
  rate: 0,
  tierBet: 100,
  tierRate: 40,
  claimable: 0,
  progress: 0,
}))

/** vip.list -> vipLevelDatas, cents kept as sent. */
const vipLevels: VipLevel[] = (
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 10000, 100, 10, 0, 30, 0, 1000],
    [2, 100000, 300, 20, 100, 100, 5000, 0],
    [3, 300000, 1000, 30, 300, 300, 10000, 0],
    [4, 1000000, 1500, 50, 500, 500, 20000, 0],
    [5, 3000000, 3000, 100, 500, 800, 50000, 0],
    [6, 6000000, 4000, 150, 600, 1200, 100000, 0],
    [7, 10000000, 5500, 300, 800, 1600, 200000, 0],
    [8, 30000000, 15500, 400, 1500, 3000, 0, 0],
    [9, 60000000, 25500, 500, 2000, 4000, 0, 0],
    [10, 100000000, 35500, 700, 2500, 5000, 0, 0],
    [11, 200000000, 55500, 1500, 3500, 10000, 0, 0],
    [12, 300000000, 75500, 2500, 5500, 25000, 0, 0],
    [13, 400000000, 85500, 3000, 7500, 35000, 0, 0],
    [14, 500000000, 95500, 3500, 9500, 50000, 0, 0],
    [15, 600000000, 105500, 4500, 11500, 60000, 0, 0],
    [16, 800000000, 125500, 5500, 15500, 80000, 0, 0],
    [17, 1000000000, 155500, 8500, 20500, 100000, 0, 0],
    [18, 1200000000, 205500, 10500, 25500, 120000, 0, 0],
    [19, 1400000000, 235500, 12500, 30500, 150000, 0, 0],
    [20, 1600000000, 265500, 15500, 35500, 180000, 0, 0],
    [21, 1800000000, 305500, 18500, 41500, 200000, 0, 0],
    [22, 2000000000, 355500, 22500, 45500, 220000, 0, 0],
    [23, 2300000000, 405500, 22500, 55500, 240000, 0, 0],
    [24, 2600000000, 505500, 30500, 65500, 260000, 0, 0],
    [25, 3000000000, 605500, 35500, 75500, 300000, 0, 0],
  ] as const
).map(
  ([
    level,
    promotionBet,
    promotionReward,
    dailyReward,
    weeklyReward,
    monthlyReward,
    retentionBet,
    retentionRecharge,
  ]) => ({
    level,
    promotionBet,
    promotionReward,
    dailyReward,
    weeklyReward,
    monthlyReward,
    retentionBet,
    retentionRecharge,
  }),
)

/** vip.info: the signed-in state the live page renders in its level card. */
const vipInfo = {
  level: 0,
  nextLevel: 1,
  /** Valid bet still missing for the next level, in cents. */
  remainingBet: 10000,
  /** Progress of the current level row in the Bônus table. */
  progressBet: 0,
  progressTarget: 10000,
  /** Deposit already counted toward the next level, in cents. */
  progressRecharge: 0,
  /** Deposit required by the next level, in cents. */
  rechargeTarget: 0,
  /** Current level's vipIcon from /vipList. A 500 still uses this address. */
  icon: '',
  /** res.data.rewardStatus. 1 can claim all, 0 stays gray. */
  rewardStatus: 0,
}

const vipRules = [
  'Padrão de promoção: atenda aos requisitos da promoção VIP (ou seja, a recarga ou apostas eficazes podem atender às condições), você pode avançar para o nível VIP correspondente e obter o bônus de promoção correspondente.O bônus pode ser recebido de tempos em tempos;',
  'Bônus Diário: Ao cumprir os requisitos de depósito e apostas válidas do nível atual, você receberá o bônus diário correspondente. Caso avance consecutivamente por vários níveis, apenas o bônus diário do nível atual poderá ser obtido. Bônus em tempo real podem ser reivindicados;',
  'Bônus Semanal: Ao cumprir os requisitos de depósito e apostas válidas do nível atual a cada semana, você receberá o bônus semanal correspondente. Caso avance consecutivamente por vários níveis, apenas o bônus semanal do nível atual poderá ser obtido. Bônus em tempo real podem ser reivindicados;',
  'Bônus Mensal: Ao cumprir os requisitos de depósito e apostas válidas do nível atual a cada mês, você receberá o bônus mensal correspondente. Caso avance consecutivamente por vários níveis, apenas o bônus mensal do nível atual poderá ser obtido. Bônus em tempo real podem ser reivindicados;',
  'Tempo de Expiração da Recompensa: A recompensa deve ser reivindicada manualmente, Bônus expirados serão automaticamente creditados em sua conta.',
  'Instruções para auditoria: o bônus VIP oferecido pode ser levantado apenas após o cumprimento do requisito de rollover 1x (ou seja, auditoria, apostas ou apostas válidas), A aposta não está limitada a qualquer plataforma ou jogo;',
  'Declaração de Atividade: Esta funcionalidade é limitada apenas ao titular da conta para apostas normais. É proibido alugar contas, realizar apostas sem risco (arbitragem, apostas cruzadas, apostas de baixa probabilidade), arbitragem maliciosa, uso de programas de trapaça, robôs, exploração de protocolos, falhas, interfaces, controle em massa ou qualquer outro meio técnico. Após verificação de qualquer violação, a plataforma se reserva o direito de encerrar o acesso do membro, suspender o uso do site e confiscar bônus e ganhos indevidos, sem a necessidade de aviso prévio.',
  'Explicação: Ao receber as recompensas VIP, a plataforma considerará que o membro concorda e cumpre as condições correspondentes e outras regras relacionadas. Para evitar mal-entendidos de interpretação textual, a plataforma se reserva o direito final de interpretação desta atividade.',
]

const vipRetentionRules = [
  '1.A manutenção do nível VIP será determinada às 00:00 do dia 1º de cada mês. Se as recargas e apostas válidas do mês anterior atenderem aos requisitos para o nível VIP atual, a retenção é bem-sucedida; caso contrário, será reduzida em 1 nível.',
  '2.Após não conseguir manter o nível, você precisa acumular recargas e apostas válidas novamente para ser elegível para a promoção. Uma vez promovido, você não receberá a recompensa da promoção novamente.',
  '3.Se você não conseguir manter seu nível, poderá recuperá-lo alcançando os valores de recarga e aposta válidos necessários para o seu nível VIP atual no mesmo mês. No entanto, você não receberá a recompensa da promoção novamente ao atingir o nível.',
]

/** Both record tabs come back empty for this account. */
const promoRecords: never[] = []

export { formatAmount }

/** Basis points, the way the live page prints rates: 40 -> "0,40%" in Portuguese. */
export function formatRate(basisPoints: number): string {
  return `${formatAmount(basisPoints)}%`
}

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const promoApi = {
  getTabs: () => settle(promoTabs),
  getEvents: () => settle(promoEvents),
  getRebate: () =>
    settle({ categories: rebateCategories, rows: rebateRows, receivable: 0, activeCategory: 'ELECTRONIC' }),
  getVip: () => settle({ levels: vipLevels, info: vipInfo, rules: vipRules, retentionRules: vipRetentionRules }),
  getRecords: () => settle(promoRecords),
}

export interface VipBoard {
  levels: VipLevel[]
  info: typeof vipInfo
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function textOf(value: unknown): string {
  if (typeof value === 'string' || typeof value === 'number') return String(value).trim()
  const row = asRecord(value)
  if (!row) return ''
  for (const key of ['ptBR', 'pt-BR', 'pt', 'enUS', 'en', 'zhCN', 'zh-CN', 'zh']) {
    const text = row[key]
    if (typeof text === 'string' && text.trim()) return text.trim()
  }
  for (const text of Object.values(row)) {
    if (typeof text === 'string' && text.trim()) return text.trim()
  }
  return ''
}

function flagged(value: unknown) {
  if (value === true) return true
  const n = Number(value)
  return Number.isFinite(n) && n > 0
}

/** VIP amounts on this backend are reais, same as /selfInfo. The table still formats cents. */
function cents(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

function firstCents(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (row[key] != null && row[key] !== '') return cents(row[key])
  }
  return 0
}

function activityRows(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  const row = asRecord(data)
  if (!row) return []
  for (const key of ['records', 'list', 'rows', 'activityList']) {
    if (Array.isArray(row[key])) return row[key]
  }
  if (Array.isArray(row['0'])) return row['0']
  const groups = Object.values(row).filter(Array.isArray) as unknown[][]
  if (!groups.length) return []
  const seen = new Set<string>()
  const rows: unknown[] = []
  for (const group of groups) {
    for (const item of group) {
      const record = asRecord(item)
      const id = textOf(record?.activityId ?? record?.id)
      if (id && seen.has(id)) continue
      if (id) seen.add(id)
      rows.push(item)
    }
  }
  return rows
}

function eventOf(item: unknown, index: number): PromoEvent | null {
  const row = asRecord(item)
  if (!row) return null
  const image = textOf(
    row.icon ?? row.activityIcon ?? row.banner ?? row.picPath ?? row.showImg ?? row.activityImg ?? row.image ?? row.cover,
  )
  const idText = textOf(row.activityId ?? row.id) || String(index + 1)
  const id = Number(idText)
  return {
    id: Number.isFinite(id) ? id : index + 1,
    image: assetUrl(image),
    badge: flagged(row.redPoint ?? row.redDot ?? row.unReceiveCount ?? row.badge),
    shiny: flagged(row.shiny ?? row.flash ?? row.light),
    type: textOf(row.activityType ?? row.type),
    routeId: textOf(row.routeId ?? row.activityId ?? row.id) || idText,
    title: textOf(row.activityName ?? row.name ?? row.title),
  }
}

/** POST /activityList. Eventos cards, in the order the backend returns them. */
export async function loadActivityEvents() {
  const resp = await request<{ data?: unknown }>('/activityList', { method: 'POST', body: {} })
  return activityRows(resp.data).map(eventOf).filter((event): event is PromoEvent => event != null)
}

/** 12 upgrade, 13 daily, 14 weekly, 15 monthly. Keys stay strings, as JSON object keys do. */
const PRIZE_KEY = {
  promotion: '12',
  daily: '13',
  weekly: '14',
  monthly: '15',
} as const

interface PrizeRow {
  vipId: number | null
  cents: number
  status: number
}

function rowsOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

/** Cents when the field is present, including 0. Null when the field is absent. */
function centsOrNull(value: unknown): number | null {
  if (value == null || value === '') return null
  return cents(value)
}

function prizeRows(value: unknown): PrizeRow[] {
  return rowsOf(value).map((item) => {
    const row = asRecord(item)
    if (!row) return { vipId: null, cents: 0, status: 0 }
    const id = Number(row.vipId)
    const status = Number(row.rewardStatus)
    return {
      vipId: Number.isFinite(id) ? id : null,
      cents: cents(row.rewardValue),
      status: Number.isFinite(status) ? status : 0,
    }
  })
}

/** Built once per response. Ten levels, so this is a handful of writes, not a render-time search. */
function prizeMap(rows: PrizeRow[]) {
  const map = new Map<number, PrizeRow>()
  for (const row of rows) {
    if (row.vipId == null || map.has(row.vipId)) continue
    map.set(row.vipId, row)
  }
  return map
}

/** vipId wins. A row without one still lines up with vipLeves in the same order. */
function prizeAt(rows: PrizeRow[], map: Map<number, PrizeRow>, vipId: number, index: number) {
  return map.get(vipId) ?? rows[index] ?? { vipId: null, cents: 0, status: 0 }
}

function clampProgress(currentReais: number | null, targetCents: number) {
  const current = currentReais == null ? 0 : Math.round(currentReais * 100)
  return targetCents > 0 ? Math.min(Math.max(current, 0), targetCents) : 0
}

function reaisToCents(value: number) {
  return Math.round(value * 100)
}

/** Still short of the requirement. A zero already-have leaves the requirement unchanged. */
function stillNeed(requiredCents: number, haveCents: number) {
  return Math.max(requiredCents - haveCents, 0)
}

/**
 * POST /vipList.
 * `betReais` / `rechargeReais` are what the account already has (/selfInfo).
 * `needBetReais` / `needRechargeReais` are that account's required amounts.
 * The card prints required minus already-have. Null falls back to the next level row.
 */
export async function loadVipBoard(
  betReais: number | null,
  rechargeReais: number | null = null,
  needBetReais: number | null = null,
  needRechargeReais: number | null = null,
): Promise<VipBoard> {
  const resp = await request<{ data?: unknown }>('/vipList', { method: 'POST', body: {} })
  const data = asRecord(resp.data)
  const rewards = asRecord(data?.vipRewards)
  const groups = {
    promotion: prizeRows(rewards?.[PRIZE_KEY.promotion]),
    daily: prizeRows(rewards?.[PRIZE_KEY.daily]),
    weekly: prizeRows(rewards?.[PRIZE_KEY.weekly]),
    monthly: prizeRows(rewards?.[PRIZE_KEY.monthly]),
  }
  const maps = {
    promotion: prizeMap(groups.promotion),
    daily: prizeMap(groups.daily),
    weekly: prizeMap(groups.weekly),
    monthly: prizeMap(groups.monthly),
  }
  const levels: VipLevel[] = []
  rowsOf(data?.vipLeves ?? data?.vipLevels).forEach((item, index) => {
    const row = asRecord(item)
    if (!row) return
    const level = Number(row.vipLevel ?? row.level ?? row.vipId)
    if (!Number.isFinite(level)) return
    const vipId = Number(row.vipId ?? level)
    const recharge = centsOrNull(row.upgradeRechargeAmt)
    const promotion = prizeAt(groups.promotion, maps.promotion, vipId, index)
    const daily = prizeAt(groups.daily, maps.daily, vipId, index)
    const weekly = prizeAt(groups.weekly, maps.weekly, vipId, index)
    const monthly = prizeAt(groups.monthly, maps.monthly, vipId, index)
    levels.push({
      level,
      icon: assetUrl(textOf(row.vipIcon ?? row.icon)),
      promotionBet: firstCents(row, ['upgradeOrderAmt', 'promotionBet', 'orderAmt']),
      ...(recharge == null ? {} : { promotionRecharge: recharge }),
      promotionReward: promotion.cents,
      promotionStatus: promotion.status,
      dailyReward: daily.cents,
      dailyStatus: daily.status,
      weeklyReward: weekly.cents,
      weeklyStatus: weekly.status,
      monthlyReward: monthly.cents,
      monthlyStatus: monthly.status,
      retentionRecharge: firstCents(row, ['retentionRecharge', 'keepRechargeAmt', 'keepAmt', 'relegationAmt']),
      retentionBet: firstCents(row, ['retentionBet', 'keepOrderAmt', 'relegationOrderAmt']),
    })
  })
  const currentLevel = Number(data?.vipLevel)
  const currentIndex = Number.isFinite(currentLevel) ? levels.findIndex((level) => level.level === currentLevel) : -1
  const current = currentIndex >= 0 ? levels[currentIndex] : null
  const next = currentIndex >= 0 ? levels[currentIndex + 1] : levels[0]
  const haveBet = betReais == null ? 0 : reaisToCents(betReais)
  const target = needBetReais == null ? (next?.promotionBet ?? 0) : reaisToCents(needBetReais)
  const rechargeTarget =
    needRechargeReais == null ? (next?.promotionRecharge ?? 0) : reaisToCents(needRechargeReais)
  const progressBet = clampProgress(betReais, target)
  const progressRecharge = clampProgress(rechargeReais, rechargeTarget)
  const rewardStatus = Number(data?.rewardStatus) === 1 ? 1 : 0
  return {
    levels,
    info: {
      level: current?.level ?? (Number.isFinite(currentLevel) ? currentLevel : 0),
      nextLevel: next?.level ?? current?.level ?? 0,
      remainingBet: stillNeed(target, haveBet),
      progressBet,
      progressTarget: target,
      progressRecharge,
      rechargeTarget,
      icon: assetUrl(textOf(data?.vipIcon)) || current?.icon || '',
      rewardStatus,
    },
  }
}

/** Coletar Tudo. Lit only when /vipList rewardStatus is 1. */
export function claimVipRewards() {
  return request('/user/receiveVipAll', { method: 'PUT', body: {} })
}
