/**
 * Fake backend for /main/withdraw (signed-in Saque). Nothing leaves the app.
 *
 * Copy, chips, and geometry were read off https://gc987.com/main/withdraw at
 * 390x844x3 while a session was already open. Conta Saldo on that capture was
 * R$ 0,00, so the mock balance stays 0 cents and every chip is `.disabled`.
 *
 * Money is in cents, like the live API, and `formatAmount` from ./promo does
 * the pt-BR grouping the chips use (20,00 / 1.000,00).
 */

import { request } from './http'
import { formatAmount } from './promo'

export interface CashOutChannel {
  id?: number
  icon: string
  /** Plain string, or `{ zhCN, enUS, ptBR }`. */
  showName?: string | Record<string, string | null | undefined> | null
  /** Smallest amount, in currency units (reais), not cents. */
  minCashOutAmt: number
  /** Largest amount, in currency units (reais), not cents. */
  maxCashOutAmt: number
  /** Suggested amounts, in currency units (reais), not cents. */
  cashOutAmtArr?: Array<string | number>
}

/** Withdrawal channels. Called when the withdraw page opens. No body. */
export function cashOutChannels() {
  return request<{ code?: number; data?: { channels?: CashOutChannel[] } }>('/cashOutChannels', {
    method: 'POST',
    body: {},
  })
}

export interface CashOutOrderBody {
  /** Bound payout account, when the page has one. */
  bankCardId?: number
  channelId: number
  /** Player wallet on this API. Agent payouts use 2. */
  walletType: number
  /** Currency units (reais), not cents. */
  amt: number
  cashOutPwd: string
  phone?: string
  captcha?: string
}

/** Player wallet. The Saque page always pays from this wallet. */
export const cashOutWalletPlayer = 0

/** Creates a withdrawal. Phone and captcha stay off the body. */
export function createCashOutOrder(body: CashOutOrderBody) {
  return request<{ code?: number; data?: unknown }>('/createCashOutOrder', {
    method: 'POST',
    body,
  })
}

/** First withdrawal password. After this succeeds, /selfInfo reports hasCashOutPwd true. */
export function setCashOutPwd(password: string) {
  return request<{ code?: number; data?: unknown }>('/setCashOutPwd', {
    method: 'POST',
    body: { password },
  })
}

export interface CashOutOrderRecord {
  id: number
  orderTime: string
  transactionId: string
  /** Currency units (reais), not cents. */
  orderAmt: number
  /** 1 pending, 2 paying, 3 success, 4 failed, 5 cancelled, 6 approved, 7 rejected, 8 refunded. */
  status: number
}

export interface CashOutOrderPage {
  records?: CashOutOrderRecord[]
  total?: number
  size?: number
  current?: number
  pages?: number
}

export interface CashOutOrderQuery {
  size: number
  current: number
  startSearchTime?: string
  endSearchTime?: string
  status?: number
}

/** Withdrawal history. Status stays off the body unless a status is selected. */
export function cashOutOrderRecord(body: CashOutOrderQuery, silent = false) {
  return request<{ code?: number; data?: CashOutOrderPage }>('/cashOutOrderRecord', {
    method: 'POST',
    body,
    silent,
  })
}

export const withdrawCopy = {
  title: 'Saque',
  account: 'Conta Saldo',
  currency: 'R$',
  channel: 'PIX',
  channelMissing: 'Selecione um canal de saque',
  amountTitle: 'Valor do Saque',
  placeholder: '10,00 - 10.000,00',
  feePrefix: 'para saques',
  feeSuffix: 'Taxa de Manuseio',
  methodTitle: 'Método de Retirada',
  method: 'CPF',
  nameLabel: 'Nome',
  namePlaceholder: 'Por favor, insira seu nome',
  nameError: 'Nome inválido',
  cpfLabel: 'CPF ID',
  cpfPlaceholder: 'Por favor, insira o CPF',
  cpfError: 'CPF inválido, por favor insira 11 dígitos',
  amountError: 'Por favor insira um valor inteiro',
  submit: 'Retirar Agora',
  passwordTitle: 'Digite sua senha de saque',
  passwordAction: 'Retirar fundos',
  passwordSuccess: 'Ordem de saque criada com sucesso',
  fundTips:
    'Para a segurança dos seus fundos, por favor, configure primeiro uma senha de fundo',
  fundTipsConfirm: 'Confirmar',
}

/** Live chips, in cents. */
export const withdrawAmounts = [
  2000, 5000, 10000, 100000, 500000, 1000000, 2000000, 3000000, 5000000,
]

/** Live input range, in reais. */
export const withdrawMinReais = 10
export const withdrawMaxReais = 10000

/** Captured session: R$ 0,00 / 0,00 handling fee. */
export const withdrawBalanceCents = 0
export const withdrawFeeCents = 0

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** Live `user.assets`. Unset so Retirar Agora can show the TIPS sheet. */
export const withdrawAssets = {
  passwordSwitch: 'ON' as const,
  isAssetPassword: false,
}

export function mockSetAssetPassword() {
  withdrawAssets.isAssetPassword = true
}

export const withdrawApi = {
  getAmounts: () => settle(withdrawAmounts),
  getBalance: () => settle(withdrawBalanceCents),
  getFee: () => settle(withdrawFeeCents),
  getAssets: () => settle({ ...withdrawAssets }),
}

export { formatAmount }
