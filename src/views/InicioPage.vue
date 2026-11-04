<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AppHeader from '../components/inicio/AppHeader.vue'
import AppInstallBar from '../components/inicio/AppInstallBar.vue'
import GameBlockView from '../components/inicio/GameBlock.vue'
import GameClassification from '../components/inicio/GameClassification.vue'
import MarqueeView from '../components/inicio/MarqueeView.vue'
import PosterSwiper from '../components/inicio/PosterSwiper.vue'
import PromoGrid from '../components/inicio/PromoGrid.vue'
import ProviderSegment from '../components/inicio/ProviderSegment.vue'
import PwaHeaderBar from '../components/inicio/PwaHeaderBar.vue'
import PwaModal from '../components/inicio/PwaModal.vue'
import SideMenu from '../components/inicio/SideMenu.vue'
import SiteFooter from '../components/inicio/SiteFooter.vue'
import SupportButton from '../components/inicio/SupportButton.vue'
import TabBar from '../components/inicio/TabBar.vue'
import ToTopButton from '../components/inicio/ToTopButton.vue'
import LoginModal from '../components/inicio/LoginModal.vue'
import type { GameBlock } from '../api/mock'
import { useHomeStore } from '../stores/home'
import { usePwaStore } from '../stores/pwa'

const router = useRouter()
const home = useHomeStore()
const auth = useAuthStore()
const pwa = usePwaStore()
const menuOpen = ref(false)

function openAuth(mode: 'login' | 'register') {
  if (mode === 'register') auth.openRegister()
  else auth.openLogin()
}
const scroller = ref<HTMLElement | null>(null)
const contentTick = ref(0)
const showToTop = ref(false)
/** Document Y of the provider bar. Sticky `offsetTop` is unusable once stuck. */
let dockY = 0
let scrollRaf = 0

/** Ionic `content.scrollToPoint` duration on this page. */
const DOCK_MS = 300

function animateScrollTo(el: HTMLElement, top: number, duration: number) {
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
  const from = el.scrollTop
  const delta = top - from
  if (Math.abs(delta) < 1) return
  const started = performance.now()
  const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
  const tick = (now: number) => {
    const p = Math.min(1, (now - started) / duration)
    el.scrollTop = from + delta * easeOutCubic(p)
    if (p < 1) scrollRaf = requestAnimationFrame(tick)
    else scrollRaf = 0
  }
  scrollRaf = requestAnimationFrame(tick)
}

function measureDockY() {
  const sc = scroller.value
  const seg = sc?.querySelector('.segment-wrapper') as HTMLElement | null
  if (!sc || !seg) return
  const visual = seg.getBoundingClientRect().top - sc.getBoundingClientRect().top
  if (visual > 0.5) dockY = sc.scrollTop + visual
}

function dockSegment() {
  const sc = scroller.value
  if (!sc) return
  measureDockY()
  animateScrollTo(sc, dockY, DOCK_MS)
}

const visibleBlocks = computed<GameBlock[]>(() => {
  if (home.activeProvider === 'POPULAR') return home.gameBlocks
  const match = home.gameBlocks.filter((block) => block.key === home.activeProvider)
  if (match.length) return match
  const tab = home.providerTabs.find((item) => item.key === home.activeProvider)
  const games = home.gameBlocks
    .flatMap((block) => block.games)
    .filter((game) => {
      const key = home.activeProvider.toUpperCase()
      const provider = game.provider.toUpperCase()
      return provider === key || provider.startsWith(key)
    })
  return [
    {
      key: home.activeProvider,
      icon: tab?.icon ?? `provider-${home.activeProvider}`,
      title: 'Slot',
      total: Math.max(games.length, 1),
      layout: 'grid',
      games: games.length ? games : home.gameBlocks[0]?.games.slice(0, 12) ?? [],
    },
  ]
})

function onSelectProvider(key: string) {
  home.selectProvider(key)
  showToTop.value = false
  contentTick.value += 1
  void nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(dockSegment)
      updateToTop()
    })
  })
}

/**
 * Live watchBuoy only flips on intersecting game sections (index > 2 show,
 * index <= 2 hide). At the footer no `.game-block` intersects; treat that as
 * "already past the 4th block" so TOP stays on at the bottom.
 */
function updateToTop() {
  const sc = scroller.value
  if (!sc) {
    showToTop.value = false
    return
  }
  const blocks = sc.querySelectorAll('.game-block')
  const root = sc.getBoundingClientRect()
  let intersecting = -1
  blocks.forEach((el, i) => {
    const box = el.getBoundingClientRect()
    if (box.bottom > root.top && box.top < root.bottom) intersecting = i
  })
  if (intersecting > 2) {
    showToTop.value = true
    return
  }
  if (intersecting >= 0) {
    showToTop.value = false
    return
  }
  const fourth = blocks[3]
  showToTop.value = !!fourth && fourth.getBoundingClientRect().bottom <= root.top
}

function scrollToTop() {
  const sc = scroller.value
  if (!sc) return
  animateScrollTo(sc, 0, DOCK_MS)
}

function onMenuSelect(key: string) {
  menuOpen.value = false
  onSelectProvider(key)
}

