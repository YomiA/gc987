import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getNotificationTabs,
  getSupportChannels,
  type NotificationTab,
  type SupportChannel,
} from '../api/notification'
import { showToast } from '../toast'

export const useNotificationStore = defineStore('notification', () => {
  const tabs = ref<NotificationTab[]>([])
  const channels = ref<SupportChannel[]>([])
  const active = ref('suporte')
  const loaded = ref(false)

  let task: Promise<void> | null = null

  function load(force = false) {
    if (task) return task
    if (loaded.value && !force) return Promise.resolve()
    task = (async () => {
      tabs.value = await getNotificationTabs()
      try {
        channels.value = await getSupportChannels()
        loaded.value = true
      } catch (error) {
        showToast(error instanceof Error ? error.message : String(error), 'error')
      }
    })().finally(() => {
      task = null
    })
    return task
  }

  function selectTab(key: string) {
    active.value = key
  }

  return { tabs, channels, active, loaded, load, selectTab }
})
