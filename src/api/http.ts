import { accessToken, authUser, clearSession, refreshToken, setSession } from '../auth/session'
import { acceptLanguage, i18n } from '../i18n'

const BASE = import.meta.env.VITE_API_BASE_URL || '/api'

interface ApiEnvelope<T> {
  code?: number | string
  msg?: string
  message?: string
  data?: T
}

export class ApiError extends Error {
  code: number
  constructor(message: string, code: number) {
    super(message)
    this.code = code
  }
}

interface RequestOptions {
  method?: string
  body?: unknown
  /** Skip the access token. Login uses this. */
  auth?: boolean
  /** A 401 throws, but does not clear the session or open login. */
  keepSession?: boolean
  /** Internal: a 401 has already tried to refresh once. */
  retry?: boolean
}

let refreshing: Promise<boolean> | null = null

function messageOf(data: ApiEnvelope<unknown>, fallback: string) {
  return data.msg || data.message || fallback
}

function tr(key: string) {
  return String(i18n.global.t(key))
}

function baseHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    Accept: 'application/json',
    'Accept-Language': acceptLanguage(),
    ...extra,
  }
}

/**
 * Exchange the refresh token for a new pair. One refresh is shared by every
 * request that fails at the same time. A failed refresh clears the session.
 */
function refreshOnce(): Promise<boolean> {
  if (!refreshing) {
    refreshing = exchangeRefreshToken().finally(() => {
      refreshing = null
    })
  }
  return refreshing
}

async function exchangeRefreshToken(): Promise<boolean> {
  const current = refreshToken.value
  if (!current) return false
  try {
    const resp = await fetch(`${BASE}/refreshToken`, {
      method: 'POST',
      headers: baseHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${current}`,
      }),
      credentials: 'same-origin',
      body: JSON.stringify({ refreshToken: current }),
    })
    const data = (await resp.json().catch(() => ({}))) as ApiEnvelope<{
      token?: string
      refreshToken?: string
      userId?: number
    }>
    const code = Number(data.code ?? resp.status)
    const nextToken = data.data?.token || ''
    if (code !== 200 || !nextToken) return false
    setSession({
      token: nextToken,
      refreshToken: data.data?.refreshToken || current,
      userId: data.data?.userId ?? authUser.value?.userId ?? 0,
      account: authUser.value?.account ?? '',
    })
    return true
  } catch {
    return false
  }
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = baseHeaders()
  if (options.auth !== false && accessToken.value) {
    headers.Authorization = `Bearer ${accessToken.value}`
  }
  const init: RequestInit = {
    method: options.method || 'GET',
    headers,
    credentials: 'same-origin',
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
    init.body = JSON.stringify(options.body)
  }

  const resp = await fetch(`${BASE}${path}`, init)
  const data = (await resp.json().catch(() => ({}))) as ApiEnvelope<T>
  const code = Number(data.code ?? (resp.ok ? 200 : resp.status))

  if ((resp.status === 401 || code === 401) && options.keepSession) {
    throw new ApiError(messageOf(data, tr('login.expired')), 401)
  }

  if ((resp.status === 401 || code === 401) && options.auth !== false && !options.retry) {
    const renewed = await refreshOnce()
    if (renewed) return request<T>(path, { ...options, retry: true })
    clearSession()
    throw new ApiError(messageOf(data, tr('login.expired')), 401)
  }

  if (!Number.isFinite(code) || code !== 200) {
    throw new ApiError(messageOf(data, tr('login.requestFailed')), Number.isFinite(code) ? code : 500)
  }
  return data as T
}
