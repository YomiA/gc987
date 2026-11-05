<script setup lang="ts">
/**
 * Four-tab strip on /game/search/:provider.
 *
 * Live slots an ion-button.tab (icon + 14px label, row, 42px) inside each
 * ion-segment-button (48px, flex 0 1 auto). Idle label rgb(109,120,142)/400;
 * checked white/700. Click uses ion-ripple-effect (bounded, currentColor,
 * fade-in 75ms to 0.16 / expand 225ms / fade-out 150ms) plus Ionic's
 * 250ms translate+scaleX indicator. Color on the host is 0.15s linear.
 */
import { ref, watch } from 'vue'

export interface SearchTab {
  key: string
  label: string
  icon: string
}

const RIPPLE_PADDING = 10
const RIPPLE_ORIGIN = 0.5
const RIPPLE_HOLD_MS = 325

const props = defineProps<{ tabs: SearchTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const row = ref<HTMLElement | null>(null)
/** Mirrors the route, but updates on pointer-up so the ink + bar start now. */
const picked = ref(props.active)

watch(
  () => props.active,
  (next) => {
    if (next === picked.value) return
    const prev = picked.value
    picked.value = next
    animateIndicator(prev, next)
  },
)

function select(key: string) {
  if (key === picked.value) return
  const prev = picked.value
  picked.value = key
  animateIndicator(prev, key)
  emit('select', key)
}

function animateIndicator(prev: string, next: string) {
  const rowEl = row.value
  if (!rowEl) return
  const prevInd = rowEl.querySelector<HTMLElement>(`[data-key="${CSS.escape(prev)}"] .seg-indicator`)
  const nextInd = rowEl.querySelector<HTMLElement>(`[data-key="${CSS.escape(next)}"] .seg-indicator`)
  if (!prevInd || !nextInd) return
  const prevRect = prevInd.getBoundingClientRect()
  const nextRect = nextInd.getBoundingClientRect()
  if (prevRect.width < 1 || nextRect.width < 1) return
  const transform = `translate3d(${prevRect.left - nextRect.left}px, 0, 0) scaleX(${prevRect.width / nextRect.width})`
  requestAnimationFrame(() => {
    nextInd.classList.remove('animated')
    nextInd.style.transform = transform
    nextInd.getBoundingClientRect()
    nextInd.classList.add('animated')
    nextInd.style.transform = ''
  })
}

function spawnRipple(host: HTMLElement, clientX: number, clientY: number) {
  const rect = host.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const hypotenuse = Math.sqrt(width * width + height * height)
  const maxDim = Math.max(width, height)
  const initial = Math.floor(maxDim * RIPPLE_ORIGIN)
  if (initial < 1) return
  const scale = (hypotenuse + RIPPLE_PADDING) / initial
  const x = clientX - rect.left
  const y = clientY - rect.top
  const ink = document.createElement('span')
  ink.className = 'ripple-effect'
  ink.style.top = `${y - initial * 0.5}px`
  ink.style.left = `${x - initial * 0.5}px`
  ink.style.width = ink.style.height = `${initial}px`
  ink.style.setProperty('--final-scale', String(scale))
  ink.style.setProperty('--translate-end', `${width * 0.5 - x}px, ${height * 0.5 - y}px`)
  // Freeze idle-tab gray. `.on` used to flip the host to white, and
  // currentColor then read as a pale blue wash on the navy bar.
  ink.style.color = 'rgb(109, 120, 142)'
  ink.style.backgroundColor = 'rgb(109, 120, 142)'
  host.appendChild(ink)
  const started = performance.now()
  let faded = false
  const fade = () => {
    if (faded) return
    faded = true
    window.removeEventListener('pointerup', fade)
    window.removeEventListener('pointercancel', fade)
    const wait = Math.max(0, RIPPLE_HOLD_MS - (performance.now() - started))
    window.setTimeout(() => {
      ink.classList.add('fade-out')
      ink.addEventListener('animationend', () => ink.remove(), { once: true })
    }, wait)
  }
  window.addEventListener('pointerup', fade)
  window.addEventListener('pointercancel', fade)
}

/** ion-ripple-effect.addRipple — one bounded layer on the 48px host. */
function addRipple(event: PointerEvent) {
  if (event.button !== 0) return
  spawnRipple(event.currentTarget as HTMLElement, event.clientX, event.clientY)
}
</script>

<template>
  <div ref="row" class="seg-row search-seg" role="tablist">
    <button
      v-for="tab in props.tabs"
      :key="tab.key"
      type="button"
      role="tab"
      class="seg-btn"
      :class="{ on: tab.key === picked }"
      :data-key="tab.key"
      :aria-selected="tab.key === picked"
      @pointerdown="addRipple"
      @click="select(tab.key)"
    >
      <span class="tab">
        <img class="tab-img" :src="tab.icon" alt="" />
        <span class="tab-label">{{ tr(tab.label) }}</span>
      </span>
      <span class="seg-indicator animated" />
    </button>
  </div>
</template>

<style scoped>
/* ion-segment.md: padding 6px 10px 0, hairline --divider, height 53.67.
   Live --indicator-height is .125rem (rect 164–166) but ion-segment uses
   contain:paint, so the 1px that sits in the border is clipped. */
.seg-row {
  display: flex;
  position: relative;
  flex: 0 0 auto;
  padding: 0.375rem 0.625rem 0;
  justify-content: flex-start;
  align-items: stretch;
  border-bottom: 0.0625rem solid var(--divider);
  contain: paint;
  overflow: hidden;
}

.seg-btn {
  display: flex;
  position: relative;
  height: 3rem;
  padding: 0 0.375rem;
  margin-bottom: -0.0625rem;
  flex: 0 1 auto;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
  color: rgb(109, 120, 142);
}

.tab {
  display: flex;
  position: relative;
  z-index: 1;
  height: 2.625rem;
  margin: 0 0.125rem;
  padding: 0 0 0.3125rem;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.tab-img {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
  object-fit: contain;
}

.tab-label {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  text-align: center;
  text-transform: capitalize;
  white-space: nowrap;
  color: rgb(109, 120, 142);
  transition: color 0.15s linear;
}

.seg-btn.on .tab-label {
  font-weight: 700;
  color: var(--color-text-100);
}

.seg-indicator {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 0.125rem;
  background-color: var(--search-blue);
  opacity: 0;
  pointer-events: none;
  transform-origin: left center;
  will-change: transform;
}

.seg-indicator.animated {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.seg-btn.on .seg-indicator {
  opacity: 1;
}
</style>

<style>
/* Unscoped so JS-created ripple nodes (no data-v-*) get the keyframes.
   Live fires two 0.16-opacity inks (segment-button + inner ion-button.tab)
   of rgb(109, 120, 142). One 0.16 circle over #090f1f lets the navy show
   through and reads blue; 1-(1-0.16)^2 ≈ 0.294 matches the stacked gray. */
.search-seg .ripple-effect {
  position: absolute;
  border-radius: 50%;
  background-color: rgb(109, 120, 142);
  color: rgb(109, 120, 142);
  contain: strict;
  opacity: 0;
  animation:
    225ms ease 0s 1 normal forwards running search-seg-ripple,
    75ms ease 0s 1 normal forwards running search-seg-ripple-in;
  will-change: transform, opacity;
  pointer-events: none;
}

.search-seg .ripple-effect.fade-out {
  transform: translate(var(--translate-end)) scale(var(--final-scale, 1));
  animation: 150ms ease 0s 1 normal forwards running search-seg-ripple-out;
}

@keyframes search-seg-ripple {
  0% {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1);
  }
  100% {
    transform: translate(var(--translate-end)) scale(var(--final-scale, 1));
  }
}

@keyframes search-seg-ripple-in {
  0% {
    animation-timing-function: linear;
    opacity: 0;
  }
  100% {
    opacity: 0.294;
  }
}

@keyframes search-seg-ripple-out {
  0% {
    animation-timing-function: linear;
    opacity: 0.294;
  }
  100% {
    opacity: 0;
  }
}
</style>
