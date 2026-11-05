import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { accessToken, authUser } from '../auth/session'
import {
  cancelCollectProduct,
  collectIdsOf,
  collectProduct,
  loadLayout,
  loadProduct,
  productCollectRecord,
  productHistoryRecord,
  walletBalance,
  type HomeProduct,
  type LayoutData,
  type ProductPlatform,
  type ProductType,
} from '../api/home'
import { showToast } from '../toast'
import { resolveLayoutImages } from '../utils/assetUrl'
import { setSiteTimeZone } from '../utils/timeZone'
import { buildProviderCatalog } from '../utils/productCatalog'
import {
  api,
  type Banner,
  type ClassificationGenre,
  type GameBlock,
  type Promo,
  type ProviderTab,
  type TabBarItem,
} from '../api/mock'

/** /walletBalance amounts are reais. Missing or failed reads stay at 0. */
function walletReais(data: unknown): number {
  const pick = (value: unknown) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value
    if (typeof value === 'string' && value.trim() !== '') {
      const n = Number(value)
      if (Number.isFinite(n)) return n
    }
    return null
  }
  const direct = pick(data)
  if (direct != null) return direct
  if (!data || typeof data !== 'object') return 0
  const bag = data as Record<string, unknown>
  const inner =
    bag.data && typeof bag.data === 'object' ? (bag.data as Record<string, unknown>) : bag
  for (const key of ['userAmt', 'balance', 'walletBalance', 'amt', 'amount']) {
    const found = pick(inner[key] ?? bag[key])
    if (found != null) return found
  }
  return 0
}

