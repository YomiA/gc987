<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import type { ProviderTab } from '../../api/mock'

const props = defineProps<{ tabs: ProviderTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

/**
 * Geometry from the live DOM, in rem so it tracks the root font size:
 * 0.875rem wrapper padding, 3.75rem buttons, 0.625rem gap, 0.5rem indicator.
 */
const PAD_LEFT = 0.875
const BUTTON_W = 3.75
const GAP = 0.625
const LINE_W = 0.5

const scrollLeft = ref(0)

const activeIndex = computed(() => props.tabs.findIndex((t) => t.key === props.active))

/** Distance from the track's left edge to the indicator, in rem. */
const lineOffset = computed(() => {
  if (activeIndex.value < 0) return 0
  return activeIndex.value * (BUTTON_W + GAP) + (BUTTON_W - LINE_W) / 2
})

/**
 * The layout half is a rem so it scales; the scroll half stays px because
 * `scrollLeft` is a real pixel measurement.
 */
const lineTransform = computed(
  () => `translateX(calc(${PAD_LEFT + lineOffset.value}rem - ${scrollLeft.value}px))`,
)

const segmentEl = ref<HTMLElement | null>(null)

function onScroll(event: Event) {
  scrollLeft.value = (event.target as HTMLElement).scrollLeft
}

function emitSelect(key: string) {
  emit('select', key)
}

watch(
  () => props.active,
  () => {
    void nextTick(() => {
      const root = segmentEl.value
      const btn = root?.querySelector<HTMLElement>('.segment-button.checked')
      if (!root || !btn) return
      const left = btn.offsetLeft - (root.clientWidth - btn.offsetWidth) / 2
      root.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
    })
  },
)
</script>

<template>
  <div class="segment-wrapper">
    <div ref="segmentEl" class="segment" @scroll.passive="onScroll">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="segment-button"
        :class="{ checked: tab.key === active }"
        @click="emitSelect(tab.key)"
      >
        <span class="btn-wall">
          <SvgIcon v-if="tab.icon" class="type-icon" :name="tab.icon" />
          <i
            v-else
            class="type-img"
            :style="{ backgroundPosition: tab.spritePosition ?? undefined }"
          />
          <span class="label-wall">
            <span class="label">{{ tab.label }}</span>
          </span>
        </span>
      </button>
    </div>
    <div class="line" :style="{ transform: lineTransform }" />
  </div>
</template>

<style scoped>
.segment-wrapper {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  width: 24.375rem;
  height: 4.125rem;
  margin-top: 0.75rem;
  margin-bottom: 1.25rem;
  padding: 0 0.875rem;
  background-color: var(--color-bar-bg);
}

.segment {
  display: flex;
  position: relative;
  z-index: 0;
  width: 22.625rem;
  height: 4.125rem;
  justify-content: start;
  align-items: stretch;
  gap: 0.625rem;
  text-align: center;
  overflow-x: auto;
  overflow-y: hidden;
  background-color: var(--segment-track-bg);
  border-radius: 0.5rem;
  scrollbar-width: none;
}

.segment::-webkit-scrollbar {
  display: none;
}

.segment-button {
  display: flex;
  position: relative;
  width: 3.75rem;
  min-width: min-content;
  height: 4.125rem;
  flex: 0 0 auto;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-radius: 0.4375rem;
  transition: 0.1s linear;
}

.btn-wall {
  display: flex;
  width: 3.75rem;
  height: 4.125rem;
  padding: 0 0.1875rem 0.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 0.125rem;
  line-height: normal;
}

.type-icon {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 2.25rem;
}

.type-img {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 2.25rem;
  background-image: url('/images/bg/platform-sprite.png');
  background-size: 800% 500%;
  opacity: 0.6;
}

.segment-button.checked .type-img {
  opacity: 1;
}

.label-wall {
  display: flex;
  width: 3.375rem;
  height: 1.125rem;
  justify-content: center;
  align-items: center;
}

.label {
  max-width: 3.375rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgb(255, 255, 255);
  text-overflow: ellipsis;
  overflow: hidden;
}

.segment-button.checked .label {
  font-weight: 600;
}

.line {
  position: absolute;
  top: 3.90625rem;
  left: 0;
  z-index: 10;
  width: 0.5rem;
  height: 0.125rem;
  background-color: var(--segment-indicator-line);
  border-radius: 0.125rem;
  box-shadow: rgb(148, 255, 127) 0 0 0.25rem 0;
  transition: transform 0.3s ease-in-out;
}
</style>
