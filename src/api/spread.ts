/**
 * Mock data for /spread (Perfil -> Convidar, "ConvidarCentro").
 *
 * The live page is served from the logged-in agent API. Everything that
 * identifies an account there — member id, inviter id, referral link — is
 * replaced with obviously fake values of the same shape, so the layout (in
 * particular the five-line wrap of the referral link) still matches.
 */

export interface SpreadTab {
  key: string
  label: string
}

export interface SpreadAgentInfo {
  myId: string
  inviterId: string
  collectable: string
  hint: string
}

export interface SpreadSocial {
  key: string
  icon: string
}

export interface SpreadShareInfo {
  link: string
  socials: SpreadSocial[]
}

/** `amber` is the money colour, `white` the plain one. */
export interface SpreadSummaryRow {
  label: string
  value: string
  tone: 'amber' | 'white'
}

export interface SpreadSummaryCard {
  key: string
  title: string
  more: string
  rows: SpreadSummaryRow[]
}

const tabs: SpreadTab[] = [
  { key: 'link', label: 'Link de Convite' },
  { key: 'rede', label: 'Rede de Agentes' },
  { key: 'desempenho', label: 'Desempenho' },
  { key: 'comissao', label: 'Comissão' },
  { key: 'taxa', label: 'Taxa de Bônus do Agente' },
  { key: 'registrar', label: 'Registrar Subordinados' },
]

const agentInfo: SpreadAgentInfo = {
  myId: '1000000001',
  inviterId: '0',
  collectable: '0,00',
  hint: 'O tempo de resolução da comissão é de 4:00-8:00 todos os dias.',
}

const shareInfo: SpreadShareInfo = {
  link: 'https://987qqt.com?ch=00000&ttPixelId=MOCKPIXELID000000000/?pid=1000000001&fromPage=AGENCY_CENTER',
  socials: [
    { key: 'email', icon: 'convidar-email' },
    { key: 'youtube', icon: 'convidar-youtube' },
    { key: 'kwai', icon: 'convidar-kwai' },
    { key: 'x', icon: 'convidar-x' },
    { key: 'whatsapp', icon: 'convidar-whatsapp' },
    { key: 'tiktok', icon: 'convidar-tiktok' },
    { key: 'instagram', icon: 'convidar-instagram' },
    { key: 'telegram', icon: 'convidar-telegram' },
    { key: 'facebook', icon: 'convidar-facebook' },
  ],
}

const summaryCards: SpreadSummaryCard[] = [
  {
    key: 'comissao',
    title: 'Comissão',
    more: 'mais',
    rows: [
      { label: 'Comissão Total', value: '0,00', tone: 'amber' },
      { label: 'Comissão Recebida', value: '0,00', tone: 'amber' },
      { label: 'Última Comissão Recebida', value: '0,00', tone: 'amber' },
    ],
  },
  {
    key: 'desempenho',
    title: 'Desempenho',
    more: 'mais',
    rows: [
      { label: 'Total de Membros da Equipe', value: '(0/0) Pessoa', tone: 'white' },
      { label: 'Subordinados Diretos', value: '(0/0) Pessoa', tone: 'white' },
      { label: 'Outros Membros', value: '(0/0) Pessoa', tone: 'white' },
      { label: 'Rendimento Total', value: '0,00', tone: 'white' },
      { label: 'Desempenho Direto', value: '0,00', tone: 'white' },
      { label: 'Outro Desempenho', value: '0,00', tone: 'white' },
    ],
  },
]

/** One node of the "Rede de Agentes" example tree. */
export interface SpreadNetworkNode {
  badge: string
  avatar: string
  /** Text before the amber figure, e.g. "B1contribui comissão". */
  label: string
  value: string
  valid: string
}

/** The "contribui para A" callouts pinned around the tree. */
export interface SpreadNetworkChip {
  key: 'c1' | 'c2' | 'c3'
  label: string
  value: string
  note: string
}

export interface SpreadNetwork {
  self: {
    avatar: string
    badge: string
    rows: { total: string; label: string; value: string }[]
  }
  chips: SpreadNetworkChip[]
  rowB: SpreadNetworkNode[]
  rowC: SpreadNetworkNode[]
}

const IMG = '/images/spread'

/**
 * Every figure below is the live page's worked example (A/B/C agents), not
 * account data — the live site ships it as static copy.
 */
