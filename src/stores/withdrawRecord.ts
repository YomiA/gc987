import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { cashOutOrderRecord, type CashOutOrderRecord } from '../api/withdraw'
import {
  searchWindow,
  withdrawAuditFilters,
  withdrawDateRanges,
  withdrawRecordApi,
  type WithdrawSubTab,
} from '../api/withdrawRecord'
import { showToast } from '../toast'
import { setSiteTimeZone } from '../utils/timeZone'
import { useHomeStore } from './home'

const PAGE_SIZE = 20

export const useWithdrawRecordStore = defineStore('withdrawRecord', () => {
  const tab = ref<WithdrawSubTab>('saques')
  const dateRange = ref(withdrawDateRanges[0].key)
  const auditFilter = ref(withdrawAuditFilters[0].key)
  const records = ref<CashOutOrderRecord[]>([])
  const page = ref(1)
  const pages = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
  const auditAmountCents = ref(0)
  let ticket = 0

  const totalAmountCents = computed(() =>
    records.value.reduce((sum, row) => sum + Math.round(Number(row.orderAmt) * 100), 0),
  )
  const hasMore = computed(() => page.value < pages.value)

  async function load(reset = true) {
    if (reset) {
      if (loading.value) return
    } else if (loading.value || loadingMore.value || page.value >= pages.value) {
      return
    }
    const mine = ++ticket
    const next = reset ? 1 : page.value + 1
    if (reset) {
      records.value = []
      page.value = 1
      pages.value = 1
      loading.value = true
    } else {
      loadingMore.value = true
    }
    try {
      const home = useHomeStore()
      await home.load().catch(() => undefined)
      setSiteTimeZone(home.layout?.timeZone)
      const resp = await cashOutOrderRecord({
        size: PAGE_SIZE,
        current: next,
        ...searchWindow(dateRange.value),
      })
      if (mine !== ticket) return
      const data = resp.data
      const rows = Array.isArray(data?.records) ? data.records : []
      records.value = reset ? rows : records.value.concat(rows)
      page.value = Number(data?.current) || next
      const reported = Math.max(1, Number(data?.pages) || 1)
      pages.value = rows.length < PAGE_SIZE ? page.value : Math.max(page.value, reported)
    } catch (error) {
      if (mine !== ticket) return
      showToast(error instanceof Error ? error.message : String(error), 'error')
    } finally {
      if (mine !== ticket) return
      loading.value = false
      loadingMore.value = false
    }
  }

  async function loadAudit() {
    auditAmountCents.value = await withdrawRecordApi.getAuditAmount()
  }

  function selectTab(next: WithdrawSubTab) {
    tab.value = next
  }

  function selectDate(key: string) {
    dateRange.value = key
    void load(true)
  }

  function selectAudit(key: string) {
    auditFilter.value = key
  }

  return {
    tab,
    dateRange,
    auditFilter,
    records,
    loading,
    loadingMore,
    totalAmountCents,
    auditAmountCents,
    hasMore,
    load,
    loadAudit,
    selectTab,
    selectDate,
    selectAudit,
  }
})
