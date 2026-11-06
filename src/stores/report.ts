import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  BET_PAGE_SIZE,
  betPageOf,
  betRecordQuery,
  productOrderRecord,
  reportApi,
  type BetRecord,
  type ReportTab,
} from '../api/report'
import type { ProductPlatform } from '../api/home'
import { showToast } from '../toast'
import { useHomeStore } from './home'
import { setSiteTimeZone } from '../utils/timeZone'

export const useReportStore = defineStore('report', () => {
  const tabs = ref<ReportTab[]>([])
  const active = ref('')
  /** tab key -> filter key -> option key, seeded with each filter's first option. */
  const picks = ref<Record<string, Record<string, string>>>({})
  const records = ref<BetRecord[]>([])
  const page = ref(1)
  const pages = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
  const loaded = ref(false)

  /** Guards against a slow fetch landing after the user moved on. */
  let generation = 0

  const activeTab = computed(() => tabs.value.find((tab) => tab.key === active.value) ?? null)

  const activePicks = computed(() => picks.value[active.value] ?? {})

  const hasMore = computed(() => active.value === 'bet' && page.value < pages.value)

  const platformOptions = computed(() => {
    const home = useHomeStore()
    const seen = new Set<string>()
    const options = [{ key: '', label: 'Todas Plataformas' }]
    for (const platform of home.platforms) {
      const key = platformIdOf(platform)
      if (!key || seen.has(key)) continue
      seen.add(key)
      options.push({ key, label: platform.platformName || key })
    }
    return options
  })

  function applyPage(rows: BetRecord[], current: number | null, reportedPages: number | null, requested: number) {
    page.value = current || requested
    const reported = Math.max(1, reportedPages || 1)
    pages.value = rows.length < BET_PAGE_SIZE ? page.value : Math.max(page.value, reported)
  }

  async function fetchBetPage(current: number, silent = false) {
    const home = useHomeStore()
    await home.loadCatalog()
    setSiteTimeZone(home.layout?.timeZone)
    const picksForTab = picks.value.bet ?? {}
    const resp = await productOrderRecord(
      betRecordQuery(picksForTab.date || 'today', picksForTab.platform || '', current),
      silent,
    )
    return betPageOf(resp.data)
  }

  async function fetchRecords() {
    const ticket = ++generation
    const tab = active.value
    loading.value = true
    records.value = []
    page.value = 1
    pages.value = 1
    try {
      if (tab !== 'bet') {
        await reportApi.getRecords(tab, activePicks.value)
        if (ticket !== generation) return
        records.value = []
        return
      }
      const result = await fetchBetPage(1)
      if (ticket !== generation) return
      records.value = result.rows
      applyPage(result.rows, result.current, result.pages, 1)
    } catch (error) {
      if (ticket !== generation) return
      records.value = []
      showToast(error instanceof Error ? error.message : String(error), 'error')
    } finally {
      if (ticket === generation) loading.value = false
    }
  }

  async function loadMore() {
    if (active.value !== 'bet' || loading.value || loadingMore.value || page.value >= pages.value) return
    const ticket = generation
    const next = page.value + 1
    loadingMore.value = true
    try {
      const result = await fetchBetPage(next, true)
      if (ticket !== generation) return
      records.value = records.value.concat(result.rows)
      applyPage(result.rows, result.current, result.pages, next)
    } catch (error) {
      if (ticket !== generation) return
      showToast(error instanceof Error ? error.message : String(error), 'error')
    } finally {
      if (ticket === generation) loadingMore.value = false
    }
  }

  let task: Promise<void> | null = null

  function load(force = false) {
    if (task) return task
    if (loaded.value && !force) return Promise.resolve()
    task = (async () => {
      const home = useHomeStore()
      const catalog = home.loadCatalog()
      if (loaded.value) {
        await catalog
        await fetchRecords()
        return
      }
      tabs.value = await reportApi.getTabs()
      picks.value = Object.fromEntries(
        tabs.value.map((tab) => [
          tab.key,
          Object.fromEntries(tab.filters.map((filter) => [filter.key, filter.options[0].key])),
        ]),
      )
      active.value = tabs.value[0]?.key ?? ''
      loaded.value = true
      await catalog
      await fetchRecords()
    })().finally(() => {
      task = null
    })
    return task
  }

  function selectTab(key: string) {
    if (key === active.value) return
    active.value = key
    void fetchRecords()
  }

  function selectFilter(filterKey: string, optionKey: string) {
    const current = picks.value[active.value]
    if (!current || current[filterKey] === optionKey) return
    current[filterKey] = optionKey
    void fetchRecords()
  }

  return {
    tabs,
    active,
    picks,
    records,
    loading,
    loadingMore,
    loaded,
    hasMore,
    activeTab,
    activePicks,
    platformOptions,
    load,
    loadMore,
    selectTab,
    selectFilter,
  }
})

function platformIdOf(platform: ProductPlatform) {
  return String(platform.id)
}
