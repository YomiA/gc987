/**
 * Copy and date pills for /withdrawSubView.
 * The Saques list comes from POST /cashOutOrderRecord.
 */

import { zoneDayRange } from '../utils/timeZone'
import { formatAmount } from './promo'

export const withdrawSubCopy = {
  saquesTab: 'Registro de Saques',
  auditTab: 'Registros de Auditoria',
  totalLabel: 'Retirada Total:',
  auditLabel: 'Valor a ser auditado:',
  empty: 'Sem Registros',
  name: 'Saque',
  copied: 'Cópia Bem-sucedida',
}

export const withdrawDateRanges = [
  { key: 'today', label: 'Hoje', days: 0 },
  { key: 'last3', label: 'Últimos 3 Dias', days: 2 },
  { key: 'last5', label: 'Últimos 5 Dias', days: 4 },
  { key: 'last7', label: 'Últimos 7 Dias', days: 6 },
]

export const withdrawStatusText: Record<number, { label: string; color: string }> = {
  1: { label: 'Pendente', color: '#ffc409' },
  2: { label: 'Processando', color: '#ffc409' },
  3: { label: 'Sucesso', color: '#27d48b' },
  4: { label: 'Falha', color: '#c5000f' },
  5: { label: 'Cancelado', color: '#c5000f' },
  6: { label: 'Aprovado', color: '#27d48b' },
  7: { label: 'Reprovado', color: '#c5000f' },
  8: { label: 'Reembolsado', color: '#8792af' },
}

/** Inclusive site-zone day window. "Últimos 3 Dias" is today plus the two days before it. */
export function searchWindow(key: string) {
  const match = withdrawDateRanges.find((item) => item.key === key) ?? withdrawDateRanges[0]
  return {
    startSearchTime: zoneDayRange(-match.days).start,
    endSearchTime: zoneDayRange(0).end,
  }
}

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
