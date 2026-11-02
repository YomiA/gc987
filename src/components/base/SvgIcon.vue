<script setup lang="ts">
/**
 * Renders one of the SVG files captured from the live page.
 * The raw markup is inlined so `currentColor` and the embedded
 * filters/gradients keep working exactly as on the original.
 */
import { computed } from 'vue'

const sources = import.meta.glob('../../assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const registry: Record<string, string> = Object.fromEntries(
  Object.entries(sources).map(([path, markup]) => [
    path.slice(path.lastIndexOf('/') + 1, -4),
    markup,
  ]),
)

const props = defineProps<{ name: string }>()

const markup = computed(() => registry[props.name] ?? '')
</script>

<template>
  <span class="svg-icon" aria-hidden="true" v-html="markup" />
</template>

<style scoped>
.svg-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  line-height: 0;
}

.svg-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
}

/* Ionicon outline glyphs (the chevrons) ship without a fill rule. */
.svg-icon :deep(.ionicon-fill-none) {
  fill: none;
  stroke: currentColor;
}

.svg-icon :deep(.ionicon) {
  fill: currentColor;
}

/* Outline ionicons also carry `.ionicon`; keep fill none after the rule above. */
.svg-icon :deep(.ionicon-fill-none) {
  fill: none;
  stroke: currentColor;
}

.svg-icon :deep(.ionicon-stroke-width) {
  stroke-width: 32px;
}
</style>
