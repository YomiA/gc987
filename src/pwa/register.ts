import { refreshPushSubscription, silentSubscribeAfterAuth } from '../composables/usePushNotification'
import { serviceWorkerUrl } from './sw-url'

export function registerAppServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  void navigator.serviceWorker
    .getRegistrations()
    .then(async (regs) => {
      await Promise.all(
        regs.map(async (reg) => {
          const script = reg.active?.scriptURL || reg.waiting?.scriptURL || reg.installing?.scriptURL || ''
          if (!script.endsWith(serviceWorkerUrl)) await reg.unregister()
        }),
      )
      await navigator.serviceWorker.register(serviceWorkerUrl)
      const current = await navigator.serviceWorker.getRegistration()
      await current?.update()
    })
    .catch(() => {})
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
