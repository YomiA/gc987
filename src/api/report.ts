/**
 * Relatórios. The Recordes de Apostas tab calls the backend; the other tabs
 * still use the empty local answers.
 *
 * Tab order, wrapper flavour, filter sets, option labels and the footer rows are
 * the values read off https://gc987.com/user/report at 390x844x3 while signed
 * in; see docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 *
 * The Recordes de Apostas tab asks POST /productOrderRecord. Its platform
 * choices are the homepage productPlatforms, in that list's order.
 * Other tabs still answer empty until their own APIs are connected.
 */

import { request } from './http'
import { searchWindow } from './rechargeRecord'

export interface ReportOption {
  key: string
  label: string
}

export interface ReportFilter {
  key: string
  options: ReportOption[]
}

/**
 * Which of the two page bodies a tab renders. They differ in the inherited
 * line-height of the filter pills (28 vs 26 tall) and in how tall the empty
 * block is.
 */
export type ReportLayout = 'statement' | 'bet'

export interface ReportSummaryRow {
  key: string
  label: string
  /** Money rows are cents; count rows are already the number. */
  value: number
  format: 'money' | 'count'
  tone: 'plain' | 'green' | 'red' | 'money'
}

export interface ReportSummary {
  /**
   * `statement` prints grey labels and pushes each value down by .625rem;
   * `report` prints white labels with no offset.
   */
  variant: 'statement' | 'report'
  rows: ReportSummaryRow[]
}

export interface ReportTab {
  key: string
  label: string
  layout: ReportLayout
  filters: ReportFilter[]
  summary: ReportSummary | null
}

const dateOptions: ReportOption[] = [
  { key: 'today', label: 'Hoje' },
  { key: 'last3', label: 'Últimos 3 Dias' },
  { key: 'last5', label: 'Últimos 5 Dias' },
  { key: 'last7', label: 'Últimos 7 Dias' },
]

const statementTypeOptions: ReportOption[] = [
  { key: 'all', label: 'Todos Tipos' },
  { key: 'deposit', label: 'Depósito de Membro' },
  { key: 'withdraw', label: 'Saque' },
  { key: 'events', label: 'Eventos' },
  { key: 'transfer', label: 'Troca de fundos' },
  { key: 'vault', label: 'Cofre box' },
  { key: 'commission', label: 'Comissão' },
  { key: 'tasks', label: 'Tarefas' },
]

const betTypeOptions: ReportOption[] = [
  { key: 'all', label: 'Todos Tipos' },
  { key: 'slot', label: 'Slot' },
  { key: 'fishing', label: 'Pesca' },
  { key: 'casino', label: 'Cassino' },
  { key: 'cards', label: 'Cartas' },
]

const platformOptions: ReportOption[] = [{ key: 'all', label: 'Todas Plataformas' }]
const gameOptions: ReportOption[] = [{ key: 'all', label: 'Todos Jogos' }]
const allDetailOptions: ReportOption[] = [{ key: 'all', label: 'Todos Detalhes' }]

const otherDetailOptions: ReportOption[] = [
  { key: 'all', label: 'Todos Detalhes' },
  { key: 'tip', label: 'Gorjeta no Jogo' },
  { key: 'refund', label: 'Reembolsado' },
]

const tabs: ReportTab[] = [
  {
    key: 'statement',
    label: 'Detalhes da Conta',
    layout: 'statement',
    filters: [
      { key: 'date', options: dateOptions },
      { key: 'type', options: statementTypeOptions },
      { key: 'detail', options: allDetailOptions },
    ],
    summary: {
      variant: 'statement',
      rows: [
        { key: 'deposit', label: 'Depósito Total：', value: 0, format: 'money', tone: 'green' },
        { key: 'withdraw', label: 'Retirada Total：', value: 0, format: 'money', tone: 'red' },
        {
          key: 'rebate',
          label: 'Total de Descontos Recebidos：',
          value: 0,
          format: 'money',
          tone: 'money',
        },
      ],
    },
  },
  {
    key: 'bet',
    label: 'Recordes de Apostas',
    layout: 'bet',
    filters: [
      { key: 'date', options: dateOptions },
      { key: 'platform', options: [{ key: '', label: 'Todas Plataformas' }] },
    ],
    summary: null,
  },
  {
    key: 'sport',
    label: 'Aposta Esportiva',
    layout: 'bet',
    filters: [
      { key: 'date', options: dateOptions },
      { key: 'platform', options: platformOptions },
      { key: 'game', options: gameOptions },
    ],
    summary: null,
  },
  {
    key: 'report',
    label: 'Relatório',
    layout: 'bet',
    filters: [
      { key: 'date', options: dateOptions },
      { key: 'type', options: betTypeOptions },
      { key: 'platform', options: platformOptions },
      { key: 'game', options: gameOptions },
    ],
    summary: {
      variant: 'report',
      rows: [
        { key: 'count', label: 'Total de Apostas：', value: 0, format: 'count', tone: 'plain' },
        { key: 'valid', label: 'Aposta válida total：', value: 0, format: 'money', tone: 'plain' },
        { key: 'winloss', label: 'Total de Ganhos/Perdas：', value: 0, format: 'count', tone: 'money' },
      ],
    },
  },
  {
    key: 'others',
    label: 'Outros',
    layout: 'statement',
    filters: [
      { key: 'date', options: dateOptions },
      { key: 'detail', options: otherDetailOptions },
    ],
    summary: null,
  },
]

