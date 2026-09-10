<script setup lang="ts">
/**
 * The five-tab scroller under the Relatórios toolbar.
 *
 * Same shape as the /main/promo segment but a different skin: no bar
 * background, a hairline track under it, 40px-tall labels and a solid #38a8fa
 * underline instead of the gradient one. Numbers are the live
 * `ion-segment.segment-scrollable` at 390x844x3 — see
 * docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ReportTab } from '../../api/report'

const props = defineProps<{ tabs: ReportTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const row = ref<HTMLElement | null>(null)
/**
 * Live buttons are sized by their text alone (14px, fractional widths such as
 * 115.344px under `Detalhes da Conta`), so the underline has to be measured.
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
 * ion-segment brings the checked button into view with *nearest* alignment, not
 * centred: with `Outros` checked the live scrollLeft is 145.89, exactly
 * `offsetLeft + offsetWidth - clientWidth`, which is what makes the last tab
 * reachable without a manual swipe.
 */
function scrollActiveIntoView(smooth: boolean) {
  const rowEl = row.value
  const el = rowEl?.querySelector<HTMLElement>('.seg-btn.on')
  if (!rowEl || !el) return
  const start = el.offsetLeft
  const end = start + el.offsetWidth
  let left = rowEl.scrollLeft
  if (start < left) left = start
  else if (end > left + rowEl.clientWidth) left = end - rowEl.clientWidth
  if (left === rowEl.scrollLeft) return
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
  <div ref="row" class="seg-row">
    <button
      v-for="tab in props.tabs"
      :key="tab.key"
      type="button"
      class="seg-btn"
      :class="{ on: tab.key === props.active }"
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

/* ion-segment-button: no padding of its own, 12.8px apart, text-only width. */
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
}

/* px, not rem: the 14px/40px comes from Ionic's own `ion-segment-button:host`,
   which sits outside the site's rem scale, so labels keep their size when the
   column grows past 390 and the root font size follows it.
   `capitalize` is the live rule, which is why "Detalhes da Conta" paints as
   "Detalhes Da Conta". */
.seg-label {
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

/* .segment-button-indicator, 2px on the track. The live one is FLIPped from the
   previous button's box with translate + scaleX; transitioning the measured box
   is the same picture for a 2px solid bar. */
.seg-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.125rem;
  background-color: var(--color-segment-md-indicator);
  will-change: transform;
}

.seg-indicator.slides {
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
