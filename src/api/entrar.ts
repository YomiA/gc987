/**
 * Fake backend for /main/entrar (signed-in Depósito). Nothing leaves the app.
 *
 * Copy, amounts, and geometry were read off https://gc987.com/main/entrar at
 * 390x844x3 while a session was already open. PIX payloads, order numbers,
 * and countdown timestamps are invented so the live payment QR / tokens never
 * land in the clone.
 *
 * Money is in cents, like the live API, and `formatAmount` from ./promo does
 * the pt-BR grouping the chips use (20,00 / 1.000,00).
 */

import { formatAmount } from './promo'

export interface EntrarChannel {
  key: string
  label: string
  reco: boolean
  icon?: string
}

export interface PixOrder {
  amountCents: number
  /** Full mock PIX copy string — not a real payment. */
  pixCopy: string
  /** Masked row the live page prints, e.g. QR***A1B2C3D4. */
  pixMask: string
  orderNo: string
  createdLabel: string
  /** Epoch ms when the 24h window ends. */
  expiresAt: number
  status: string
}

export const entrarCopy = {
  title: 'Depósito',
  finish: 'Finalizar',
  tabOnline: 'Depósito on-line',
  reco: 'RECO',
  submit: 'Depositar Agora',
  placeholder: '10 - 50.000',
  currency: 'R$',
  promo:
    '💝 Prêmio de login diário de até R$ 678! 🤝 Convide seus amigos agora – 🎁 ganhe R$ 56 imediatamente, comissão de até 5% e 💰 cashback diário e semanal de até 50%! 💰 Não perca, volte amanhã!',
  tips: [
    'Abra seu aplicativo de pagamento e digitalize ou copie e cole o código QR abaixo para concluir sua compra',
    'Este código QR só pode ser pago uma vez. Se precisar pagar novamente, volte e recarregue',
    'Após o pagamento ser bem-sucedido, você pode retornar ao lobby do jogo e aguardar a adição de pontos!',
  ],
  copyQr: 'Copiar código QR',
  qrAddress: 'Endereço do código QR',
  ttl: 'Tempo efetivo:',
  status: 'Status do pedido',
  created: 'Hora de Criação',
  orderNo: 'Número do Pedido',
  toast: 'Cópia Bem-sucedida',
}

/** Live chips, in cents. */
export const entrarAmounts = [2000, 3000, 5000, 10000, 50000, 100000, 500000, 1000000, 2000000]

/** Live input range, in reais. */
export const entrarMinReais = 10
export const entrarMaxReais = 50000

export const entrarChannel: EntrarChannel = {
  key: 'pix',
  label: 'pix',
  reco: true,
}

function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

function formatStamp(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
}

/**
 * Live countdown prints `23h` `59m` `04s` with seconds zero-padded and the
 * minute span carrying the 3px gutters.
 */
export function formatCountdown(msLeft: number): { h: string; m: string; s: string } {
  const total = Math.max(0, Math.floor(msLeft / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return { h: `${h}h`, m: `${m}m`, s: `${pad2(s)}s` }
}

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let orderSeq = 1

export const entrarApi = {
  getChannel: () => settle(entrarChannel),
  getAmounts: () => settle(entrarAmounts),

  async createOrder(amountCents: number): Promise<PixOrder> {
    const created = new Date()
    const seq = String(orderSeq++).padStart(25, '0')
    const order: PixOrder = {
      amountCents,
      pixCopy: `00020126MOCK-PIX-GC987-NOT-A-REAL-PAYMENT-${amountCents}`,
      pixMask: 'QR***A1B2C3D4',
      orderNo: `THRP${seq}`,
      createdLabel: formatStamp(created),
      expiresAt: created.getTime() + 24 * 60 * 60 * 1000 - 7000,
      status: 'Pendente',
    }
    return settle(order)
  },
}

export { formatAmount }