const network: SpreadNetwork = {
  self: {
    avatar: `${IMG}/manA.png`,
    badge: 'A',
    rows: [
      { total: 'Desempenho total  28500', label: 'Comissão total', value: '225' },
      {
        total: 'Desempenho direto  5500',
        label: 'Retorno de Comissão 3% Comissão Direta',
        value: '165',
      },
      {
        total: 'Outro desempenho  3000',
        label: 'Comissão escalonada 2% outra comissão',
        value: '60',
      },
    ],
  },
  chips: [
    { key: 'c1', label: 'C1contribui paraA', value: ' 20', note: 'De diferenciais2%' },
    { key: 'c3', label: 'C3contribui paraA', value: ' 0', note: 'Sem diferença de nível' },
    { key: 'c2', label: 'C2contribui paraA', value: ' 40', note: 'De diferenciais2%' },
  ],
  rowB: [
    {
      badge: 'B1',
      avatar: `${IMG}/manB1.png`,
      label: 'B1contribui comissão',
      value: '15',
      valid: 'Apostas válidas 500',
    },
    {
      badge: 'B2',
      avatar: `${IMG}/manB2.png`,
      label: 'B2contribui comissão',
      value: '90',
      valid: 'Apostas válidas 3000',
    },
    {
      badge: 'B3',
      avatar: `${IMG}/manB1.png`,
      label: 'B3contribui comissão',
      value: '60',
      valid: 'Apostas válidas 2000',
    },
  ],
  rowC: [
    {
      badge: 'C1',
      avatar: `${IMG}/womanC1.png`,
      label: 'C1contribui comissão',
      value: '10',
      valid: 'Apostas válidas 1000',
    },
    {
      badge: 'C2',
      avatar: `${IMG}/womanC2.png`,
      label: 'C2contribui comissão',
      value: '20',
      valid: 'Apostas válidas 2000',
    },
    {
      badge: 'C3',
      avatar: `${IMG}/womanC1.png`,
      label: 'C3contribui comissão',
      value: '600',
      valid: 'Apostas válidas 20000',
    },
  ],
}

export function getSpreadTabs(): Promise<SpreadTab[]> {
  return Promise.resolve(tabs)
}

export function getSpreadNetwork(): Promise<SpreadNetwork> {
  return Promise.resolve(network)
}

/** Header cell of the "Desempenho" table; `width` is the live ion-col ratio. */
export interface SpreadPerformanceColumn {
  key: string
  label: string
  width: string
}

export interface SpreadPerformanceRow {
  id: string
  members: string
  bet: string
  performance: string
  deposit: string
}

const performanceColumns: SpreadPerformanceColumn[] = [
  { key: 'id', label: 'ID', width: '16.6667%' },
  { key: 'members', label: 'Número de Subordinados', width: '20.8333%' },
  { key: 'bet', label: 'Aposta', width: '20.8333%' },
  { key: 'performance', label: 'Desempenho', width: '20.8333%' },
  { key: 'deposit', label: 'Depósito', width: '20.8333%' },
]

export function getSpreadPerformanceColumns(): Promise<SpreadPerformanceColumn[]> {
  return Promise.resolve(performanceColumns)
}

/** The live account has no downline, so every day comes back empty. */
export function getSpreadPerformance(_date: string, _id: string): Promise<SpreadPerformanceRow[]> {
  return Promise.resolve([])
}

/** Header cell of the "Comissão" table; `width` is the live ion-col ratio. */
export interface SpreadCommissionColumn {
  key: string
  label: string
  width: string
}

export interface SpreadCommissionRow {
  time: string
  type: string
  performance: string
  people: string
  commission: string
}

/** One entry of the game-category filter next to the date range. */
export interface SpreadCommissionType {
  key: string
  label: string
}

const commissionColumns: SpreadCommissionColumn[] = [
  { key: 'time', label: 'Tempos', width: '25%' },
  { key: 'type', label: 'Tipos', width: '12.5%' },
  { key: 'performance', label: 'Desempenho', width: '25%' },
  { key: 'people', label: 'Número de Pessoas', width: '16.6667%' },
  { key: 'commission', label: 'Comissão', width: '20.8333%' },
]

const commissionTypes: SpreadCommissionType[] = [
  { key: 'all', label: 'Todos' },
  { key: 'slot', label: 'Slot' },
  { key: 'cards', label: 'Cartas' },
  { key: 'fishing', label: 'Pesca' },
  { key: 'casino', label: 'Cassino' },
  { key: 'sports', label: 'Esportes' },
  { key: 'lottery', label: 'Lotaria' },
]

export function getSpreadCommissionColumns(): Promise<SpreadCommissionColumn[]> {
  return Promise.resolve(commissionColumns)
}

