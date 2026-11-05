<script setup lang="ts">
/**
 * The pill tab strip under the /spread toolbar.
 *
 * Unlike the promo/report segments there is no sliding indicator here: the live
 * `--indicator-*` transition is `none`, so the checked pill just swaps its own
 * background for the gradient. Widths are intrinsic (label + 13px each side),
 * which is what makes the strip 735 wide inside a 370 viewport.
 */
import { ref, watch } from 'vue'
import type { SpreadTab } from '../../../api/spread'

const props = defineProps<{ tabs: SpreadTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()

const items = ref<HTMLElement[]>([])
const scroller = ref<HTMLElement | null>(null)

/** Ionic centres the checked pill in the strip, clamped to the scroll range. */
watch(
  () => props.active,
  (key) => {
    const index = props.tabs.findIndex((tab) => tab.key === key)
    const pill = items.value[index]
    const track = scroller.value
    if (!pill || !track) return
    const pillBox = pill.getBoundingClientRect()
    const trackBox = track.getBoundingClientRect()
    track.scrollLeft +=
      pillBox.left + pillBox.width / 2 - (trackBox.left + trackBox.width / 2)
  },
)
</script>

<template>
  <div class="tab-box">
    <div ref="scroller" class="seg-scroll">
      <div class="btn-wrap">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          ref="items"
          class="btn-item-wrap"
        >
          <button
            type="button"
            class="pill"
            :class="{ on: tab.key === active }"
            @click="emit('select', tab.key)"
          >
            {{ tr(tab.label) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* div.tab-box: 10px of padding on rgb(9,15,31), clipping the strip. */
.tab-box {
  flex: 0 0 auto;
  padding: 0.625rem;
  overflow: hidden;
  background-color: rgb(9, 15, 31);
}

/* ion-segment.segment-scrollable: transparent, 8px radius, scrolls sideways
   with no visible bar. */
.seg-scroll {
  display: flex;
  height: 2.125rem;
  justify-content: flex-start;
  border-radius: 0.5rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.seg-scroll::-webkit-scrollbar {
  display: none;
}

.btn-wrap {
  display: flex;
  width: max-content;
  justify-content: space-evenly;
}

.btn-item-wrap {
  position: relative;
  flex: 0 0 auto;
  margin-right: 0.625rem;
}

/* ion-segment-button: 30 tall in the 34 row, 11.2px label, 13px gutters. */
.pill {
  display: flex;
  height: 1.875rem;
  min-height: 1.75rem;
  padding: 0 0.8125rem;
  margin: 0.125rem 0;
  justify-content: center;
  align-items: center;
  border-radius: 0.4375rem;
  background-color: rgb(17, 21, 36);
  font-size: 0.7rem;
  font-weight: 400;
  color: var(--color-text-100);
  white-space: nowrap;
}

.pill.on {
  background: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.16);
}
</style>
