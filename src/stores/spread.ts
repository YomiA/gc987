import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  getSpreadCommission,
  getSpreadCommissionColumns,
  getSpreadCommissionTypes,
  getSpreadNetwork,
  getSpreadOverview,
  getSpreadPerformance,
  getSpreadPerformanceColumns,
  getSpreadRates,
  getSpreadRateTabs,
  getSpreadTabs,
  type SpreadAgentInfo,
  type SpreadCommissionColumn,
  type SpreadCommissionRow,
  type SpreadCommissionType,
  type SpreadNetwork,
  type SpreadPerformanceColumn,
  type SpreadPerformanceRow,
  type SpreadRateRow,
  type SpreadRateTab,
  type SpreadShareInfo,
  type SpreadSummaryCard,
  type SpreadTab,
} from '../api/spread'
import { useHomeStore } from './home'
import { setSiteTimeZone, zoneDate } from '../utils/timeZone'

/** Site-zone YYYY-MM-DD, which is what the live date field submits. */
function todayIso() {
  return zoneDate(0)
}

export const useSpreadStore = defineStore('spread', () => {
  const tabs = ref<SpreadTab[]>([])
  const active = ref('link')
  const info = ref<SpreadAgentInfo | null>(null)
  const share = ref<SpreadShareInfo | null>(null)
  const cards = ref<SpreadSummaryCard[]>([])
  const network = ref<SpreadNetwork | null>(null)
  const perfColumns = ref<SpreadPerformanceColumn[]>([])
  const perfRows = ref<SpreadPerformanceRow[]>([])
  const perfDate = ref(todayIso())
  const perfQuery = ref('')
  const commColumns = ref<SpreadCommissionColumn[]>([])
  const commTypes = ref<SpreadCommissionType[]>([])
  const commRows = ref<SpreadCommissionRow[]>([])
  /** The live range opens on today for both ends. */
  const commStart = ref(todayIso())
  const commEnd = ref(todayIso())
  const commType = ref('all')
  const rateTabs = ref<SpreadRateTab[]>([])
  const rateTab = ref('slot')
  const rateRows = ref<SpreadRateRow[]>([])
  const loaded = ref(false)

  const activeTab = computed(() => tabs.value.find((tab) => tab.key === active.value) ?? null)

  async function load() {
    if (loaded.value) return
    const home = useHomeStore()
    await home.load().catch(() => undefined)
    setSiteTimeZone(home.layout?.timeZone)
    const today = todayIso()
    perfDate.value = today
    commStart.value = today
    commEnd.value = today
    const [tabList, overview, net, columns, commCols, types, rates] = await Promise.all([
      getSpreadTabs(),
      getSpreadOverview(),
      getSpreadNetwork(),
      getSpreadPerformanceColumns(),
      getSpreadCommissionColumns(),
      getSpreadCommissionTypes(),
      getSpreadRateTabs(),
    ])
    tabs.value = tabList
    info.value = overview.info
    share.value = overview.share
    cards.value = overview.cards
    network.value = net
    perfColumns.value = columns
    commColumns.value = commCols
    commTypes.value = types
    rateTabs.value = rates
    await Promise.all([loadPerformance(), loadCommission(), loadRates()])
    loaded.value = true
  }

  async function loadPerformance() {
    perfRows.value = await getSpreadPerformance(perfDate.value, perfQuery.value)
  }

  function setPerfDate(date: string) {
    perfDate.value = date
    void loadPerformance()
  }

  function setPerfQuery(query: string) {
    perfQuery.value = query
    void loadPerformance()
  }

  async function loadCommission() {
    commRows.value = await getSpreadCommission(commStart.value, commEnd.value, commType.value)
  }

  /** The live field commits the start first, which collapses the range. */
  function setCommStart(date: string) {
    commStart.value = date
    commEnd.value = date
    void loadCommission()
  }

  function setCommEnd(date: string) {
    commEnd.value = date
    void loadCommission()
  }

  function setCommType(key: string) {
    commType.value = key
    void loadCommission()
  }

  async function loadRates() {
    rateRows.value = await getSpreadRates(rateTab.value)
  }

  function selectRateTab(key: string) {
    rateTab.value = key
    void loadRates()
  }

  function selectTab(key: string) {
    active.value = key
  }

  return {
    tabs,
    active,
    info,
    share,
    cards,
    network,
    perfColumns,
    perfRows,
    perfDate,
    perfQuery,
    commColumns,
    commTypes,
    commRows,
    commStart,
    commEnd,
    commType,
    rateTabs,
    rateTab,
    rateRows,
    loaded,
    activeTab,
    load,
    selectTab,
    setPerfDate,
    setPerfQuery,
    setCommStart,
    setCommEnd,
    setCommType,
    selectRateTab,
  }
})
