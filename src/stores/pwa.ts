import { defineStore } from 'pinia'
import { ref } from 'vue'

function alreadyInstalled() {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    )
  } catch {
    return false
  }
}

/** Install strip and modal. Hidden once the site is already running as an installed app. */
export const usePwaStore = defineStore('pwa', () => {
  const installed = alreadyInstalled()
  const modalOpen = ref(!installed)
  const barVisible = ref(!installed)
  /** Safari add-to-home sheet. Separate from the version-notice modal. */
  const guideOpen = ref(false)

  const closeModal = () => {
    modalOpen.value = false
  }
  const openModal = () => {
    modalOpen.value = true
  }
  const openGuide = () => {
    modalOpen.value = false
    guideOpen.value = true
  }
  const closeGuide = () => {
    guideOpen.value = false
  }
  const hideBar = () => {
    barVisible.value = false
  }

  return { modalOpen, barVisible, guideOpen, closeModal, openModal, openGuide, closeGuide, hideBar }
})
