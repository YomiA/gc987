import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Router } from 'vue-router'
import { cashOutPasswordSet, getUserInfo, type UserInfo } from '../api/user'
import { showToast } from '../toast'

export const useUserStore = defineStore('user', () => {
  const info = ref<UserInfo | null>(null)
  const fundTipsOpen = ref(false)
  let checking = false

  async function loadUserInfo() {
    const resp = await getUserInfo()
    info.value = resp.data ?? null
    return info.value
  }

  /** Tab-bar and profile Saque. Always asks /selfInfo, then either opens the withdraw page or the set-password prompt. */
  async function openWithdraw(router: Router) {
    if (checking) return
    checking = true
    try {
      const current = await loadUserInfo()
      if (cashOutPasswordSet(current)) {
        fundTipsOpen.value = false
        await router.push('/main/withdraw')
        return
      }
      fundTipsOpen.value = true
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    } finally {
      checking = false
    }
  }

  function closeFundTips() {
    fundTipsOpen.value = false
  }

  function reset() {
    info.value = null
    fundTipsOpen.value = false
  }

  return { info, fundTipsOpen, loadUserInfo, openWithdraw, closeFundTips, reset }
})
