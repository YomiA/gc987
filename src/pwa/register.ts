import { refreshPushSubscription, silentSubscribeAfterAuth } from '../composables/usePushNotification'

export function registerAppServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  navigator.serviceWorker.register('/sw.js').catch(() => {})
  navigator.serviceWorker.getRegistration().then((reg) => {
    reg?.update().catch(() => {})
  })
  navigator.serviceWorker.addEventListener('message', (event) => {
    const data = event.data as { type?: string; url?: string } | null
    if (data?.type === 'PUSH_NOTIFICATION_CLICK' && data.url) {
      window.dispatchEvent(new CustomEvent('push:navigate', { detail: { url: data.url } }))
    }
    if (data?.type === 'PUSH_SUBSCRIPTION_CHANGE') {
      void silentSubscribeAfterAuth()
    }
  })
  refreshPushSubscription()
}
