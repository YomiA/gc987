/**
 * Web Push subscription, same contract as the existing sites:
 * POST {VITE_API_BASE_URL}/subscribe with endpoint, p256dh, auth.
 * userId / tenantCode / Authorization are sent only when a login token exists.
 */

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''

export let lastPushError = ''

function isPushSupported() {
  try {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    )
  } catch {
    return false
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

async function waitForSwReady(timeoutMs = 8000) {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<ServiceWorkerRegistration>((_, reject) => {
      setTimeout(() => reject(new Error('SW ready timeout')), timeoutMs)
    }),
  ])
}

async function sendSubscriptionToServer(subscription: {
  endpoint: string
  p256dh: string
  auth: string
}) {
  const token = localStorage.getItem('auth_token') || ''
  let userId: number | null = null
  let tenantCode: string | null = null
  try {
    const user = JSON.parse(localStorage.getItem('auth_user') || 'null') as {
      userId?: number
      id?: number
      tenantCode?: string
    } | null
    userId = user?.userId ?? user?.id ?? null
    tenantCode = user?.tenantCode ?? null
  } catch {
    userId = null
  }
  const body: Record<string, unknown> = {
    endpoint: subscription.endpoint,
    p256dh: subscription.p256dh,
    auth: subscription.auth,
  }
  if (userId != null) body.userId = userId
  if (tenantCode) body.tenantCode = tenantCode
  const apiBase = import.meta.env.VITE_API_BASE_URL || '/api'
  const resp = await fetch(`${apiBase}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`HTTP ${resp.status}: ${text}`)
  }
}

/** Existing push endpoint when permission is already granted. Does not prompt or create one. */
export async function getEndpointIfGranted(): Promise<string> {
  try {
    if (!isPushSupported()) return ''
    if (!VAPID_PUBLIC_KEY) return ''
    if (Notification.permission !== 'granted') return ''
    const reg = await waitForSwReady()
    const sub = await reg.pushManager.getSubscription()
    return sub?.endpoint || ''
  } catch {
    return ''
  }
}

/** Re-sync the current push subscription. No prompt; permission must already be granted. */
export async function silentSubscribeAfterAuth() {
  lastPushError = ''
  try {
    if (!isPushSupported()) {
      lastPushError = '浏览器不支持推送'
      return false
    }
    if (!VAPID_PUBLIC_KEY) {
      lastPushError = 'VAPID公钥未配置'
      return false
    }
    if (Notification.permission !== 'granted') {
      lastPushError = `通知权限未开启(${Notification.permission})`
      return false
    }
    let registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      registration = await navigator.serviceWorker.register('/sw.js')
    }
    const reg = await waitForSwReady()
    let sub = await reg.pushManager.getSubscription()
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      })
    }
    const json = sub.toJSON()
    await sendSubscriptionToServer({
      endpoint: json.endpoint || '',
      p256dh: json.keys?.p256dh || '',
      auth: json.keys?.auth || '',
    })
    return true
  } catch (error) {
    lastPushError = error instanceof Error ? error.message : String(error)
    return false
  }
}

/** abc.com refreshes the subscription a few seconds after each open. */
export function refreshPushSubscription() {
  window.setTimeout(() => {
    void silentSubscribeAfterAuth()
  }, 5000)
}
