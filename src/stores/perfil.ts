import { defineStore } from 'pinia'
import { ref } from 'vue'
import { perfilApi, type PerfilOption, type PerfilProfile, type PerfilVip } from '../api/perfil'

export const usePerfilStore = defineStore('perfil', () => {
  const profile = ref<PerfilProfile | null>(null)
  const vip = ref<PerfilVip | null>(null)
  const options = ref<PerfilOption[]>([])
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    const [p, v, o] = await Promise.all([
      perfilApi.getProfile(),
      perfilApi.getVip(),
      perfilApi.getOptions(),
    ])
    profile.value = p
    vip.value = v
    options.value = o
    loaded.value = true
  }

  return { profile, vip, options, loaded, load }
})
