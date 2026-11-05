<script setup lang="ts">
/**
 * The three-tab strip under the /notification toolbar.
 *
 * Same idea as PromoSegment (intrinsic 14px labels, measured underline) but a
 * different skin: the bar is #090f1f with a --divider hairline, labels are
 * 14px/500, idle `rgb(109,120,141)` / checked white, and the 2px indicator is
 * solid `#38a8fa` rather than the promo gradient.
 *
 * Live slots an `ion-button.base-tab` / `.selected-tab` inside each
 * `ion-segment-button` (layout-icon-top). The native host pads 2px 20px; the
 * inner button is 30px tall (`1.875rem`) with `margin: 16px 2px 0` and
 * `--padding-bottom: .3125rem`, which puts the glyph at y=72 rather than
 * vertically centering it in the 50px row. Side padding 20+2 keeps the live
 * 93.5 / 115.9 / 95.4 widths at 390.
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { NotificationTab } from '../../../api/notification'

const props = defineProps<{ tabs: NotificationTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const row = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, width: 0 })
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

function measureSoon() {
  void nextTick(() => {
    measure()
    requestAnimationFrame(() => {
      measure()
      requestAnimationFrame(measure)
    })
  })
}

onMounted(() => {
  measureSoon()
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    void document.fonts.ready.then(measure)
  }
  if (typeof ResizeObserver !== 'undefined' && row.value) {
    observer = new ResizeObserver(measure)
    observer.observe(row.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => [props.active, props.tabs.length],
  () => measureSoon(),
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
      <span class="seg-label">{{ tr(tab.label) }}</span>
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
/* tab-box already pads 16px; the row is 50 + the 1px hairline = 51. */
.seg-row {
  display: flex;
  position: relative;
  height: calc(3.125rem + 0.0625rem);
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

/* ion-segment-button native: padding 2px 20px. Do not center the label —
   the slotted ion-button sits under a 16px top margin. */
.seg-btn {
  display: flex;
  position: relative;
  height: 3.125rem;
  padding: 0.125rem 1.25rem;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
}

/* ion-button.base-tab / .selected-tab: height 1.875rem, 14px/22px/500,
   margin 16px 2px 0, --padding-bottom .3125rem. */
.seg-label {
  display: flex;
  height: 1.875rem;
  margin: 1rem 0.125rem 0;
  padding: 0 0 0.3125rem;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.375rem;
  text-align: center;
  color: rgb(109, 120, 141);
  transition: color 0.15s linear;
}

.seg-btn.on .seg-label {
  color: var(--color-text-100);
}

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
