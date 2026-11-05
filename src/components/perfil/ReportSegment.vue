<script setup lang="ts">
/**
 * The five-tab scroller under the Relatórios toolbar.
 *
 * Live is `ion-segment.segment-scrollable` + per-button
 * `.segment-button-indicator`. Switching FLIPs the new underline from the
 * previous button's box with translate3d + scaleX (250ms, cubic-bezier
 * .4,0,.2,1); color is 0.15s linear. Click also fires ion-ripple-effect
 * (bounded, currentColor). See REPORT_PAGE.spec.md.
 */
import { ref, watch } from 'vue'
import type { ReportTab } from '../../api/report'

const RIPPLE_PADDING = 10
const RIPPLE_ORIGIN = 0.5
const RIPPLE_HOLD_MS = 325

const props = defineProps<{ tabs: ReportTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const row = ref<HTMLElement | null>(null)
/** Mirrors the store, but updates on pointer-up so the ink + bar start now. */
const picked = ref(props.active)

watch(
  () => props.active,
  (next) => {
    if (next === picked.value) return
    const prev = picked.value
    picked.value = next
    if (prev) animateIndicator(prev, next)
    scrollActiveIntoView(next, true)
  },
)

function select(key: string) {
  if (key === picked.value) return
  const prev = picked.value
  picked.value = key
  animateIndicator(prev, key)
  scrollActiveIntoView(key, true)
  emit('select', key)
}

function animateIndicator(prev: string, next: string) {
  const rowEl = row.value
  if (!rowEl || !prev || !next) return
  const prevInd = rowEl.querySelector<HTMLElement>(`[data-key="${CSS.escape(prev)}"] .seg-indicator`)
  const nextInd = rowEl.querySelector<HTMLElement>(`[data-key="${CSS.escape(next)}"] .seg-indicator`)
  if (!prevInd || !nextInd) return
  const prevRect = prevInd.getBoundingClientRect()
  const nextRect = nextInd.getBoundingClientRect()
  if (prevRect.width < 1 || nextRect.width < 1) return
  for (const el of rowEl.querySelectorAll<HTMLElement>('.seg-indicator')) {
    for (const anim of el.getAnimations()) anim.cancel()
  }
  const from = `translate3d(${prevRect.left - nextRect.left}px, 0, 0) scaleX(${prevRect.width / nextRect.width})`
  nextInd.animate([{ transform: from }, { transform: 'translate3d(0, 0, 0) scaleX(1)' }], {
    duration: 250,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  })
}

/**
 * ion-segment centres the checked button in the track, then clamps. At 390:
 * Detalhes → 0, Recordes → 16, Aposta Esportiva / Relatório / Outros → 146
 * (the max). That is why 2 and 3 “run to the middle” and the last two stay put.
 */
function scrollActiveIntoView(key: string, smooth: boolean) {
  const rowEl = row.value
  const el = rowEl?.querySelector<HTMLElement>(`[data-key="${CSS.escape(key)}"]`)
  if (!rowEl || !el) return
  const left = el.offsetLeft - (rowEl.clientWidth / 2 - el.offsetWidth / 2)
  rowEl.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
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
  ink.style.width = `${initial}px`
  ink.style.height = `${initial}px`
  ink.style.backgroundColor = getComputedStyle(host).color
  ink.style.setProperty('--final-scale', String(scale))
  ink.style.setProperty('--translate-end', `${width * 0.5 - x}px, ${height * 0.5 - y}px`)
  host.appendChild(ink)
  const wait = Math.max(RIPPLE_HOLD_MS - 225, 0)
  const fade = () => {
    window.removeEventListener('pointerup', fade)
    window.removeEventListener('pointercancel', fade)
    window.setTimeout(() => {
      ink.classList.add('fade-out')
      ink.addEventListener('animationend', () => ink.remove(), { once: true })
    }, wait)
  }
  window.addEventListener('pointerup', fade)
  window.addEventListener('pointercancel', fade)
}

/** ion-ripple-effect.addRipple — one bounded layer on the 50px host. */
function addRipple(event: PointerEvent) {
  if (event.button !== 0) return
  spawnRipple(event.currentTarget as HTMLElement, event.clientX, event.clientY)
}
</script>

<template>
  <div ref="row" class="seg-row report-seg" role="tablist">
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
      <span class="seg-label">{{ tr(tab.label) }}</span>
      <span class="seg-indicator" />
    </button>
  </div>
</template>

<style scoped>
/* ion-segment.segment-scrollable: 358 wide inside the 390 header, justify left,
   align stretch, overflow-x auto with the scrollbar suppressed, hairline track
   under the row (rgb(26,35,62) = --divider). */
.seg-row {
  display: flex;
  position: relative;
  /* 50px of buttons plus the hairline under them, which is how the live header
     comes out 101 tall next to the 50px toolbar. */
  height: calc(3.125rem + 0.0625rem);
  margin: 0 1rem;
  flex: 0 0 auto;
  justify-content: flex-start;
  align-items: stretch;
  border-bottom: 0.0625rem solid var(--divider);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.seg-row::-webkit-scrollbar {
  display: none;
}

/* ion-segment-button: no padding of its own, 12.8px apart, text-only width.
   Last button drops the gap (live computed margin-right: 0). */
.seg-btn {
  display: flex;
  position: relative;
  margin-right: 0.8rem;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.6);
}

.seg-btn:last-child {
  margin-right: 0;
}

.seg-btn.on {
  color: var(--color-segment-md-indicator);
}

/* px, not rem: the 14px/40px comes from Ionic's own `ion-segment-button:host`,
   which sits outside the site's rem scale, so labels keep their size when the
   column grows past 390 and the root font size follows it.
   `capitalize` is the live rule, which is why "Detalhes da Conta" paints as
   "Detalhes Da Conta". */
.seg-label {
  position: relative;
  z-index: 1;
  font-size: 14px;
  font-weight: 400;
  line-height: 40px;
  text-align: center;
  text-transform: capitalize;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.15s linear;
}

.seg-btn.on .seg-label {
  color: var(--color-segment-md-indicator);
}

/* Per-button .segment-button-indicator: 2px, FLIPped from the previous box.
   transform-origin left matches Ionic's 0px 1px origin on the 2px bar. */
.seg-indicator {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 2px;
  background-color: var(--color-segment-md-indicator);
  opacity: 0;
  pointer-events: none;
  transform-origin: left center;
  will-change: transform;
}

.seg-btn.on .seg-indicator {
  opacity: 1;
}
</style>

<style>
/* Unscoped so JS-created ripple nodes (no data-v-*) get the keyframes.
   Live ion-ripple-effect is a single currentColor ink at 0.16. */
.report-seg .ripple-effect {
  position: absolute;
  border-radius: 50%;
  contain: strict;
  opacity: 0;
  animation:
    225ms ease 0s 1 normal forwards running report-seg-ripple,
    75ms ease 0s 1 normal forwards running report-seg-ripple-in;
  will-change: transform, opacity;
  pointer-events: none;
}

.report-seg .ripple-effect.fade-out {
  transform: translate(var(--translate-end)) scale(var(--final-scale, 1));
  animation: 150ms ease 0s 1 normal forwards running report-seg-ripple-out;
}

@keyframes report-seg-ripple {
  0% {
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1);
  }
  100% {
    transform: translate(var(--translate-end)) scale(var(--final-scale, 1));
  }
}

@keyframes report-seg-ripple-in {
  0% {
    animation-timing-function: linear;
    opacity: 0;
  }
  100% {
    opacity: 0.16;
  }
}

@keyframes report-seg-ripple-out {
  0% {
    animation-timing-function: linear;
    opacity: 0.16;
  }
  100% {
    opacity: 0;
  }
}
</style>
