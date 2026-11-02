/**
 * Fake backend for `/withdrawalAccount` and `/withdrawalBindAccount`.
 * Nothing leaves the app.
 *
 * Geometry from https://gc987.com/withdrawalAccount and
 * https://gc987.com/withdrawalBindAccount at 390x844x3 (empty PIX list).
 */

export interface PixAccount {
  id: string
  name: string
  pix: string
}

export const withdrawalAccountCopy = {
  title: 'Minha conta',
  tab: 'PIX',
  add: 'Adicionar Conta',
  bindTitle: 'Adicionar Conta',
  tip1Num: '1.',
  tip1: 'Para garantir uma remessa rápida, preencha seu nome completo, que seja consistente com a conta.',
  tip2Num: '2.',
  tip2: 'Verifique as informações da sua conta. Transferências para contas incorretas não serão possíveis.',
  nameLabel: 'Nome*',
  namePlaceholder: 'Por favor, insira seu nome',
  pixLabel: 'PIX Conta*',
  pixPrefix: '+55',
  pixPlaceholder: 'Insira a conta da sua carteira',
  submit: 'Adicionar Conta',
}

const accounts: PixAccount[] = []

function settle<T>(value: T, ms = 80): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const withdrawalAccountApi = {
  list: () => settle([...accounts]),
  add: (name: string, pix: string) => {
    accounts.push({ id: String(accounts.length + 1), name, pix })
    return settle(accounts[accounts.length - 1])
  },
}
