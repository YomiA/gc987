import { ref } from 'vue'
import { defineStore } from 'pinia'
import { rechargeDateRanges, rechargeRecordApi } from '../api/rechargeRecord'

export const useRechargeRecordStore = defineStore('rechargeRecord', () => {
  const dateRange = ref(rechargeDateRanges[0].key)
  const totalAmountCents = ref(0)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    const summary = await rechargeRecordApi.getSummary()
    totalAmountCents.value = summary.totalAmountCents
    loaded.value = true
  }

  function selectDate(key: string) {
    dateRange.value = key
  }

  return {
    dateRange,
    totalAmountCents,
    loaded,
    load,
    selectDate,
  }
})
