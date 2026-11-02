<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import GameCard from './GameCard.vue'
import SvgIcon from '../base/SvgIcon.vue'
import type { Game, GameBlock } from '../../api/mock'

const props = defineProps<{ block: GameBlock }>()
const router = useRouter()

/** Live DisplayAll expands the row. Clone uses that click to open the
 *  missing catalog pages: Popular → search, other blocks → category. */
function showAll() {
  if (props.block.key === 'POPULAR') {
    void router.push('/game/search/POPULAR')
    return
  }
  void router.push(`/game/category/ELECTRONIC/${props.block.key}`)
}

/** Live swiper: slidesPerView 1, speed 300, ease, spaceBetween 1,
 *  followFinger, shortSwipes (<300ms), longSwipesRatio 0.5, simulateTouch. */
const SPEED = 300
const SPACE = 1
const THRESHOLD = 5
const LONG_RATIO = 0.5
const LONG_MS = 300
const RESIST = 0.85

const page = ref(0)
const dragX = ref(0)
const dragging = ref(false)
const slideW = ref(0)
const swiperEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const pageSize = computed(() => Math.max(1, props.block.games.length))
const pageCount = computed(() => Math.max(1, Math.ceil(props.block.total / pageSize.value)))
const canPrev = computed(() => page.value > 0)
const canNext = computed(() => page.value < pageCount.value - 1)

let startX = 0
let startY = 0
let startT = 0
let originDrag = 0
let pointerId: number | null = null
let didDrag = false
let ro: ResizeObserver | null = null

function stride() {
  return (swiperEl.value?.clientWidth || slideW.value || 0) + SPACE
}

function measureSlide() {
  slideW.value = swiperEl.value?.clientWidth ?? 0
  if (!dragging.value) paint(-page.value * stride(), 0)
}

function clampDrag(dx: number) {
  if (page.value <= 0 && dx > 0) return dx * RESIST
  if (page.value >= pageCount.value - 1 && dx < 0) return dx * RESIST
  return dx
}

function visualX() {
  return -page.value * stride() + dragX.value
}

function readTranslateX() {
  const el = trackEl.value
  if (!el) return visualX()
  const t = getComputedStyle(el).transform
  if (!t || t === 'none') return visualX()
  return new DOMMatrixReadOnly(t).m41
}

function paint(x: number, ms: number) {
  const el = trackEl.value
  if (!el) return
  el.style.transitionDuration = `${ms}ms`
  el.style.transform = `translate3d(${x}px, 0, 0)`
}

function settleTo(target: number) {
  const el = trackEl.value
  const w = stride()
  const from = readTranslateX()
  const to = -target * w
  page.value = target
  dragX.value = 0
  dragging.value = false
  if (!el) return
  el.style.transition = 'none'
  el.style.transform = `translate3d(${from}px, 0, 0)`
  void el.offsetWidth
  el.style.transition = `transform ${SPEED}ms ease`
  el.style.transform = `translate3d(${to}px, 0, 0)`
}

function onPointerDown(e: PointerEvent) {
  if (e.button !== 0) return
  startX = e.clientX
  startY = e.clientY
  startT = performance.now()
  didDrag = false
  pointerId = e.pointerId
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (!didDrag) {
    if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return
    /* Live touchAngle 45°: a mostly-vertical gesture is page scroll. */
    if (Math.abs(dy) > Math.abs(dx)) {
      pointerId = null
      return
    }
    didDrag = true
    dragging.value = true
    originDrag = readTranslateX() + page.value * stride()
    dragX.value = originDrag
    paint(-page.value * stride() + originDrag, 0)
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      /* synthetic events cannot capture */
    }
  }
  const x = clampDrag(originDrag + (e.clientX - startX))
  dragX.value = x
  paint(-page.value * stride() + x, 0)
}

function finishDrag() {
  if (pointerId === null && !didDrag) return
  pointerId = null
  if (!didDrag) {
    dragging.value = false
    dragX.value = 0
    return
  }
  const offset = dragX.value
  const dt = performance.now() - startT
  const w = stride()
  let target = page.value
  if (dt < LONG_MS) {
    if (offset < -THRESHOLD) target += 1
    else if (offset > THRESHOLD) target -= 1
  } else if (w > 0) {
    if (offset <= -w * LONG_RATIO) target += 1
    else if (offset >= w * LONG_RATIO) target -= 1
  }
  target = Math.max(0, Math.min(pageCount.value - 1, target))
  settleTo(target)
}

function onPointerUp() {
  finishDrag()
}

function onClickCapture(e: MouseEvent) {
  if (!didDrag) return
  e.preventDefault()
  e.stopPropagation()
  didDrag = false
}

const shown = computed(() => props.block.games.length)

/** One slide per page. Extra pages cycle the downloaded thumbnails so the
 *  300ms slide still runs when later pages were never fetched. */
const pages = computed(() => {
  const src = props.block.games
  const size = pageSize.value
  return Array.from({ length: pageCount.value }, (_, i) => {
    const start = i * size
    if (start + size <= src.length) return src.slice(start, start + size)
    return Array.from({ length: size }, (__, j) => src[(start + j) % src.length]) as Game[]
  })
})

