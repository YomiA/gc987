import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { login as loginRequest, register as registerRequest } from '../api/auth'
import { accessToken, authUser, clearSession, refreshToken, setSession } from '../auth/session'
import { silentSubscribeAfterAuth } from '../composables/usePushNotification'
import { i18n } from '../i18n'
import {
  clearInviteOnLogout,
  putInviteOnUrl,
  readInviteCode,
  rememberInvite,
  stickyInvite,
  stripInviteFromUrl,
} from '../utils/inviteCode'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = computed(() => !!accessToken.value)
  const dialogOpen = ref(false)
  const dialogMode = ref<'login' | 'register'>('login')

  function openLogin() {
    dialogMode.value = 'login'
    dialogOpen.value = true
  }

  function openRegister() {
    dialogMode.value = 'register'
    dialogOpen.value = true
  }

  function setDialogMode(mode: 'login' | 'register') {
    dialogMode.value = mode
  }

  function closeDialog() {
    dialogOpen.value = false
  }

  async function login(account: string, password: string) {
    const resp = await loginRequest(account, password)
    const data = resp.data
    if (!data?.token || !data.refreshToken || data.userId == null) {
      throw new Error(resp.msg || resp.message || String(i18n.global.t('login.failed')))
    }
    setSession({
      token: data.token,
      refreshToken: data.refreshToken,
      userId: data.userId,
      account,
    })
    void silentSubscribeAfterAuth()
  }

  async function register(account: string, password: string) {
    const inviteCode = readInviteCode()
    const resp = await registerRequest(account, password)
    const data = resp.data
    if (data?.token && data.refreshToken && data.userId != null) {
      setSession({
        token: data.token,
        refreshToken: data.refreshToken,
        userId: data.userId,
        account,
      })
      void silentSubscribeAfterAuth()
    } else {
      await login(account, password)
    }
    if (inviteCode) {
      rememberInvite(inviteCode)
      await putInviteOnUrl(inviteCode)
    }
  }

  function logout() {
    const code = stickyInvite()
    clearInviteOnLogout()
    clearSession()
    if (code) void stripInviteFromUrl(code)
  }

  return {
    accessToken,
    refreshToken,
    authUser,
    isLoggedIn,
    dialogOpen,
    dialogMode,
    openLogin,
    openRegister,
    setDialogMode,
    closeDialog,
    login,
    logout,
    register,
  }
})