export function getSpreadCommissionTypes(): Promise<SpreadCommissionType[]> {
  return Promise.resolve(commissionTypes)
}

/** No commission has been settled on this account, so the table stays empty. */
export function getSpreadCommission(
  _start: string,
  _end: string,
  _type: string,
): Promise<SpreadCommissionRow[]> {
  return Promise.resolve([])
}

/** Game category of the "Taxa de Bônus do Agente" sub-segment. */
export interface SpreadRateTab {
  key: string
  label: string
}

export interface SpreadRateRow {
  level: string
  performance: string
  rate: string
}

const rateTabs: SpreadRateTab[] = [
  { key: 'slot', label: 'Slot' },
  { key: 'cards', label: 'Cartas' },
  { key: 'fishing', label: 'Pesca' },
  { key: 'casino', label: 'Cassino' },
]

/** `[desempenho, taxa]`, exactly the static ladder the live page ships. */
const standardLadder: [string, string][] = [
  ['10,00+', '0,10%'],
  ['2.000,00+', '0,20%'],
  ['4.000,00+', '0,30%'],
  ['8.000,00+', '0,40%'],
  ['16.000,00+', '0,50%'],
  ['32.000,00+', '0,60%'],
  ['64.000,00+', '0,70%'],
  ['120.000,00+', '0,80%'],
  ['240.000,00+', '0,90%'],
  ['500.000,00+', '1,00%'],
  ['1.000.000,00+', '1,10%'],
  ['1.500.000,00+', '1,20%'],
  ['2.000.000,00+', '1,30%'],
  ['3.000.000,00+', '1,40%'],
  ['4.000.000,00+', '1,50%'],
  ['5.000.000,00+', '1,60%'],
  ['6.000.000,00+', '1,70%'],
  ['7.000.000,00+', '1,80%'],
  ['8.000.000,00+', '1,90%'],
  ['10.000.000,00+', '2,00%'],
]

const casinoLadder: [string, string][] = [
  ['50.000,00+', '0,05%'],
  ['200.000,00+', '0,10%'],
  ['500.000,00+', '0,15%'],
  ['800.000,00+', '0,20%'],
  ['1.200.000,00+', '0,25%'],
  ['1.600.000,00+', '0,30%'],
  ['2.200.000,00+', '0,35%'],
  ['3.300.000,00+', '0,40%'],
]

const toRows = (ladder: [string, string][]): SpreadRateRow[] =>
  ladder.map(([performance, rate], i) => ({ level: String(i + 1), performance, rate }))

/** Slot, Cartas and Pesca all serve the same 20-step ladder on the live page. */
const rateTables: Record<string, SpreadRateRow[]> = {
  slot: toRows(standardLadder),
  cards: toRows(standardLadder),
  fishing: toRows(standardLadder),
  casino: toRows(casinoLadder),
}

export function getSpreadRateTabs(): Promise<SpreadRateTab[]> {
  return Promise.resolve(rateTabs)
}

export function getSpreadRates(tab: string): Promise<SpreadRateRow[]> {
  return Promise.resolve(rateTables[tab] ?? [])
}

/** Copy and field rules for "Registrar Subordinados". No live account is created. */
export interface SpreadRegisterCopy {
  hint: string
  dial: string
  phonePlaceholder: string
  passwordPlaceholder: string
  confirmPlaceholder: string
  submit: string
  phoneError: string
  passwordError: string
  mismatch: string
  success: string
}

export const spreadRegisterCopy: SpreadRegisterCopy = {
  hint: 'Preencha as informações a seguir para concluir a abertura da conta.',
  dial: '+55',
  phonePlaceholder: 'Telefone',
  passwordPlaceholder: 'Senha',
  confirmPlaceholder: 'Confirmar senha',
  submit: 'Criar',
  phoneError: '*Número de telefone inválido',
  passwordError: '6-16 caracteres',
  mismatch: 'As senhas inseridas duas vezes não correspondem',
  /** Live success toast was not fired (that would hit the real agent API). */
  success: 'Registro realizado com sucesso',
}

export interface SpreadRegisterPayload {
  phone: string
  password: string
}

export function registerSubordinate(_payload: SpreadRegisterPayload): Promise<{ ok: true }> {
  return Promise.resolve({ ok: true })
}

export function getSpreadOverview(): Promise<{
  info: SpreadAgentInfo
  share: SpreadShareInfo
  cards: SpreadSummaryCard[]
}> {
  return Promise.resolve({ info: agentInfo, share: shareInfo, cards: summaryCards })
}
