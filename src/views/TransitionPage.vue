<script setup lang="ts">
/**
 * /transition — the loading page the original site opens the moment Lobby is
 * clicked. The game frame is already gone. Home opens after /logoutTransfer
 * succeeds.
 */
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logoutTransfer } from '../api/home'
import { showToast } from '../toast'

const router = useRouter()
let alive = true

onMounted(async () => {
  try {
    await logoutTransfer()
  } catch (error) {
    showToast(error instanceof Error ? error.message : String(error), 'error')
  }
  if (!alive) return
  await router.replace('/main/inicio')
})

onBeforeUnmount(() => {
  alive = false
})
</script>

<template>
  <div class="ion-page transition-page">
    <div class="spinner" role="status" :aria-label="tr('Loading')">
      <svg class="crescent" viewBox="0 0 64 64" aria-hidden="true">
        <circle r="26" transform="translate(32,32)" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.transition-page {
  background-color: #000;
}

.spinner {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.crescent {
  width: 2.5rem;
  height: 2.5rem;
  color: #1680dc;
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
