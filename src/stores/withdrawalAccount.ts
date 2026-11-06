import { ref } from 'vue'
import { defineStore } from 'pinia'
import { withdrawalAccountApi, type PixAccount } from '../api/withdrawalAccount'

export const useWithdrawalAccountStore = defineStore('withdrawalAccount', () => {
  const items = ref<PixAccount[]>([])
  const loaded = ref(false)

  let loadTask: Promise<void> | null = null
  function load() {
    if (loadTask) return loadTask
    loadTask = (async () => {
      items.value = await withdrawalAccountApi.list()
      loaded.value = true
    })().finally(() => {
      loadTask = null
    })
    return loadTask
  }

  async function add(name: string, pix: string) {
    await withdrawalAccountApi.add(name, pix)
    items.value = await withdrawalAccountApi.list()
  }

  return { items, loaded, load, add }
})
