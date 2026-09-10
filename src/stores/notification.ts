import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getNotificationTabs,
  getSupportChannels,
  type NotificationTab,
  type SupportChannel,
} from '../api/notification'

export const useNotificationStore = defineStore('notification', () => {
  const tabs = ref<NotificationTab[]>([])
  const channels = ref<SupportChannel[]>([])
  const active = ref('suporte')
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    const [t, c] = await Promise.all([getNotificationTabs(), getSupportChannels()])
    tabs.value = t
    channels.value = c
    loaded.value = true
  }

  function selectTab(key: string) {
    active.value = key
  }

  return { tabs, channels, active, loaded, load, selectTab }
})
