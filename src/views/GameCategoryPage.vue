<script setup lang="ts">
/**
 * /game/category/:gameType/:platformId — provider catalog (GameCategory / Tte).
 * Opened from homepage Mostrar tudo (non-Popular blocks) and footer brands.
 * No TabBar. Geometry: docs/research/gc987-com/game-category/
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CategoryGameGrid from '../components/inicio/CategoryGameGrid.vue'
import CategoryRail from '../components/inicio/CategoryRail.vue'
import CategorySortTabs, { type CategorySortTab } from '../components/inicio/CategorySortTabs.vue'
import SearchEmpty from '../components/inicio/SearchEmpty.vue'
import SearchHeader from '../components/inicio/SearchHeader.vue'
import type { Game } from '../api/mock'
import {
  categoryPlatforms,
  gameMatchesPlatform,
  gameTypeTitles,
  uniqueCatalog,
} from '../api/mock'
import { useHomeStore } from '../stores/home'

const TABS: CategorySortTab[] = [
  { key: 'ALL', label: 'Todos' },
  { key: 'POPULAR', label: 'Popular' },
  { key: 'RECENT', label: 'Recente' },
  { key: 'FAVORITE', label: 'Favoritos' },
]

const VALID_PLATFORM = new Set(categoryPlatforms.map((item) => item.key))

const route = useRoute()
const router = useRouter()
const home = useHomeStore()
const query = ref('')
const submitted = ref('')
const loading = ref(false)
const sort = ref('ALL')
let searchGen = 0
const SEARCH_MS = 400

const gameType = computed(() => String(route.params.gameType || 'ELECTRONIC').toUpperCase())

const title = computed(() => gameTypeTitles[gameType.value] ?? 'Slot')

const platformId = computed(() => {
  const raw = String(route.params.platformId ?? '0')
  return VALID_PLATFORM.has(raw) ? raw : '0'
})

const catalog = computed<Game[]>(() => uniqueCatalog(home.gameBlocks))

const popular = computed<Game[]>(() => {
  const block = home.gameBlocks.find((item) => item.key === 'POPULAR')
  return block?.games ?? []
})

const scoped = computed<Game[]>(() =>
  catalog.value.filter((game) => gameMatchesPlatform(game, platformId.value)),
)

const pool = computed<Game[]>(() => {
  if (sort.value === 'RECENT' || sort.value === 'FAVORITE') return []
  if (sort.value === 'POPULAR') {
    return popular.value.filter((game) => gameMatchesPlatform(game, platformId.value))
  }
  return scoped.value
})

const shown = computed<Game[]>(() => {
  const q = submitted.value.trim().toLowerCase()
  if (!q) return pool.value
  return pool.value.filter((game) => game.name.toLowerCase().includes(q))
})

const showEmpty = computed(() => shown.value.length === 0)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/inicio')
}

function selectPlatform(key: string) {
  if (key === platformId.value) return
  sort.value = 'ALL'
  submitted.value = ''
  void router.replace(`/game/category/${gameType.value}/${key}`)
}

function selectSort(key: string) {
  sort.value = key
}

function onSearch() {
  const q = query.value.trim()
  if (!q) {
    submitted.value = ''
    return
  }
  const gen = ++searchGen
  loading.value = true
  window.setTimeout(() => {
    if (gen !== searchGen) return
    submitted.value = q
    loading.value = false
  }, SEARCH_MS)
}

onMounted(() => {
  void home.enterCatalogPage('category')
})
</script>

<template>
  <div class="ion-page">
    <SearchHeader
      v-model="query"
      :loading="loading"
      :title="tr(title)"
      :placeholder="tr('PesquisarJogos')"
      light-placeholder
      @back="goBack"
      @search="onSearch"
    />
    <div class="category-body">
      <CategoryRail :platforms="categoryPlatforms" :active="platformId" @select="selectPlatform" />
      <div class="category-main">
        <CategorySortTabs :tabs="TABS" :active="sort" @select="selectSort" />
        <SearchEmpty v-if="showEmpty" />
        <CategoryGameGrid v-else :games="shown" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-body {
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
  align-items: stretch;
  background-color: var(--color-bar-bg);
}

.category-main {
  display: flex;
  position: relative;
  min-width: 0;
  padding-top: 0.125rem;
  flex: 1 1 0%;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.category-main::-webkit-scrollbar {
  display: none;
}
</style>
