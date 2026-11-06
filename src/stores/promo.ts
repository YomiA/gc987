import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  promoApi,
  type PromoEvent,
  type PromoTab,
  type RebateCategory,
  type RebateRow,
  type VipLevel,
} from '../api/promo'

/** The five sub-tabs of the VIP panel, in live order. */
export const vipSubTabs = [
  { key: 'bonus', label: 'Bônus' },
  { key: 'daily', label: 'Bônus Diário' },
  { key: 'weekly', label: 'Bônus Semanal' },
  { key: 'monthly', label: 'Bônus Mensal' },
  { key: 'retention', label: 'Instruções para manter o nível' },
]

export const usePromoStore = defineStore('promo', () => {
  const tabs = ref<PromoTab[]>([])
  const events = ref<PromoEvent[]>([])
  const activeTab = ref('eventos')
  const loaded = ref(false)

  const rebateCategories = ref<RebateCategory[]>([])
  const rebateRows = ref<RebateRow[]>([])
  const rebateReceivable = ref(0)
  const rebateCategory = ref('ELECTRONIC')

  const vipLevels = ref<VipLevel[]>([])
  const vipInfo = ref({ level: 0, nextLevel: 1, remainingBet: 0, progressBet: 0, progressTarget: 0 })
  const vipRules = ref<string[]>([])
  const vipRetentionRules = ref<string[]>([])
  const vipSubTab = ref('bonus')

  let task: Promise<void> | null = null

  function load(force = false) {
    if (task) return task
    if (loaded.value && !force) return Promise.resolve()
    task = (async () => {
    const [t, e, rebate, vip] = await Promise.all([
      promoApi.getTabs(),
      promoApi.getEvents(),
      promoApi.getRebate(),
      promoApi.getVip(),
    ])
    tabs.value = t
    events.value = e
    rebateCategories.value = rebate.categories
    rebateRows.value = rebate.rows
    rebateReceivable.value = rebate.receivable
    rebateCategory.value = rebate.activeCategory
    vipLevels.value = vip.levels
    vipInfo.value = vip.info
    vipRules.value = vip.rules
    vipRetentionRules.value = vip.retentionRules
    loaded.value = true
    })().finally(() => {
      task = null
    })
    return task
  }

  function selectTab(key: string) {
    activeTab.value = key
  }

  function selectRebateCategory(key: string) {
    rebateCategory.value = key
  }

  function selectVipSubTab(key: string) {
    vipSubTab.value = key
  }

  return {
    tabs,
    events,
    activeTab,
    loaded,
    rebateCategories,
    rebateRows,
    rebateReceivable,
    rebateCategory,
    vipLevels,
    vipInfo,
    vipRules,
    vipRetentionRules,
    vipSubTab,
    load,
    selectTab,
    selectRebateCategory,
    selectVipSubTab,
  }
})
