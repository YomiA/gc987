<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PromoTab } from '../../api/promo'

const props = defineProps<{ tabs: PromoTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const row = ref<HTMLElement | null>(null)
/**
 * The live buttons are sized purely by their text (14px Roboto 400 + 10px side
 * padding, summing to a 487px scroll width at a 390px column), so the indicator
 * geometry has to be measured rather than declared. Rects, not offsetWidth: the
 * live widths are fractional (69.2812px under `Eventos`).
 */
const indicator = ref({ left: 0, width: 0 })
/** The live indicator is already in place on first paint; only later moves slide. */
const slides = ref(false)
let observer: ResizeObserver | null = null

function measure() {
  const rowEl = row.value
  const el = rowEl?.querySelector<HTMLElement>('.seg-btn.on')
  if (!rowEl || !el) return
  const btn = el.getBoundingClientRect()
  const base = rowEl.getBoundingClientRect()
  indicator.value = { left: btn.left - base.left + rowEl.scrollLeft, width: btn.width }
  if (!slides.value) requestAnimationFrame(() => (slides.value = true))
}

/**
 * ion-segment centres the checked button in the track whenever the selection
 * changes, clamped by the scroller: at 390 that lands on scrollLeft 58 for
 * `Código de Resgate` and on the 97px maximum for `Histórico` and `Pendente`,
 * which is how the last tab becomes reachable without a manual swipe.
 */
function scrollActiveIntoView(smooth: boolean) {
  const rowEl = row.value
  const el = rowEl?.querySelector<HTMLElement>('.seg-btn.on')
  if (!rowEl || !el) return
  const left = el.offsetLeft - (rowEl.clientWidth / 2 - el.offsetWidth / 2)
  rowEl.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
}

onMounted(() => {
  measure()
  scrollActiveIntoView(false)
  if (typeof ResizeObserver !== 'undefined' && row.value) {
    observer = new ResizeObserver(measure)
    observer.observe(row.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => [props.active, props.tabs.length],
  () =>
    requestAnimationFrame(() => {
      measure()
      scrollActiveIntoView(true)
    }),
)
</script>

<template>
  <header class="seg-header">
    <div ref="row" class="seg-row">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="seg-btn"
        :class="{ on: tab.key === active }"
        @click="emit('select', tab.key)"
      >
        <span class="seg-label">{{ tab.label }}</span>
      </button>
      <span
        class="seg-indicator"
        :class="{ slides }"
        :style="{
          width: `${indicator.width}px`,
          transform: `translate3d(${indicator.left}px, 0, 0)`,
        }"
      />
    </div>
  </header>
</template>

<style scoped>
.seg-header {
  position: relative;
  z-index: 10;
  height: 3.125rem;
  min-height: 3.125rem;
  flex: 0 0 auto;
  background-color: #154084;
}

/* ion-segment.segment-scrollable: padding 0 10px, justify-content left,
   align-items stretch, overflow-x auto with the scrollbar suppressed. */
.seg-row {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0 0.625rem;
  justify-content: flex-start;
  align-items: stretch;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.seg-row::-webkit-scrollbar {
  display: none;
}

.seg-btn {
  display: flex;
  position: relative;
  height: 100%;
  padding: 0 0.625rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  overflow: hidden;
  white-space: nowrap;
}

/* px, not rem: the 14px/22px comes from Ionic's own `ion-segment-button:host`,
   which is outside the site's rem scale, so the label keeps its size when the
   column grows past 390 and the root font size follows it. */
.seg-label {
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  text-align: center;
  color: rgb(109, 120, 141);
  transition: color 0.15s linear;
}

.seg-btn.on .seg-label {
  color: rgb(255, 255, 255);
}

.seg-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.125rem;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
  will-change: transform;
}

.seg-indicator.slides {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
