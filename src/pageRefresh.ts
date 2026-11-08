import type { RouteRecordName } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useEntrarStore } from './stores/entrar'
import { useHomeStore } from './stores/home'
import { useNotificationStore } from './stores/notification'
import { usePerfilStore } from './stores/perfil'
import { usePromoStore } from './stores/promo'
import { useReportStore } from './stores/report'
import { useSpreadStore } from './stores/spread'
import { useUserStore } from './stores/user'
import { useWithdrawStore } from './stores/withdraw'
import { showToast } from './toast'
import { useWithdrawRecordStore } from './stores/withdrawRecord'
import { useWithdrawalAccountStore } from './stores/withdrawalAccount'

/**
 * Browser tab comes back to the foreground. Refresh the page that is open.
 * Game play and the lobby handoff are left alone: those requests enter or leave a game.
 * Deposit records refresh from their own panel, because that list is not always open.
 */
export function refreshCurrentPage(name: RouteRecordName | null | undefined) {
  const key = String(name || '')
  const home = useHomeStore()
  switch (key) {
    case 'inicio':
      return home.reloadVisit()
    case 'promo':
      return usePromoStore().load()
    case 'activity-vip':
      return usePromoStore().loadTab('vip')
    case 'entrar':
      return useEntrarStore().load()
    case 'perfil': {
      const tasks: Promise<unknown>[] = [usePerfilStore().load(true)]
      if (useAuthStore().isLoggedIn) {
        tasks.push(
          useUserStore().loadUserInfo().catch((error: unknown) => {
            showToast(error instanceof Error ? error.message : String(error), 'error')
          }),
        )
      }
      return Promise.all(tasks)
    }
    case 'security':
      return usePerfilStore().load(true)
    case 'user-report':
      return useReportStore().load(true)
    case 'spread':
      return useSpreadStore().load(true)
    case 'notification':
      return useNotificationStore().load(true)
    case 'game-search':
    case 'game-category':
      return home.reloadCatalog()
    case 'withdraw':
    case 'withdraw-apply':
      return useWithdrawStore().load()
    case 'withdrawal-account':
    case 'withdrawal-bind':
      return useWithdrawalAccountStore().load()
    case 'withdraw-sub-view': {
      const records = useWithdrawRecordStore()
      return Promise.all([records.load(true), records.loadAudit()])
    }
    default:
      return Promise.resolve()
  }
}
