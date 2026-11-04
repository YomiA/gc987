/**
 * Invite code only. Older clients also sent `type` / `inviteType`.
 * The code comes from `inviteCode` or `id` on the URL, then the copy kept
 * after a successful register, then the copy saved for an installed PWA.
 * After register the code stays on the URL until logout.
 */
const STICKY_KEY = 'gc987-sticky-invite'

export function stickyInvite(): string {
  try {
    return localStorage.getItem(STICKY_KEY) || ''
  } catch {
    return ''
  }
}

export function rememberInvite(code: string) {
  try {
    localStorage.setItem(STICKY_KEY, code)
  } catch {
    /* ignore */
  }
}

export function readInviteCode(): string {
  try {
    const current = new URLSearchParams(window.location.search)
    const fromUrl = current.get('inviteCode') || current.get('id') || ''
    if (fromUrl) return fromUrl
    const sticky = stickyInvite()
    if (sticky) return sticky
    const saved = localStorage.getItem('pwa_download_params')
    if (!saved) return ''
    const stored = new URLSearchParams(saved)
    return stored.get('inviteCode') || stored.get('id') || ''
  } catch {
    return ''
  }
}

export function clearInviteOnLogout() {
  try {
    localStorage.removeItem(STICKY_KEY)
    localStorage.removeItem('pwa_download_params')
  } catch {
    /* ignore */
  }
}

function queryValue(value: unknown): string {
  return Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '')
}

export async function putInviteOnUrl(code: string) {
  if (!code) return
  const { router } = await import('../router')
  const route = router.currentRoute.value
  if (queryValue(route.query.inviteCode) === code) return
  await router.replace({
    path: route.path,
    query: { ...route.query, inviteCode: code },
    hash: route.hash,
  })
}

export async function stripInviteFromUrl(code: string) {
  if (!code) return
  const { router } = await import('../router')
  const route = router.currentRoute.value
  const query = { ...route.query }
  let changed = false
  if (queryValue(query.inviteCode) === code) {
    delete query.inviteCode
    changed = true
  }
  if (queryValue(query.id) === code) {
    delete query.id
    changed = true
  }
  if (!changed) return
  await router.replace({ path: route.path, query, hash: route.hash })
}
