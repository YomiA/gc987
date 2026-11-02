import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  withdrawAuditFilters,
  withdrawDateRanges,
  withdrawRecordApi,
  type WithdrawSubTab,
} from '../api/withdrawRecord'

export const useWithdrawRecordStore = defineStore('withdrawRecord', () => {
  const tab = ref<WithdrawSubTab>('saques')
  const dateRange = ref(withdrawDateRanges[0].key)
  const auditFilter = ref(withdrawAuditFilters[0].key)
  const saquesTotalCents = ref(0)
  const auditAmountCents = ref(0)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    const [saques, audit] = await Promise.all([
      withdrawRecordApi.getSaquesTotal(),
      withdrawRecordApi.getAuditAmount(),
    ])
    saquesTotalCents.value = saques
    auditAmountCents.value = audit
    loaded.value = true
  }

  function selectTab(next: WithdrawSubTab) {
    tab.value = next
  }

  function selectDate(key: string) {
    dateRange.value = key
  }

  function selectAudit(key: string) {
    auditFilter.value = key
  }

  return {
    tab,
    dateRange,
    auditFilter,
    saquesTotalCents,
    auditAmountCents,
    loaded,
    load,
    selectTab,
    selectDate,
    selectAudit,
  }
})
