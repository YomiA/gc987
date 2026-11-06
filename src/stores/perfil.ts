import { defineStore } from 'pinia'
import { ref } from 'vue'
import { perfilApi, type PerfilOption, type PerfilProfile, type PerfilVip } from '../api/perfil'

export const usePerfilStore = defineStore('perfil', () => {
  const profile = ref<PerfilProfile | null>(null)
  const vip = ref<PerfilVip | null>(null)
  const options = ref<PerfilOption[]>([])
  const loaded = ref(false)

  let task: Promise<void> | null = null

  function load(force = false) {
    if (task) return task
    if (loaded.value && !force) return Promise.resolve()
    task = (async () => {
      const [p, v, o] = await Promise.all([
        perfilApi.getProfile(),
        perfilApi.getVip(),
        perfilApi.getOptions(),
      ])
      profile.value = p
      vip.value = v
      options.value = o
      loaded.value = true
    })().finally(() => {
      task = null
    })
    return task
  }

  return { profile, vip, options, loaded, load }
})
