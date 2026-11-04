/**
 * Copy and date pills for the deposit record sheet.
 * The list itself comes from POST /paymentOrderRecord.
 */
import { zoneDayRange } from '../utils/timeZone'

export const rechargeRecordCopy = {
  title: 'Registro de Depósito',
  totalLabel: 'Depósito Total:',
  empty: 'Sem Registros',
  name: 'Depósito',
  copied: 'Cópia Bem-sucedida',
}

export const rechargeDateRanges = [
  { key: 'today', label: 'Hoje', days: 0 },
  { key: 'last3', label: 'Últimos 3 Dias', days: 2 },
  { key: 'last5', label: 'Últimos 5 Dias', days: 4 },
  { key: 'last7', label: 'Últimos 7 Dias', days: 6 },
]

export const rechargeStatusText: Record<number, { label: string; color: string }> = {
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
  const match = rechargeDateRanges.find((item) => item.key === key) ?? rechargeDateRanges[0]
  return {
    startSearchTime: zoneDayRange(-match.days).start,
    endSearchTime: zoneDayRange(0).end,
  }
}
