import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { paymentOrderRecord, type PaymentOrderRecord } from '../api/deposit'
import { rechargeDateRanges, searchWindow } from '../api/rechargeRecord'
import { showToast } from '../toast'
import { useHomeStore } from './home'
import { setSiteTimeZone } from '../utils/timeZone'

const PAGE_SIZE = 10

export const useRechargeRecordStore = defineStore('rechargeRecord', () => {
  const dateRange = ref(rechargeDateRanges[0].key)
  const records = ref<PaymentOrderRecord[]>([])
  const page = ref(1)
  const pages = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
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
      const resp = await paymentOrderRecord(
        {
          size: PAGE_SIZE,
          current: next,
          ...searchWindow(dateRange.value),
        },
        !reset,
      )
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

  function selectDate(key: string) {
    dateRange.value = key
    void load(true)
  }

  return {
    dateRange,
    records,
    loading,
    loadingMore,
    totalAmountCents,
    hasMore,
    load,
    selectDate,
  }
})
