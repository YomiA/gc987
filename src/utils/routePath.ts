import type { Router } from 'vue-router'

const CATCH_ALL = '/:pathMatch(.*)*'

/**
 * Follow a backend `routePath`.
 * `https://…` and bare domains (`www.a.com`) open in a new window.
 * `/path` goes through the router, but only when this site has that route;
 * an unknown path would otherwise fall into the catch-all and land on home.
 * Returns whether anything was opened.
 */
export function openRoutePath(router: Router, value?: string | null): boolean {
  const path = String(value ?? '').trim()
  if (!path) return false
  if (/^https?:\/\//i.test(path) || (!path.startsWith('/') && path.includes('.'))) {
    const url = /^https?:\/\//i.test(path) ? path : `https://${path}`
    window.open(url, '_blank', 'noopener')
    return true
  }
  if (!path.startsWith('/')) return false
  const target = router.resolve(path)
  if (!target.matched.length || target.matched.some((record) => record.path === CATCH_ALL)) {
    return false
  }
  void router.push(path)
  return true
}
