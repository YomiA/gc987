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

import { formatAmount } from './promo'

export const withdrawCopy = {
  title: 'Saque',
  account: 'Conta Saldo',
  currency: 'R$',
  channel: 'PIX',
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
