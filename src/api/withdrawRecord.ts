/**
 * Fake backend for /withdrawSubView (Saque header record icon).
 * Live account had no rows; totals stay 0.
 */

import { formatAmount } from './promo'

export const withdrawSubCopy = {
  saquesTab: 'Registro de Saques',
  auditTab: 'Registros de Auditoria',
  totalLabel: 'Retirada Total:',
  auditLabel: 'Valor a ser auditado:',
  empty: 'Sem Registros',
}

export const withdrawDateRanges = [
  { key: 'today', label: 'Hoje' },
  { key: 'last3', label: 'Últimos 3 Dias' },
  { key: 'last5', label: 'Últimos 5 Dias' },
  { key: 'last7', label: 'Últimos 7 Dias' },
]

export const withdrawAuditFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'recharge', label: 'Depósito de Membro' },
  { key: 'activity', label: 'Eventos' },
  { key: 'system', label: 'Auditoria do Sistema' },
]

export type WithdrawSubTab = 'saques' | 'auditoria'

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const withdrawRecordApi = {
  getSaquesTotal: () => settle(0),
  getAuditAmount: () => settle(0),
  getRecords: () => settle([] as never[]),
}

export { formatAmount }
