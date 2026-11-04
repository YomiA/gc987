<script setup lang="ts">
/**
 * /game/search/:provider — full page opened from the homepage header
 * magnifier. Not an overlay: the live pathname changes. No TabBar.
 *
 * Tabs: Pesquisar / Popular / Recente / Favoritos. Popular is the default
 * (POPULAR). Recente and Favoritos are empty while logged out. The field
 * does not search on input — the right magnifier submits (empty click
 * returns to POPULAR). While the mock request runs the icon is a bubbles
 * spinner.
 *
 * Geometry: docs/research/gc987-com/game-search/
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoginModal from '../components/inicio/LoginModal.vue'
import SearchEmpty from '../components/inicio/SearchEmpty.vue'
import SearchGameGrid from '../components/inicio/SearchGameGrid.vue'
import SearchHeader from '../components/inicio/SearchHeader.vue'
import SearchSegment, { type SearchTab } from '../components/inicio/SearchSegment.vue'
import type { Game } from '../api/mock'
import { useAuthStore } from '../stores/auth'
import { useHomeStore } from '../stores/home'

const TABS: SearchTab[] = [
  { key: 'SEARCH', label: 'Pesquisar', icon: '/images/search/SEARCH_on.png' },
  { key: 'POPULAR', label: 'Popular', icon: '/images/search/POPULAR_on.png' },
  { key: 'RECENT', label: 'Recente', icon: '/images/search/RECENT_on.png' },
  { key: 'FAVORITE', label: 'Favoritos', icon: '/images/search/FAVORITE_on.png' },
]

const VALID = new Set(TABS.map((tab) => tab.key))

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const home = useHomeStore()
const query = ref('')
const submitted = ref('')
const loading = ref(false)
let searchGen = 0
const SEARCH_MS = 400

const active = computed(() => {
  const raw = String(route.params.provider || 'POPULAR').toUpperCase()
  return VALID.has(raw) ? raw : 'POPULAR'
})

const catalog = computed<Game[]>(() => {
  const seen = new Set<string>()
  const out: Game[] = []
  for (const block of home.gameBlocks) {
    for (const game of block.games) {
      if (seen.has(game.id)) continue
      seen.add(game.id)
      out.push(game)
    }
  }
  return out
})

const shown = computed<Game[]>(() => {
  if (active.value === 'POPULAR') return catalog.value
  if (active.value === 'SEARCH') {
    const q = submitted.value.trim().toLowerCase()
    if (!q) return []
    return catalog.value.filter((game) => game.name.toLowerCase().includes(q))
  }
  return []
})

const showEmpty = computed(() => shown.value.length === 0)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/inicio')
}

function selectTab(key: string) {
  if (key === active.value) return
  void router.replace(`/game/search/${key}`)
}

function onSearch() {
  const q = query.value.trim()
  if (!q) {
    submitted.value = ''
    if (active.value !== 'POPULAR') void router.replace('/game/search/POPULAR')
    return
  }
  const gen = ++searchGen
  loading.value = true
  if (active.value !== 'SEARCH') void router.replace('/game/search/SEARCH')
  window.setTimeout(() => {
    if (gen !== searchGen) return
    submitted.value = q
    loading.value = false
  }, SEARCH_MS)
}

onMounted(() => {
  void home.load()
})
</script>

<template>
  <div class="ion-page">
    <SearchHeader v-model="query" :loading="loading" @back="goBack" @search="onSearch" />
    <div class="page-scroller search-body">
      <SearchSegment :tabs="TABS" :active="active" @select="selectTab" />
      <SearchEmpty v-if="showEmpty" />
      <SearchGameGrid v-else :games="shown" />
    </div>
    <LoginModal
      v-if="auth.dialogOpen"
      :mode="auth.dialogMode"
      @update:mode="auth.setDialogMode"
      @close="auth.closeDialog()"
    />
  </div>
</template>

<style scoped>
.search-body {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bar-bg);
}
</style>
