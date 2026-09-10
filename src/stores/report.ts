import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { reportApi, type ReportRecord, type ReportTab } from '../api/report'

export const useReportStore = defineStore('report', () => {
  const tabs = ref<ReportTab[]>([])
  const active = ref('')
  /** tab key -> filter key -> option key, seeded with each filter's first option. */
  const picks = ref<Record<string, Record<string, string>>>({})
  const records = ref<ReportRecord[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  /** Guards against a slow fetch landing after the user moved on. */
  let request = 0

  const activeTab = computed(() => tabs.value.find((tab) => tab.key === active.value) ?? null)

  const activePicks = computed(() => picks.value[active.value] ?? {})

  async function fetchRecords() {
    const ticket = ++request
    loading.value = true
    const rows = await reportApi.getRecords(active.value, activePicks.value)
    if (ticket !== request) return
    records.value = rows
    loading.value = false
  }

  async function load() {
    if (loaded.value) return
    tabs.value = await reportApi.getTabs()
    picks.value = Object.fromEntries(
      tabs.value.map((tab) => [
        tab.key,
        Object.fromEntries(tab.filters.map((filter) => [filter.key, filter.options[0].key])),
      ]),
    )
    active.value = tabs.value[0]?.key ?? ''
    loaded.value = true
    await fetchRecords()
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
    loaded,
    activeTab,
    activePicks,
    load,
    selectTab,
    selectFilter,
  }
})
