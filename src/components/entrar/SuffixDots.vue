<script setup lang="ts">
/**
 * Original deposit button suffixLoading: ".", "..", "..." every 500ms
 * while the request is in flight, then nothing.
 */
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{ on: boolean }>()
const dots = ref('')
let timer = 0

watch(
  () => props.on,
  (active) => {
    window.clearInterval(timer)
    dots.value = ''
    if (!active) return
    let step = 0
    const tick = () => {
      dots.value = '.'.repeat(step % 4)
      step += 1
    }
    tick()
    timer = window.setInterval(tick, 500)
  },
  { immediate: true },
)

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>{{ dots }}</template>
