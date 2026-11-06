import { request } from './http'

export interface PaymentChannel {
  id: number
  icon: string
  showName: string
  realNamePayStatus: number
  /** Smallest amount, in currency units (reais), not cents. */
  minPayAmt: number
  /** Largest amount, in currency units (reais), not cents. */
  maxPayAmt: number
  /** Suggested amounts, in currency units (reais), not cents. */
  payAmtArr: Array<string | number>
}

interface Envelope {
  code?: number
  data?: { channels?: PaymentChannel[] }
}

/** Deposit channels. Called when the deposit page opens. */
export function paymentChannels() {
  return request<Envelope>('/paymentChannels', { method: 'POST', body: {} })
}

export interface CreatePaymentOrderReq {
  amount: number
  channelId: number
  activityId?: number
  payerIdNo?: string
  payerName?: string
}

/** Creates a deposit and returns the payment link in `data`. */
export function createPaymentOrder(body: CreatePaymentOrderReq) {
  return request<{ code?: number; data?: string }>('/createPaymentOrder', {
    method: 'POST',
    body,
  })
}

export interface PaymentOrderRecord {
  id: number
  orderTime: string
  transactionId: string
  /** Currency units (reais), not cents. */
  orderAmt: number
  /** 1 pending, 2 paying, 3 success, 4 failed, 5 cancelled, 6 approved, 7 rejected, 8 refunded. */
  status: number
}

export interface PaymentOrderPage {
  records?: PaymentOrderRecord[]
  total?: number
  size?: number
  current?: number
  pages?: number
}

export interface PaymentOrderQuery {
  size: number
  current: number
  startSearchTime?: string
  endSearchTime?: string
  status?: number
}

/** Deposit history. Status stays off the body; the selected day window is sent. */
export function paymentOrderRecord(body: PaymentOrderQuery, silent = false) {
  return request<{ code?: number; data?: PaymentOrderPage }>('/paymentOrderRecord', {
    method: 'POST',
    body,
    silent,
  })
}
