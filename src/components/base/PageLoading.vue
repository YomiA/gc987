<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const visible = ref(true)
let frame = 0
const started = performance.now()

function finish() {
  visible.value = false
}

function blocksBoot(img: HTMLImageElement) {
  if (!img.getAttribute('src') || img.complete) return false
  if (img.loading !== 'lazy') return true
  const rect = img.getBoundingClientRect()
  return rect.bottom > 0 && rect.top < window.innerHeight
}

function tick() {
  const images = [...document.images]
  const ready = images.length > 0 && !images.some(blocksBoot)
  if (ready || performance.now() - started >= 1800) {
    finish()
    return
  }
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  frame = requestAnimationFrame(tick)
})

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <div v-if="visible" class="page-loading" role="status" aria-label="Loading">
    <svg class="crescent" viewBox="0 0 64 64" aria-hidden="true">
      <circle r="26" transform="translate(32,32)" />
    </svg>
  </div>
</template>

<style scoped>
.page-loading {
  position: fixed;
  z-index: 20010;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.crescent {
  width: 2.5rem;
  height: 2.5rem;
  color: #116fcd;
  animation: spinner-rotate 0.75s linear infinite;
}

.crescent circle {
  fill: transparent;
  stroke: currentColor;
  stroke-width: 4px;
  stroke-dasharray: 128px;
  stroke-dashoffset: 82px;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
