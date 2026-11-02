/**
 * Fake backend for /rechargeRecord (Depósito header record icon).
 * Live pay.recordList returned { recordList: [], total: 0, totalAmount: null }.
 */

export const rechargeRecordCopy = {
  title: 'Registro de Depósito',
  totalLabel: 'Depósito Total:',
  empty: 'Sem Registros',
}

export const rechargeDateRanges = [
  { key: 'today', label: 'Hoje' },
  { key: 'last3', label: 'Últimos 3 Dias' },
  { key: 'last5', label: 'Últimos 5 Dias' },
  { key: 'last7', label: 'Últimos 7 Dias' },
]

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const rechargeRecordApi = {
  getSummary: () => settle({ totalAmountCents: 0 }),
}
