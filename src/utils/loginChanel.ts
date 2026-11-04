/**
 * Login channel sent as `loginChanel`.
 * 0 web (desktop or mobile browser), 1 native app, 2 installed PWA.
 *
 * Same order as the original site: a `sd` query overrides, except `sd=2`
 * which falls through to the real standalone check. Native shell wins over
 * the browser, and an installed PWA wins over a normal tab.
 */
const SD_BUILD = [
  'iOSH5',
  'AndroidH5',
  'PWA',
  'APK',
  'iOSApp',
  'iOSBookmark',
  'APKRelease',
  'DesktopOS',
] as const

type CapacitorGlobal = {
  getPlatform?: () => string
  isNativePlatform?: () => boolean
}

function isStandalone() {
  const nav = navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true ||
    document.referrer.startsWith('android-app://') ||
    document.documentElement.classList.contains('is-standalone')
  )
}

function isNativeApp() {
  const html = document.documentElement
  if (
    (html.classList.contains('plt-capacitor') || html.classList.contains('plt-cordova')) &&
    !html.classList.contains('plt-pwa')
  ) {
    return true
  }
  const cap = (window as Window & { Capacitor?: CapacitorGlobal }).Capacitor
  if (cap?.isNativePlatform?.()) return true
  const platform = cap?.getPlatform?.()
  if (platform === 'android' || platform === 'ios') return true
  const handlers = (
    window as Window & { webkit?: { messageHandlers?: Record<string, unknown> } }
  ).webkit?.messageHandlers
  return !!handlers?.['progressier-requests-push-status']
}

function fromBuild(build: string | undefined): 0 | 1 | 2 | null {
  if (build === 'PWA' || build === 'iOSBookmark') return 2
  if (build === 'APK' || build === 'APKRelease' || build === 'iOSApp') return 1
  if (build === 'iOSH5' || build === 'AndroidH5' || build === 'DesktopOS') return 0
  return null
}

export function detectLoginChanel(): 0 | 1 | 2 {
  try {
    const sd = new URLSearchParams(window.location.search).get('sd')
    if (sd && sd !== '2') {
      const forced = fromBuild(SD_BUILD[Number(sd)])
      if (forced != null) return forced
    }
    if (isNativeApp()) return 1
    if (isStandalone()) return 2
    return 0
  } catch {
    return 0
  }
}
