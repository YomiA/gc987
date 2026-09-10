import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * The install prompts are UI-only. The live page shows a blocking modal on
 * first paint plus a dismissible strip above the header; both are reproduced
 * here without any real install flow.
 */
export const usePwaStore = defineStore('pwa', () => {
  const modalOpen = ref(true)
  const barVisible = ref(true)

  const closeModal = () => {
    modalOpen.value = false
  }
  const openModal = () => {
    modalOpen.value = true
  }
  const hideBar = () => {
    barVisible.value = false
  }

  return { modalOpen, barVisible, closeModal, openModal, hideBar }
})
