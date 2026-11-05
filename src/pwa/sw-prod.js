/* Production service worker. Each build stamps BUILD_ID so the browser sees a new worker.
   Pools stay separate: a CSS/JS deploy does not wipe images or API data. */

const BUILD_ID = '__BUILD_ID__'

const POOLS = {
  static: { name: 'static-chunks', maxEntries: 200, maxAge: 30 * 24 * 60 * 60, strategy: 'cache-first' },
  image: { name: 'image-cache', maxEntries: 100, maxAge: 30 * 24 * 60 * 60, strategy: 'stale' },
  font: { name: 'font-cache', maxEntries: 20, maxAge: 365 * 24 * 60 * 60, strategy: 'cache-first' },
  api: { name: 'api-cache', maxEntries: 50, maxAge: 5 * 60, strategy: 'network-first', timeout: 10000 },
  page: { name: 'pages-cache', maxEntries: 10, maxAge: 24 * 60 * 60, strategy: 'network-first', timeout: 3000 },
}

const POOL_NAMES = new Set(Object.keys(POOLS).map((key) => POOLS[key].name))

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const response = await fetch('/index.html', { cache: 'reload' })
        if (response && response.ok) {
          const cache = await caches.open(POOLS.page.name)
          await writeLimited(cache, new Request('/index.html'), response, POOLS.page)
        }
      } catch {
        /* shell is filled on the next successful navigation */
      }
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.filter((key) => !POOL_NAMES.has(key)).map((key) => caches.delete(key)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  let url
  try {
    url = new URL(request.url)
  } catch {
    return
  }
  const pool = pickPool(request, url)
  if (!pool) return
  event.respondWith(route(event, request, pool))
})

function pickPool(request, url) {
  const path = url.pathname
  if (url.origin === self.location.origin && path.startsWith('/api/')) return POOLS.api
  if (url.origin === self.location.origin && /\/assets\/.+\.(?:js|css)$/.test(path)) return POOLS.static
  if (request.destination === 'font' || /\.(?:woff2?|ttf|otf|eot)$/i.test(path)) return POOLS.font
  if (
    request.destination === 'image' ||
    /\.(?:png|jpe?g|gif|svg|webp|avif|ico)$/i.test(path)
  ) {
    return POOLS.image
  }
  if (request.mode === 'navigate' && url.origin === self.location.origin) return POOLS.page
  return null
}

async function route(event, request, pool) {
  if (pool.strategy === 'cache-first') return cacheFirst(request, pool)
  if (pool.strategy === 'stale') return staleWhileRevalidate(event, request, pool)
  return networkFirst(request, pool)
}

async function cacheFirst(request, pool) {
  const cache = await caches.open(pool.name)
  const cached = await readFresh(cache, request, pool.maxAge)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (canStore(response)) await writeLimited(cache, request, response.clone(), pool)
    return response
  } catch {
    return new Response('', { status: 504, statusText: 'Offline' })
  }
}

async function staleWhileRevalidate(event, request, pool) {
  const cache = await caches.open(pool.name)
  const cached = await readFresh(cache, request, pool.maxAge)
  const refresh = fetch(request)
    .then(async (response) => {
      if (canStore(response)) await writeLimited(cache, request, response.clone(), pool)
      return response
    })
    .catch(() => cached)
  if (cached) {
    event.waitUntil(refresh.then(() => undefined))
    return cached
  }
  const response = await refresh
  return response || new Response('', { status: 504, statusText: 'Offline' })
}

async function networkFirst(request, pool) {
  const cache = await caches.open(pool.name)
  try {
    const response = await fetchTimeout(request, pool.timeout)
    if (canStore(response)) await writeLimited(cache, request, response.clone(), pool)
    if (response) return response
  } catch {
    /* use the pool below */
  }
  const cached = await readFresh(cache, request, pool.maxAge)
  if (cached) return cached
  if (request.mode === 'navigate') {
    const shell = await cache.match('/index.html')
    if (shell) return shell
  }
  return new Response('', { status: 504, statusText: 'Offline' })
}

function fetchTimeout(request, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(request, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

function canStore(response) {
  return !!response && (response.ok || response.type === 'opaque')
}

async function readFresh(cache, request, maxAge) {
  const cached = await cache.match(request)
  if (!cached) return null
  if (cached.type === 'opaque') return cached
  const at = Number(cached.headers.get('x-cached-at') || 0)
  if (!at || Date.now() - at > maxAge * 1000) {
    await cache.delete(request)
    return null
  }
  return cached
}

async function writeLimited(cache, request, response, pool) {
  try {
    if (response.type === 'opaque') {
      await cache.put(request, response)
    } else {
      const headers = new Headers(response.headers)
      headers.delete('content-encoding')
      headers.delete('content-length')
      headers.set('x-cached-at', String(Date.now()))
      headers.set('x-sw-build', BUILD_ID)
      const body = await response.blob()
      await cache.put(
        request,
        new Response(body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        }),
      )
    }
    const keys = await cache.keys()
    while (keys.length > pool.maxEntries) {
      const oldest = keys.shift()
      if (oldest) await cache.delete(oldest)
    }
  } catch {
    /* a failed write must not break the response the page is waiting on */
  }
}

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
        event.oldSubscription ? event.oldSubscription.options : { userVisibleOnly: true },
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
        } catch {
          /* the open page syncs again with the login token */
        }
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
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
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
