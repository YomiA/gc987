<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Banner } from '../../api/mock'

const props = defineProps<{ banners: Banner[] }>()

/**
 * Swiper params read off the live instance: loop, slidesPerView 1,
 * spaceBetween 0, speed 300, autoplay delay 2500.
 */
const SPEED = 300
const DELAY = 2500

const index = ref(0)
const animating = ref(true)
let timer: number | undefined

/** Head clone appended so the wrap-around keeps sliding forward. */
const slides = computed(() =>
  props.banners.length ? [...props.banners, props.banners[0]] : [],
)

function advance() {
  if (!props.banners.length) return
  animating.value = true
  index.value += 1
  if (index.value === props.banners.length) {
    window.setTimeout(() => {
      animating.value = false
      index.value = 0
    }, SPEED)
  }
}

onMounted(() => {
  timer = window.setInterval(advance, DELAY)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <div class="poster">
    <div
      class="track"
      :style="{
        transform: `translate3d(-${index * 100}%, 0, 0)`,
        transitionDuration: animating ? `${SPEED}ms` : '0ms',
      }"
    >
      <div v-for="(banner, i) in slides" :key="`${banner.id}-${i}`" class="slide">
        <img class="poster-img" :src="banner.image" alt="" />
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
}
</style>
