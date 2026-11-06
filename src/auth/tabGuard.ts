import type { Router } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useHomeStore } from '../stores/home'
import { useUserStore } from '../stores/user'

const LOGIN_TABS = new Set(['deposito', 'saque', 'perfil'])

/** Bottom bar. Deposit, withdraw, and profile ask for login. Promoção does not. */
export function selectMainTab(router: Router, key: string) {
  const auth = useAuthStore()
  if (!auth.isLoggedIn && LOGIN_TABS.has(key)) {
    auth.openLogin()
    return
  }
  if (key === 'inicio') {
    void router.push('/main/inicio')
    return
  }
  if (key === 'promo') {
    void router.push('/main/promo')
    return
  }
  if (key === 'deposito') {
    void router.push('/main/entrar')
    return
  }
  if (key === 'perfil') {
    void router.push('/main/perfil')
    return
  }
  if (key === 'saque') {
    void useUserStore().openWithdraw(router)
    return
  }
  useHomeStore().selectTab(key)
}