export const useHomeStore = defineStore('home', () => {
  const banners = ref<Banner[]>([])
  const promos = ref<Promo[]>([])
  const providerTabs = ref<ProviderTab[]>([])
  const gameBlocks = ref<GameBlock[]>([])
  const tabBarItems = ref<TabBarItem[]>([])
  const marqueeNotices = ref<string[]>([])
  const genres = ref<ClassificationGenre[]>([])

  const activeProvider = ref('POPULAR')
  const activeTab = ref('inicio')
  const loaded = ref(false)
  const layout = ref<LayoutData | null>(null)
  const productTypes = ref<ProductType[]>([])
  const platforms = ref<ProductPlatform[]>([])
  const products = ref<HomeProduct[]>([])
  const historyRecords = ref<unknown>(null)
  const wallet = ref<unknown>(null)
  /** Reais from /walletBalance. An error or a missing field stays at 0. */
  const balanceCents = computed(() => Math.round(walletReais(wallet.value) * 100))
  /** Product ids returned by /productCollectRecord. */
  const collectedIds = ref<string[]>([])
  const collectedIdSet = computed(() => new Set(collectedIds.value))
  const collectedProducts = computed(() =>
    products.value.filter((item) => collectedIdSet.value.has(String(item.id))),
  )

  function applyPictures(data: LayoutData) {
    const nextBanners = (data.bannerList || [])
      .map((item, index) => ({ id: index + 1, image: item.picPath }))
      .filter((item) => item.image)
    if (nextBanners.length) banners.value = nextBanners

    const ads = (data.adverBannerList || []).filter((item) => item.picPath)
    if (!ads.length) return
    promos.value = ads.map((item, index) => ({
      id: index + 1,
      image: item.picPath,
      span: index < ads.length - 1 ? 'half' : 'full',
    }))
  }

  function isCollected(id: string | number) {
    if (!accessToken.value) return false
    return collectedIdSet.value.has(String(id))
  }

  const collectPending = new Set<string>()

  async function collect(productId: string | number) {
    if (!accessToken.value) return
    const key = String(productId)
    if (collectPending.has(key)) return
    collectPending.add(key)
    const already = collectedIdSet.value.has(key)
    try {
      if (already) {
        await cancelCollectProduct(productId)
        collectedIds.value = collectedIds.value.filter((id) => id !== key)
      } else {
        await collectProduct(productId)
        if (!collectedIds.value.includes(key)) collectedIds.value = [...collectedIds.value, key]
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    } finally {
      collectPending.delete(key)
    }
  }

  /**
   * Layout and the product catalog stay for this page load.
   * Bottom-nav switches must not ask for them again; a full reload clears this.
   */
  let catalogTask: Promise<void> | null = null
  let sessionUser = ''
  let sessionTask: Promise<void> | null = null
  /** Set only after this visit's login or register succeeds. */
  let walletQueued = false

  function loadCatalog() {
    if (catalogTask) return catalogTask
    catalogTask = Promise.all([
      loadLayout()
        .then((resp) => {
          if (!resp.data) return
          const data = resolveLayoutImages(resp.data)
          layout.value = data
          setSiteTimeZone(data.timeZone)
          applyPictures(data)
        })
        .catch(() => undefined),
      loadProduct()
        .then((resp) => {
          const data = resp.data
          if (!data) return
          platforms.value = data.productPlatforms || []
          products.value = data.products || []
          const types = data.productTypes || []
          productTypes.value = types
          const catalog = buildProviderCatalog(types, products.value, platforms.value)
          if (!catalog.tabs.length) return
          providerTabs.value = catalog.tabs
          gameBlocks.value = catalog.blocks
          if (!catalog.tabs.some((tab) => tab.key === activeProvider.value)) {
            activeProvider.value = catalog.tabs[0].key
          }
        })
        .catch(() => undefined),
    ]).then(() => undefined)
    return catalogTask
  }

  function loadSession() {
    const userKey = accessToken.value ? String(authUser.value?.userId || 'in') : ''
    if (!userKey) {
      collectedIds.value = []
      return Promise.resolve()
    }
    if (sessionUser === userKey && sessionTask) return sessionTask
    sessionUser = userKey
    sessionTask = Promise.all([
      productHistoryRecord()
        .then((resp) => {
          historyRecords.value = resp.data ?? null
        })
        .catch(() => undefined),
      productCollectRecord()
        .then((resp) => {
          collectedIds.value = collectIdsOf(resp.data)
        })
        .catch(() => undefined),
    ]).then(() => undefined)
    return sessionTask
  }

  /** Ask for /walletBalance after this visit's login or register. */
  function queueWalletRefresh() {
    walletQueued = true
  }

  /** A cold visit does not call /walletBalance. A failed read keeps the signed-in header. */
  async function refreshQueuedWallet() {
    if (!walletQueued || !accessToken.value) return
    walletQueued = false
    try {
      const resp = await walletBalance()
      wallet.value = resp.data ?? null
    } catch {
      /* A 401 here must not open the login dialog. */
    }
  }

  watch(accessToken, (token) => {
    if (token) return
    collectedIds.value = []
    historyRecords.value = null
    wallet.value = null
    sessionUser = ''
    sessionTask = null
  })

  /**
   * Same as abc.com: these requests do not wait on each other.
   * The collect-record ids are matched to the product list after both arrive.
   * /collectProduct is not part of this batch. It runs only from a star click.
   * Layout and products are fetched once per page load. Login-only records
   * are fetched once per signed-in user, not on every tab change.
   */
  async function loadRemote() {
    const tasks = [loadCatalog()]
    if (accessToken.value) tasks.push(loadSession())
    else collectedIds.value = []
    await Promise.all(tasks)
  }

  async function load() {
    if (!loaded.value) {
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
      loaded.value = true
    }
    await loadRemote()
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
    activeProvider,
    activeTab,
    loaded,
    layout,
    productTypes,
    platforms,
    products,
    historyRecords,
    wallet,
    balanceCents,
    collectedIds,
    collectedProducts,
    load,
    loadRemote,
    queueWalletRefresh,
    refreshQueuedWallet,
    isCollected,
    collect,
    selectProvider,
    selectTab,
  }
})
