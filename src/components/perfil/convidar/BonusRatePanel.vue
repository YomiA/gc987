<script setup lang="ts">
/**
 * /spread tab 5 — "Taxa de Bônus do Agente".
 *
 * A flex column that fills the 740 viewport: a 360-wide four-tab underline
 * segment, the 48-tall table header, and a nested scroller for the ladder.
 * Slot / Cartas / Pesca share one 20-row table; Cassino has its own 8-row one.
 *
 * The inner ion-segment is a different skin from both ConvidarSegment (pills)
 * and ReportSegment (text-sized 50-tall tabs): four fixed 80px buttons on a
 * 90px grid, 12px labels, a 2px #38a8fa underline.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { SpreadRateRow, SpreadRateTab } from '../../../api/spread'

const props = defineProps<{
  tabs: SpreadRateTab[]
  active: string
  rows: SpreadRateRow[]
}>()

const emit = defineEmits<{ select: [key: string] }>()

const columns = [
  { key: 'level', label: 'nível' },
  { key: 'performance', label: 'desempenho' },
  { key: 'rate', label: 'Taxa de Bônus do Agente' },
]

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
  indicator.value = { left: btn.left - base.left, width: btn.width }
  if (!slides.value) requestAnimationFrame(() => (slides.value = true))
}

onMounted(() => {
  measure()
  if (typeof ResizeObserver !== 'undefined' && row.value) {
    observer = new ResizeObserver(measure)
    observer.observe(row.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => [props.active, props.tabs.length],
  () => requestAnimationFrame(() => measure()),
)
</script>

<template>
  <div class="rate">
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

    <div class="head">
      <div class="grid">
        <span v-for="column in columns" :key="column.key" class="cell">{{ column.label }}</span>
      </div>
    </div>

    <div class="list">
      <div v-for="item in rows" :key="item.level" class="item">
        <div class="item-native">
          <div class="grid row-grid">
            <span class="cell">{{ item.level }}</span>
            <span class="cell">{{ item.performance }}</span>
            <span class="cell rate-cell">{{ item.rate }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* div.agent-bonus-rate: pt 10, no side padding, text-xs, --color-bg-200 on the
   live rule but the computed fill is --color-bg-400 #101629. */
.rate {
  display: flex;
  height: 100%;
  padding: 0.625rem 0 0;
  flex-direction: column;
  font-size: 0.75rem;
  line-height: 1rem;
  background-color: #101629;
}

/* ion-segment.md.segment-scrollable.w-[22.5rem].mx-auto: a 4-column 90px grid
   (80 button + 10 trailing margin) with a 0.8px --divider hairline under it. */
.seg-row {
  display: grid;
  position: relative;
  width: 22.5rem;
  height: calc(2.125rem + 0.8px);
  margin: 0 auto;
  flex: 0 0 auto;
  grid-template-columns: repeat(4, 5.625rem);
  border-bottom: 0.8px solid var(--divider);
}

.seg-btn {
  display: flex;
  position: relative;
  width: 5rem;
  height: 2.125rem;
  margin-right: 0.625rem;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.seg-label {
  margin: 0.375rem 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: rgb(109, 120, 141);
  text-align: center;
  text-transform: capitalize;
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
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ion-item.rate-item-title: 360 wide, 48 tall, mt 8, --color-bg-1200. */
.head {
  display: flex;
  width: 22.5rem;
  height: 3rem;
  margin: 0.5rem auto 0;
  flex: 0 0 auto;
  align-items: center;
  overflow: hidden;
  background-color: rgb(21, 28, 48);
  font-size: 0.625rem;
  color: var(--color-text-100);
}

.grid {
  display: flex;
  width: 100%;
}

.cell {
  display: flex;
  width: 33.3333%;
  padding: 0.3125rem;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.head .grid {
  height: 2.625rem;
}

/* Nested ion-content: fills the leftover 639 and scrolls with the bar hidden. */
.list {
  flex: 1 1 0%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.list::-webkit-scrollbar {
  display: none;
}

/* ion-item.h-[2.5rem]: the host is 40 and clips the Ionic 48 min-height, which
   is why the 26-tall grid sits 11 from the top of the row rather than centred
   in 40. Even hosts carry class `odd` and paint --color-bg-1200 on the native. */
.item {
  width: 22.5rem;
  height: 2.5rem;
  margin: 0 auto;
  overflow: hidden;
  font-size: 0.625rem;
  color: rgb(109, 120, 141);
}

.item-native {
  display: flex;
  height: 3rem;
  min-height: 3rem;
  align-items: center;
}

.item:nth-child(even) .item-native {
  background-color: rgb(21, 28, 48);
}

.row-grid {
  height: 1.625rem;
}

.rate-cell {
  color: var(--color-currency);
}
</style>
