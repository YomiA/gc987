import { request } from './http'

/** POST /selfInfo. Amounts are reais, not cents. The withdraw gate reads `hasCashOutPwd`. */
export interface UserInfo {
  account?: string
  userId?: number
  /** Current VIP level. `0` is shown as V0, and the next badge is VIP1. */
  level?: number | string
  avatar?: string
  vipName?: string
  vipIcon?: string
  /** Wager already counted toward the next level. */
  orderAmt?: number
  /** Wager required to reach the next level. */
  upgradeOrderAmt?: number
  /** Deposit already counted toward the next level. */
  rechargeAmt?: number
  /**
   * Deposit required to reach the next level.
   * Missing or 0 hides the recharge sentence and the second progress bar.
   */
  upgradeRechargeAmt?: number
  phone?: string
  phoneStatus?: number
  /** true means a withdrawal password is already set. */
  hasCashOutPwd?: boolean
}

export function getUserInfo() {
  return request<{ code?: number; data?: UserInfo }>('/selfInfo', {
    method: 'POST',
    body: {},
  })
}

/** Only an explicit true counts as set. false keeps the set-password prompt. */
export function cashOutPasswordSet(info: UserInfo | null | undefined) {
  return info?.hasCashOutPwd === true
}

/** `0`, `"0"`, and `"V0"` all become 0. A missing level stays 0. */
export function vipLevelNumber(level: unknown) {
  if (typeof level === 'number' && Number.isFinite(level)) return level
  const text = String(level ?? '').trim()
  if (!text) return 0
  const n = Number(text.replace(/^vip/i, '').replace(/^v/i, ''))
  return Number.isFinite(n) ? n : 0
}

/** A missing field stays null. `0` is a real value and hides the recharge row. */
export function selfInfoAmount(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

export function showsRechargeProgress(info: UserInfo | null | undefined) {
  const amount = selfInfoAmount(info?.upgradeRechargeAmt)
  return amount != null && amount !== 0
}

/** 1 is male, 0 is female. */
export type AvatarSex = 0 | 1

const AVATAR_KEYS = ['avatarPath', 'avatar', 'url', 'image', 'img', 'path', 'picPath']
const AVATAR_LIST_KEYS = ['records', 'list', 'rows', 'avatars', 'avatarList']

function avatarText(value: unknown) {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const row = value as Record<string, unknown>
  for (const key of AVATAR_KEYS) {
    const text = row[key]
    if (typeof text === 'string' && text.trim()) return text.trim()
  }
  return ''
}

function avatarList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  const row = data as Record<string, unknown>
  for (const key of AVATAR_LIST_KEYS) {
    if (Array.isArray(row[key])) return row[key]
  }
  return []
}

/** Paths from POST /avatarOptions/{sex}, in the order the backend returned them. */
export function avatarOptionsOf(data: unknown) {
  const seen = new Set<string>()
  const paths: string[] = []
  for (const item of avatarList(data)) {
    const raw = avatarText(item)
    if (!raw || seen.has(raw)) continue
    seen.add(raw)
    paths.push(raw)
  }
  return paths
}

export function avatarOptions(sex: AvatarSex) {
  return request<{ code?: number; data?: unknown }>(`/avatarOptions/${sex}`, {
    method: 'POST',
    body: {},
  })
}

/** Save the picked avatar. Only `avatar` is sent; nickName, sex and birthday stay unchanged. */
export function updateSelfInfo(avatar: string) {
  return request<{ code?: number }>('/updateSelfInfo', {
    method: 'POST',
    body: { avatar },
  })
}
