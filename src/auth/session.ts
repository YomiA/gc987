import { ref } from 'vue'

const TOKEN_KEY = 'auth_token'
const REFRESH_KEY = 'auth_refresh_token'
const USER_KEY = 'auth_user'

export interface AuthUser {
  userId: number
  account: string
}

function readUser(): AuthUser | null {
  try {
    const raw = JSON.parse(localStorage.getItem(USER_KEY) || 'null') as AuthUser | null
    if (!raw || typeof raw.userId !== 'number' || !raw.account) return null
    return { userId: raw.userId, account: raw.account }
  } catch {
    return null
  }
}

export const accessToken = ref(localStorage.getItem(TOKEN_KEY) || '')
export const refreshToken = ref(localStorage.getItem(REFRESH_KEY) || '')
export const authUser = ref<AuthUser | null>(readUser())

export function setSession(next: {
  token: string
  refreshToken: string
  userId: number
  account: string
}) {
  accessToken.value = next.token
  refreshToken.value = next.refreshToken
  authUser.value = { userId: next.userId, account: next.account }
  localStorage.setItem(TOKEN_KEY, next.token)
  localStorage.setItem(REFRESH_KEY, next.refreshToken)
  localStorage.setItem(USER_KEY, JSON.stringify(authUser.value))
}

export function clearSession() {
  accessToken.value = ''
  refreshToken.value = ''
  authUser.value = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}
