/**
 * Fake backend for /main/perfil. Nothing leaves the app.
 *
 * Shape and copy are the values read off https://gc987.com/main/perfil at
 * 390x844x3 while signed in; the icons are the live assets downloaded into
 * public/images/perfil/ by scripts/download-assets-perfil-page.mjs.
 *
 * The account identifiers are deliberately fake — same digit count as the live
 * ones so the row widths match, but no real ID/account/token is stored here.
 * Money is in cents, like the live API sends it, and `formatAmount` from
 * ./promo does the pt-BR grouping.
 */

export interface PerfilProfile {
  id: string
  account: string
  avatar: string
  /** Balance in cents. */
  balance: number
  /** Crown artwork, one file for every level on the live site. */
  crown: string
  /** Badge text on the crown, e.g. `V0`. */
  levelBadge: string
  /** Inline colour the live page puts on the badge span at this level. */
  levelBadgeColor: string
}

export interface PerfilVip {
  crown: string
  levelBadge: string
  levelBadgeColor: string
  /** Next level label rendered in the accent colour. */
  nextLevel: string
  /** Bet still required to reach `nextLevel`, in cents. */
  requiredBet: number
  /** Bet already placed towards `nextLevel`, in cents. */
  currentBet: number
}

export interface PerfilOption {
  key: string
  label: string
  icon: string
  /** Right-hand hint, only the Convidar row has one. */
  note?: string
}

const ICONS = '/images/perfil'

const profile: PerfilProfile = {
  id: '1000000001',
  account: '55900000000',
  avatar: `${ICONS}/avatar-male-1.jpg`,
  balance: 0,
  crown: `${ICONS}/vip-crown.png`,
  levelBadge: 'V0',
  levelBadgeColor: 'rgb(117, 117, 117)',
}

const vip: PerfilVip = {
  crown: `${ICONS}/vip-crown.png`,
  levelBadge: 'V0',
  levelBadgeColor: 'rgb(117, 117, 117)',
  nextLevel: 'VIP1',
  requiredBet: 10000,
  currentBet: 0,
}

/** DOM order of the live list. `Idioma` sits between 5 and 6 with display:none. */
const options: PerfilOption[] = [
  { key: 'relatorios', label: 'Relatórios', icon: `${ICONS}/detail.png` },
  {
    key: 'convidar',
    label: 'Convidar',
    icon: `${ICONS}/convidar.png`,
    note: 'Venha para o GC987.COM jogar comigo e descubra como ganhar dinheiro de verdade!',
  },
  { key: 'resgate', label: 'Código de Resgate', icon: `${ICONS}/resgate.svg` },
  { key: 'suporte', label: 'Suporte', icon: `${ICONS}/customer.png` },
  { key: 'seguranca', label: 'Centro de Segurança', icon: `${ICONS}/security.png` },
  { key: 'sair', label: 'Sair', icon: `${ICONS}/logout.png` },
]

export const perfilLogoutCopy = {
  title: 'Sair',
  message: 'Tem certeza de que deseja sair?',
  cancel: 'Cancelar',
  confirm: 'Sair',
}

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const perfilApi = {
  getProfile: () => settle(profile),
  getVip: () => settle(vip),
  getOptions: () => settle(options),
}