/** Promoção / Depósito / Perfil are their own routes; remaining tabs stay here. */
function onTabSelect(key: string) {
  if (key === 'promo') {
    void router.push('/main/promo')
    return
  }
  if (key === 'deposito') {
    void router.push('/main/entrar')
    return
  }
  if (key === 'perfil') {
    void router.push('/main/perfil')
    return
  }
  if (key === 'saque') {
    void router.push('/main/withdraw')
    return
  }
  home.selectTab(key)
}

/** Verbatim footer copy from the live page, blank lines included. */
const footerTerms = [
  '1. Este produto é para uso de usuários maiores de 18 anos e é destinado apenas para fins de entretenimento.',
  '2. este jogo contém compras noapp.',
  '3. O fato de um jogador jogar ou ganhar em um jogo de apostas sociais não significa que ele ganhará em apostas com dinheiro real e jogos relacionados no futuro.',
].join('\n\n')

watch(
  () => auth.isLoggedIn,
  (loggedIn, wasLoggedIn) => {
    if (loggedIn && !wasLoggedIn) void home.loadRemote()
  },
)

onMounted(() => {
  void home.load().then(() => {
    void nextTick(() => {
      requestAnimationFrame(measureDockY)
      updateToTop()
    })
  })
})

onBeforeUnmount(() => {
  if (scrollRaf) cancelAnimationFrame(scrollRaf)
})
</script>

<template>
  <div class="ion-page" :class="{ 'menu-open': menuOpen }">
    <div class="page-header">
      <PwaHeaderBar v-if="pwa.barVisible" @close="pwa.hideBar()" />
      <AppHeader
        @menu="menuOpen = true"
        @login="openAuth('login')"
        @register="openAuth('register')"
        @search="void router.push('/game/search/POPULAR')"
      />
    </div>

    <div class="router-outlet">
      <div ref="scroller" class="main-content" @scroll.passive="updateToTop">
        <div class="order-container">
          <PosterSwiper :banners="home.banners" />
          <PromoGrid :promos="home.promos" />
          <MarqueeView :notices="home.marqueeNotices" />
          <ProviderSegment
            :tabs="home.providerTabs"
            :active="home.activeProvider"
            @select="onSelectProvider"
          />
          <div :key="contentTick" class="game-c">
            <GameBlockView v-for="block in visibleBlocks" :key="block.key" :block="block" />
          </div>
          <AppInstallBar />
          <GameClassification :genres="home.genres" :brands="home.brands" />
          <SiteFooter :terms="footerTerms" />
        </div>
        <div class="bottom-spacer" />
      </div>
    </div>

    <SupportButton />
    <ToTopButton :visible="showToTop && !pwa.modalOpen && !auth.dialogOpen" @top="scrollToTop" />
    <TabBar :items="home.tabBarItems" :active="home.activeTab" @select="onTabSelect" />
    <PwaModal v-if="pwa.modalOpen" @close="pwa.closeModal()" />
    <LoginModal
      v-if="auth.dialogOpen"
      :mode="auth.dialogMode"
      @update:mode="auth.setDialogMode"
      @close="auth.closeDialog()"
    />
    <SideMenu
      :open="menuOpen"
      :tabs="home.providerTabs"
      :active="home.activeProvider"
      @close="menuOpen = false"
      @select="onMenuSelect"
    />
  </div>
</template>

<style scoped>
/* `contain: layout` reproduces the live page's ion-tabs, which makes this the
   containing block for the fixed support button so it hugs the column edge
   rather than the window edge once the viewport is wider than the column. */
.ion-page {
  display: flex;
  position: relative;
  width: 100%;
  max-width: var(--app-max-width);
  height: 100vh;
  height: 100dvh;
  margin: 0 auto;
  padding-top: var(--sat);
  padding-bottom: var(--sab);
  flex-direction: column;
  overflow: hidden;
  contain: layout;
  background-color: var(--color-bar-bg);
}

.page-header {
  display: flex;
  position: relative;
  z-index: 10;
  flex-direction: column;
  flex: 0 0 auto;
}

/* The live page nests the scroller inside ion-router-outlet (z-index 0) and
   keeps ion-tab-bar as a later sibling at z-index 10, so the bar paints over
   the content. Reproducing that nesting keeps both z-index values as measured. */
.router-outlet {
  position: relative;
  z-index: 0;
  display: flex;
  flex: 1 1 0%;
  min-height: 0;
}

.main-content {
  position: relative;
  z-index: 20;
  flex: 1 1 0%;
  overflow-x: hidden;
  overflow-y: auto;
  /* Live page: ion-content::part(scroll) { scrollbar-width: none }
     plus ::-webkit-scrollbar { display: none }. Scrolling stays. */
  scrollbar-width: none;
  overflow-anchor: none;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: var(--color-bar-bg);
  -webkit-overflow-scrolling: touch;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.ion-page.menu-open .main-content {
  overflow: hidden;
}

/* Plain block flow on purpose: the last block's 10px bottom margin has to
   collapse with the install bar's 10px top margin, as it does on the live
   page. A flex container here would add the two together. */
.game-c {
  display: block;
  animation: game-dock 0.3s ease;
}

@keyframes game-dock {
  from {
    opacity: 0;
    transform: translate3d(0, 0.75rem, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* Matches the 112px block the live page reserves under the footer so the
   tab bar never covers the last line of terms. */
.bottom-spacer {
  height: 7rem;
  margin-top: 0.875rem;
}
</style>
