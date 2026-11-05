import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Captures `beforeinstallprompt` as early as this module loads.
 * The manifest itself is `/api/manifest`, set from index.html.
 */
let deferredPrompt: BeforeInstallPromptEvent | null = null

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function capturePrompt(event: Event) {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
}

try {
  window.addEventListener('beforeinstallprompt', capturePrompt)
} catch {
  /* ignore */
}

/** iPhone, iPad, and iPadOS (which reports itself as a Mac with a touch screen). */
export function isAppleMobile() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  if (/iPhone|iPad|iPod/i.test(ua)) return true
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
}

export function isStandalone() {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://')
    )
  } catch {
    return false
  }
}

export function usePwaInstall() {
  const canInstall = ref(!!deferredPrompt)
  const isInstalled = ref(isStandalone())

  function onBeforeInstallPrompt(event: Event) {
    capturePrompt(event)
    canInstall.value = true
  }

  function onAppInstalled() {
    canInstall.value = false
    isInstalled.value = true
    deferredPrompt = null
  }

  async function promptInstall() {
    const prompt = deferredPrompt
    if (!prompt) return false
    try {
      await prompt.prompt()
      const { outcome } = await prompt.userChoice
      deferredPrompt = null
      canInstall.value = false
      if (outcome === 'accepted') isInstalled.value = true
      return outcome === 'accepted'
    } catch {
      return false
    }
  }

  onMounted(() => {
    isInstalled.value = isStandalone()
    if (deferredPrompt) canInstall.value = true
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.removeEventListener('appinstalled', onAppInstalled)
  })

  return { canInstall, isInstalled, promptInstall }
}