export interface ReportRecord {
  id: number
}

function settle<T>(value: T, ms = 120): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export interface ProductOrderQuery {
  current: number
  size: number
  startSearchTime: string
  endSearchTime: string
  /** Empty string is every platform. */
  platformId: string
}

/**
 * One row of the original Recordes de Apostas list.
 * Money is reais, the same unit as orderAmt on the other records.
 */
export interface BetRecord {
  id: string
  platformName: string
  /** ELECTRONIC, FISHING, CHESS, VIDEO, SPORTS, LOTTERY. */
  gameType: string
  /** Missing or 0 leaves the amount blank. */
  profitAmount: number | null
  gameName: string
  /** SETTLED, UNSETTLED, SYSTEMCANCEL, MANUALLYCANCEL. */
  status: string
  createTime: string
  roundNo: string
}

export interface BetRecordPage {
  rows: BetRecord[]
  current: number | null
  pages: number | null
}

export const BET_PAGE_SIZE = 20

const GAME_TYPE_LABEL: Record<string, string> = {
  ELECTRONIC: 'Slot',
  FISHING: 'Pesca',
  CHESS: 'Cartas',
  VIDEO: 'Cassino',
  SPORTS: 'Esportes',
  LOTTERY: 'Lotaria',
}

const BET_STATUS: Record<string, { label: string; tone: 'green' | 'white' | 'red' }> = {
  SETTLED: { label: 'Liquidado', tone: 'green' },
  UNSETTLED: { label: 'Não liquidado', tone: 'white' },
  SYSTEMCANCEL: { label: 'Cancelado pelo sistema', tone: 'red' },
  MANUALLYCANCEL: { label: 'Cancelado manualmente', tone: 'red' },
}

export function betGameTypeLabel(code: string) {
  const key = code.trim().toUpperCase()
  return GAME_TYPE_LABEL[key] ?? code.trim()
}

export function betStatusOf(code: string) {
  if (!code) return { label: '', tone: 'white' as const }
  return BET_STATUS[code] ?? { label: code, tone: 'red' as const }
}

function textOf(row: Record<string, unknown>, key: string) {
  const value = row[key]
  if (value == null) return ''
  return String(value)
}

function moneyOf(row: Record<string, unknown>, key: string) {
  const value = row[key]
  if (value == null || value === '') return null
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : null
}

function mapBet(item: unknown, index: number): BetRecord {
  const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}
  const roundNo = textOf(row, 'roundNo')
  const id = textOf(row, 'id') || roundNo || String(index)
  return {
    id,
    platformName: textOf(row, 'platformName'),
    gameType: textOf(row, 'gameType'),
    profitAmount: moneyOf(row, 'profitAmount'),
    gameName: textOf(row, 'gameName'),
    status: textOf(row, 'status'),
    createTime: textOf(row, 'createTime'),
    roundNo,
  }
}

/** A page object, or a bare list. */
export function betPageOf(data: unknown): BetRecordPage {
  let list: unknown[] = []
  let current: number | null = null
  let pages: number | null = null
  if (Array.isArray(data)) {
    list = data
  } else if (data && typeof data === 'object') {
    const bag = data as Record<string, unknown>
    for (const key of ['records', 'list', 'rows', 'gameRecordList']) {
      if (Array.isArray(bag[key])) {
        list = bag[key]
        break
      }
    }
    const reportedCurrent = Number(bag.current)
    const reportedPages = Number(bag.pages)
    if (Number.isFinite(reportedCurrent)) current = reportedCurrent
    if (Number.isFinite(reportedPages)) pages = reportedPages
  }
  return { rows: list.map(mapBet), current, pages }
}

/** Bet records on the Recordes de Apostas tab. The next page stays silent. */
export function productOrderRecord(body: ProductOrderQuery, silent = false) {
  return request<{ code?: number; data?: unknown }>('/productOrderRecord', {
    method: 'POST',
    body,
    silent,
  })
}

export function betRecordQuery(dateKey: string, platformId: string, current = 1): ProductOrderQuery {
  const window = searchWindow(dateKey)
  return {
    current,
    size: BET_PAGE_SIZE,
    startSearchTime: window.startSearchTime,
    endSearchTime: window.endSearchTime,
    platformId,
  }
}

export const reportApi = {
  getTabs: () => settle(tabs),
  /** Every range of this account is empty on the live site. */
  getRecords: (_tab: string, _filters: Record<string, string>) => settle<ReportRecord[]>([], 200),
}