function step(delta: number) {
  const next = page.value + delta
  if (next < 0 || next > pageCount.value - 1) return
  settleTo(next)
}

onMounted(() => {
  measureSlide()
  ro = new ResizeObserver(measureSlide)
  if (swiperEl.value) ro.observe(swiperEl.value)
})

onBeforeUnmount(() => {
  ro?.disconnect()
})
</script>

<template>
  <div class="game-block">
    <div class="block-head">
      <div class="head-left">
        <div class="logo-container">
          <SvgIcon class="glow" name="glow" />
          <SvgIcon class="logo" :name="block.icon" />
        </div>
        <span class="title">{{ block.title }}</span>
        <span class="blue-line" />
        <span class="count">
          <span class="count-value">{{ block.total }}</span>
          <br />
          <span class="count-label">Todos</span>
        </span>
      </div>

      <div class="arrow-container">
        <button
          type="button"
          class="arrow prev"
          :class="{ disabled: !canPrev }"
          aria-label="Anterior"
          @click="step(-1)"
        >
          <SvgIcon name="arrow-left" />
        </button>
        <button
          type="button"
          class="arrow next"
          :class="{ disabled: !canNext }"
          aria-label="Próximo"
          @click="step(1)"
        >
          <SvgIcon name="arrow-right" />
        </button>
      </div>
    </div>

    <div class="game-content">
      <div
        ref="swiperEl"
        class="swiper"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @click.capture="onClickCapture"
      >
        <div ref="trackEl" class="track">
          <div v-for="(games, i) in pages" :key="i" class="card-container">
            <GameCard
              v-for="(game, j) in games"
              :key="`${game.name}-${j}`"
              :game="game"
              :layout="block.layout"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-if="block.total > shown" class="more">
      <span class="more-label">Mostrando {{ shown }} de {{ block.total }} jogos</span>
      <button class="more-btn" type="button" @click="showAll">
        <span class="more-btn-label">Mostrar tudo</span>
        <SvgIcon class="more-btn-icon" name="chevron-circle" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-block {
  margin-bottom: 0.625rem;
  padding: 0 0.5625rem;
  /* Live `.game-wrapper-c` on blue-default / Platform v01. */
  background-color: var(--color-bg-200);
  border-radius: 0.625rem;
}

.block-head {
  display: flex;
  height: 3rem;
  margin: 0 -0.5625rem 0.875rem;
  padding: 0.25rem 1rem 0 0.5625rem;
  align-items: center;
  background-image: url('/images/bg/headerTextBg.png');
  background-size: 70% 100%;
  background-repeat: no-repeat;
}

.head-left {
  display: flex;
  align-items: center;
}

.logo-container {
  position: relative;
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 0.4375rem;
  color: var(--search-blue);
}

.glow {
  position: absolute;
  top: 0.5rem;
  left: 0.9375rem;
  width: 1.375rem;
  height: 1.375rem;
  font-size: 1.375rem;
  transform: translateX(-0.6875rem);
}

.logo {
  width: 1.875rem;
  height: 1.875rem;
  font-size: 1.875rem;
}

.title {
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.5rem;
  color: rgb(255, 255, 255);
}

.blue-line {
  width: 0.0625rem;
  height: 1.75rem;
  margin: 0 0.5rem 0 0.625rem;
  background-color: var(--color-primary-800);
  transform: rotate(30deg);
}

.count {
  width: 2.45215rem;
  height: 1.875rem;
  padding: 0.1875rem;
  font-size: 0.75rem;
  line-height: 0.75rem;
  text-align: right;
  border-radius: 0.1875rem;
}

.count-value {
  font-weight: 900;
}

.count-label {
  opacity: 0.4;
}

.arrow-container {
  display: block;
  width: 3.875rem;
  height: 2.03125rem;
  margin-left: auto;
  flex: 0 0 auto;
  font-size: 0;
}

.arrow {
  display: inline-flex;
  width: 1.625rem;
  height: 1.625rem;
  padding: 0.375rem;
  justify-content: center;
  align-items: center;
  vertical-align: top;
  font-size: 0.875rem;
  color: var(--arrow-btn-fg);
  background-color: var(--arrow-btn-bg);
  border-radius: 9999px;
}

.arrow.prev {
  margin: 0 0.3125rem;
}

.arrow.disabled {
  color: var(--arrow-btn-fg-disabled);
}

.arrow .svg-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.game-content {
  overflow: visible;
}

.swiper {
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;
}

.track {
  display: flex;
  align-items: flex-start;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.card-container {
  display: flex;
  width: 100%;
  flex: 0 0 100%;
  margin-right: 1px;
  padding-bottom: 0.9375rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.more {
  display: flex;
  height: 3.875rem;
  padding-bottom: 1.625rem;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-transform: capitalize;
}

.more-label {
  height: 1.125rem;
  color: rgb(255, 255, 255);
}

.more-btn {
  display: flex;
  height: 1.125rem;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-transform: capitalize;
  color: var(--more-link);
}

.more-btn-label {
  font-weight: 600;
}

.more-btn-icon {
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.1875rem;
  transition: transform 0.3s;
}
</style>
