/* Dev service worker: push only. No fetch cache, so Vite updates stay live. */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', (event) => {
  const showNotif = async () => {
    try {
      let payload = {}
      if (event.data) {
        try {
          payload = event.data.json()
        } catch {
          payload = { title: '新消息', body: event.data.text() }
        }
      }
      const title = payload.title || '通知'
      await self.registration.showNotification(title, {
        body: payload.body || '',
        icon: payload.icon || '/images/brand/ICON.png',
        tag: payload.tag || 'push-' + Date.now(),
        data: {
          url: payload.url || payload.route || '/',
          timestamp: Date.now(),
        },
      })
    } catch {
      await self.registration.showNotification('通知', {
        body: '您有一条新消息',
        icon: '/images/brand/ICON.png',
        tag: 'fallback-' + Date.now(),
      })
    }
  }
  event.waitUntil(showNotif())
})

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager
      .subscribe(
        event.oldSubscription
          ? event.oldSubscription.options
          : { userVisibleOnly: true },
      )
      .then(async (newSub) => {
        const subJson = newSub.toJSON()
        try {
          await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              endpoint: subJson.endpoint || '',
              p256dh: (subJson.keys && subJson.keys.p256dh) || '',
              auth: (subJson.keys && subJson.keys.auth) || '',
            }),
          })
        } catch {}
        const clients = await self.clients.matchAll({ type: 'window' })
        clients.forEach((client) => {
          client.postMessage({
            type: 'PUSH_SUBSCRIPTION_CHANGE',
            subscription: subJson,
          })
        })
      })
      .catch(() => {}),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.focus()
            client.postMessage({ type: 'PUSH_NOTIFICATION_CLICK', url })
            return
          }
        }
        if (self.clients.openWindow) return self.clients.openWindow(url)
      }),
  )
})
