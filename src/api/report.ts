/**
 * Fake backend for /user/report (Perfil -> Relatórios). Nothing leaves the app.
 *
 * Tab order, wrapper flavour, filter sets, option labels and the footer rows are
 * the values read off https://gc987.com/user/report at 390x844x3 while signed
 * in; see docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 *
 * The live account has no rows in any range, so `getRecords` answers empty for
 * every tab and the page paints the "Sem Registros" state the original does.
 * Footer money is in cents like the live API sends it, and `formatAmount` from
 * ./promo does the pt-BR grouping.
 */

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
      { key: 'type', options: betTypeOptions },
      { key: 'platform', options: platformOptions },
      { key: 'game', options: gameOptions },
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

export const reportApi = {
  getTabs: () => settle(tabs),
  /** Every range of this account is empty on the live site. */
  getRecords: (_tab: string, _filters: Record<string, string>) => settle<ReportRecord[]>([], 200),
}
