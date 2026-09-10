import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  api,
  type Banner,
  type GameBlock,
  type Promo,
  type ProviderTab,
  type TabBarItem,
} from '../api/mock'

export const useHomeStore = defineStore('home', () => {
  const banners = ref<Banner[]>([])
  const promos = ref<Promo[]>([])
  const providerTabs = ref<ProviderTab[]>([])
  const gameBlocks = ref<GameBlock[]>([])
  const tabBarItems = ref<TabBarItem[]>([])
  const marqueeNotices = ref<string[]>([])
  const genres = ref<string[]>([])
  const brands = ref<string[]>([])

  const activeProvider = ref('POPULAR')
  const activeTab = ref('inicio')
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    const [b, p, tabs, blocks, bar, notices, cls] = await Promise.all([
      api.getBanners(),
      api.getPromos(),
      api.getProviderTabs(),
      api.getGameBlocks(),
      api.getTabBarItems(),
      api.getMarqueeNotices(),
      api.getClassification(),
    ])
    banners.value = b
    promos.value = p
    providerTabs.value = tabs
    gameBlocks.value = blocks
    tabBarItems.value = bar
    marqueeNotices.value = notices
    genres.value = cls.genres
    brands.value = cls.brands
    loaded.value = true
  }

  function selectProvider(key: string) {
    activeProvider.value = key
  }

  function selectTab(key: string) {
    activeTab.value = key
  }

  return {
    banners,
    promos,
    providerTabs,
    gameBlocks,
    tabBarItems,
    marqueeNotices,
    genres,
    brands,
    activeProvider,
    activeTab,
    loaded,
    load,
    selectProvider,
    selectTab,
  }
})
