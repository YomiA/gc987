<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { LayoutBanner } from '../../api/home'
import { isClosablePopup } from '../../utils/homePopup'
import { openRoutePath } from '../../utils/routePath'

const props = defineProps<{ items: LayoutBanner[] }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const track = ref<HTMLElement | null>(null)
const active = ref(0)

/** closeRule 2 hides the close button while that slide is showing. */
const closable = computed(() => isClosablePopup(props.items[active.value]))

function onScroll() {
  const el = track.value
  if (!el || !el.clientWidth) return
  active.value = Math.min(Math.round(el.scrollLeft / el.clientWidth), props.items.length - 1)
}

/** A popup that cannot be closed stays open after its link is followed. */
function onPick(item: LayoutBanner) {
  if (openRoutePath(router, item.routePath) && isClosablePopup(item)) emit('close')
}
</script>

<template>
  <div class="popup-mask">
    <div class="popup-box">
      <div ref="track" class="track" @scroll.passive="onScroll">
        <button
          v-for="(item, index) in items"
          :key="item.id ?? index"
          type="button"
          class="slide"
          @click="onPick(item)"
        >
          <img :src="item.picPath" alt="" />
        </button>
      </div>
      <div v-if="items.length > 1" class="dots">
        <span v-for="(item, index) in items" :key="item.id ?? index" :class="{ on: index === active }" />
      </div>
      <button v-if="closable" type="button" class="close" :aria-label="tr('Fechar')" @click="emit('close')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Under the PWA modal (20008) and the login dialog, over the tab bar. */
.popup-mask {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20007;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.popup-box {
  display: flex;
  width: 20rem;
  flex-direction: column;
  align-items: center;
}

.track {
  display: flex;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.track::-webkit-scrollbar {
  display: none;
}

.slide {
  display: block;
  flex: 0 0 100%;
  padding: 0;
  border: 0;
  background: none;
  scroll-snap-align: center;
  cursor: pointer;
}

.slide img {
  display: block;
  width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 0.625rem;
}

.dots {
  display: flex;
  margin-top: 0.625rem;
  gap: 0.375rem;
}

.dots span {
  width: 0.375rem;
  height: 0.375rem;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
}

.dots span.on {
  background-color: #fff;
}

.close {
  display: flex;
  width: 2.25rem;
  height: 2.25rem;
  margin-top: 1rem;
  padding: 0;
  justify-content: center;
  align-items: center;
  color: #fff;
  background: none;
  border: 2px solid #fff;
  border-radius: 50%;
  cursor: pointer;
}

.close svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
