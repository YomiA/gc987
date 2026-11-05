<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Banner } from '../../api/mock'

const props = defineProps<{ banners: Banner[] }>()

/**
 * Live banner swiper: loop, slidesPerView 1, spaceBetween 0, speed 300,
 * autoplay 2500 (disableOnInteraction false), simulateTouch, followFinger,
 * shortSwipes under 300ms, longSwipesRatio 0.5, threshold 5, touchAngle 45.
 */
const SPEED = 300
const DELAY = 2500
const THRESHOLD = 5
const LONG_RATIO = 0.5
const LONG_MS = 300

/** 0 is the cloned last slide, 1..n are real slides, n+1 is the cloned first. */
const pos = ref(props.banners.length > 1 ? 1 : 0)
const dragX = ref(0)
const dragging = ref(false)
const animating = ref(false)
const posterEl = ref<HTMLElement | null>(null)

const slides = computed(() => {
  const list = props.banners
  if (list.length <= 1) return list
  return [list[list.length - 1], ...list, list[0]]
})

const trackStyle = computed(() => ({
  transform: `translate3d(calc(-${pos.value * 100}% + ${dragX.value}px), 0, 0)`,
  transitionDuration: dragging.value || !animating.value ? '0ms' : `${SPEED}ms`,
}))

let timer: number | undefined
let jumpTimer: number | undefined
let startX = 0
let startY = 0
let startT = 0
let pointerId: number | null = null
let didDrag = false

function stopAutoplay() {
  if (timer) window.clearInterval(timer)
  timer = undefined
}

function startAutoplay() {
  stopAutoplay()
  if (props.banners.length <= 1) return
  timer = window.setInterval(() => {
    if (dragging.value) return
    go(1)
  }, DELAY)
}

/** After a wrap animation, sit on the real slide that looks identical. */
function normalize() {
  const n = props.banners.length
  if (n <= 1) return
  if (pos.value !== 0 && pos.value !== n + 1) return
  animating.value = false
  pos.value = pos.value === 0 ? n : 1
}

function armNormalize() {
  if (jumpTimer) window.clearTimeout(jumpTimer)
  const n = props.banners.length
  if (n <= 1 || (pos.value !== 0 && pos.value !== n + 1)) return
  jumpTimer = window.setTimeout(() => {
    jumpTimer = undefined
    normalize()
  }, SPEED + 40)
}

function go(delta: number) {
  const n = props.banners.length
  if (n <= 1 || delta === 0) {
    dragX.value = 0
    dragging.value = false
    animating.value = true
    return
  }
  dragX.value = 0
  dragging.value = false
  animating.value = true
  pos.value += delta
  armNormalize()
}

function onTransitionEnd(event: TransitionEvent) {
  if (event.target !== event.currentTarget || event.propertyName !== 'transform') return
  if (dragging.value) return
  normalize()
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 || props.banners.length <= 1) return
  if (jumpTimer) {
    window.clearTimeout(jumpTimer)
    jumpTimer = undefined
  }
  normalize()
  stopAutoplay()
  startX = event.clientX
  startY = event.clientY
  startT = performance.now()
  didDrag = false
  pointerId = event.pointerId
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerId !== pointerId) return
  const dx = event.clientX - startX
  const dy = event.clientY - startY
  if (!didDrag) {
    if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return
    if (Math.abs(dy) > Math.abs(dx)) {
      pointerId = null
      startAutoplay()
      return
    }
    didDrag = true
    dragging.value = true
    animating.value = false
    try {
      posterEl.value?.setPointerCapture(event.pointerId)
    } catch {
      /* synthetic events cannot capture */
    }
  }
  dragX.value = dx
}

function onPointerUp() {
  if (pointerId === null && !didDrag) return
  pointerId = null
  if (!didDrag) {
    dragging.value = false
    startAutoplay()
    return
  }
  const dx = dragX.value
  const width = posterEl.value?.clientWidth ?? 0
  const dt = performance.now() - startT
  let delta = 0
  if (dt < LONG_MS) {
    if (dx <= -THRESHOLD) delta = 1
    else if (dx >= THRESHOLD) delta = -1
  } else if (width > 0) {
    if (dx <= -width * LONG_RATIO) delta = 1
    else if (dx >= width * LONG_RATIO) delta = -1
  }
  go(delta)
  startAutoplay()
}

function onClickCapture(event: MouseEvent) {
  if (!didDrag) return
  event.preventDefault()
  event.stopPropagation()
  didDrag = false
}

watch(
  () => props.banners.length,
  (n, prev) => {
    if (n === prev) return
    animating.value = false
    dragX.value = 0
    pos.value = n > 1 ? 1 : 0
    startAutoplay()
  },
)

onMounted(() => {
  if (props.banners.length > 1) pos.value = 1
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  if (jumpTimer) window.clearTimeout(jumpTimer)
})
</script>

<template>
  <div
    ref="posterEl"
    class="poster"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @click.capture="onClickCapture"
    @dragstart.prevent
  >
    <div class="track" :style="trackStyle" @transitionend="onTransitionEnd">
      <div v-for="(banner, i) in slides" :key="`${banner.id}-${i}`" class="slide">
        <img class="poster-img" :src="banner.image" alt="" draggable="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.poster {
  width: 22.5rem;
  height: 7.5rem;
  margin: 0.9375rem 0.9375rem 0;
  overflow: hidden;
  border-radius: 0.625rem;
  touch-action: pan-y;
  user-select: none;
  cursor: grab;
}

.poster:active {
  cursor: grabbing;
}

.track {
  display: flex;
  position: relative;
  z-index: 1;
  width: 22.5rem;
  height: 7.5rem;
  transition-property: transform;
  transition-timing-function: ease;
}

.slide {
  position: relative;
  width: 22.5rem;
  height: 7.5rem;
  flex: 0 0 auto;
}

.poster-img {
  width: 22.5rem;
  height: 7.5rem;
  max-width: 100%;
  object-fit: cover;
  object-position: 0% 0%;
  pointer-events: none;
  -webkit-user-drag: none;
}
</style>
