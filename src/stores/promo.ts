import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  claimVipRewards,
  loadActivityEvents,
  loadVipBoard,
  promoApi,
  promoTabList,
  vipStaticCopy,
  type PromoEvent,
  type PromoTab,
  type RebateCategory,
  type RebateRow,
  type VipLevel,
} from '../api/promo'
import { showToast } from '../toast'
import { selfInfoAmount } from '../api/user'
import { useUserStore } from './user'

/** The five sub-tabs of the VIP panel, in live order. */
export const vipSubTabs = [
  { key: 'bonus', label: 'Bônus' },
  { key: 'daily', label: 'Bônus Diário' },
  { key: 'weekly', label: 'Bônus Semanal' },
  { key: 'monthly', label: 'Bônus Mensal' },
  { key: 'retention', label: 'Instruções para manter o nível' },
]

export const usePromoStore = defineStore('promo', () => {
  const tabs = ref<PromoTab[]>(promoTabList())
  const events = ref<PromoEvent[]>([])
  const activeTab = ref('eventos')
  const loaded = ref(false)

  const rebateCategories = ref<RebateCategory[]>([])
  const rebateRows = ref<RebateRow[]>([])
  const rebateReceivable = ref(0)
  const rebateCategory = ref('ELECTRONIC')

  const vipLevels = ref<VipLevel[]>([])
  const vipInfo = ref({
    level: 0,
    nextLevel: 1,
    remainingBet: 0,
    progressBet: 0,
    progressTarget: 0,
    progressRecharge: 0,
    rechargeTarget: 0,
    icon: '',
    rewardStatus: 0,
  })
  const vipRules = ref<string[]>([])
  const vipRetentionRules = ref<string[]>([])
  const vipSubTab = ref('bonus')

  /** A slow response from an earlier visit must not replace the latest one. */
  const generation: Record<string, number> = {}

  function toastError(error: unknown) {
    showToast(error instanceof Error ? error.message : String(error), 'error')
  }

  function loadTab(key: string) {
    const token = (generation[key] = (generation[key] ?? 0) + 1)
    if (key === 'eventos') return loadEvents(token)
    if (key === 'rebate') return loadRebate(token)
    if (key === 'vip') return loadVip(token)
    return Promise.resolve()
  }

  async function loadEvents(token: number) {
    try {
      const value = await loadActivityEvents()
      if (generation.eventos !== token) return
      events.value = value
    } catch (error) {
      if (generation.eventos !== token) return
      events.value = []
      toastError(error)
    }
  }

  async function loadRebate(token: number) {
    const rebate = await promoApi.getRebate()
    if (generation.rebate !== token) return
    rebateCategories.value = rebate.categories
    rebateRows.value = rebate.rows
    rebateReceivable.value = rebate.receivable
    rebateCategory.value = rebate.activeCategory
  }

  async function loadVip(token: number) {
    const copy = vipStaticCopy()
    vipRules.value = copy.rules
    vipRetentionRules.value = copy.retentionRules
    const user = useUserStore()
    try {
      await user.loadUserInfo()
    } catch {
      // The list still loads. Already-have stays 0 until /selfInfo succeeds.
    }
    if (generation.vip !== token) return
    try {
      const info = user.info
      const board = await loadVipBoard(
        selfInfoAmount(info?.orderAmt),
        selfInfoAmount(info?.rechargeAmt),
        selfInfoAmount(info?.upgradeOrderAmt),
        selfInfoAmount(info?.upgradeRechargeAmt),
      )
      if (generation.vip !== token) return
      vipLevels.value = board.levels
      vipInfo.value = board.info
    } catch (error) {
      if (generation.vip !== token) return
      vipLevels.value = []
      toastError(error)
    }
  }

  async function claimVipAll() {
    if (vipInfo.value.rewardStatus !== 1) return
    try {
      await claimVipRewards()
      await loadTab('vip')
    } catch (error) {
      toastError(error)
    }
  }

  /** Refresh whichever promo tab is open. Other tabs wait until they are selected. */
  function load() {
    loaded.value = true
    return loadTab(activeTab.value)
  }

  function selectTab(key: string) {
    activeTab.value = key
    void loadTab(key)
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
    loadTab,
    selectTab,
    selectRebateCategory,
    selectVipSubTab,
    claimVipAll,
  }
})
