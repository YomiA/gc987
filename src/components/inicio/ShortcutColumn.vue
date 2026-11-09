<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { LayoutShortcut } from '../../api/home'
import { openRoutePath } from '../../utils/routePath'

defineProps<{ side: 'left' | 'right'; items: LayoutShortcut[] }>()

const router = useRouter()
</script>

<template>
  <div v-if="items.length" class="shortcuts" :class="side">
    <button
      v-for="(item, index) in items"
      :key="index"
      type="button"
      class="shortcut"
      @click="openRoutePath(router, item.routePath)"
    >
      <img :src="item.showImg" alt="" />
    </button>
  </div>
</template>

<style scoped>
/* Stacked above the support button (left) and the TOP button (right), each
   column centred on the 2.5rem button below it. The right column keeps TOP's
   slot even while TOP is hidden, so it does not jump when TOP appears. */
.shortcuts {
  display: flex;
  position: absolute;
  z-index: 50;
  flex-direction: column;
  gap: 0.5rem;
}

.shortcuts.left {
  left: 0.75rem;
  bottom: calc(4.25rem + 2.5rem + 0.5rem + var(--sab));
}

.shortcuts.right {
  right: 1rem;
  bottom: calc(3.5rem + 1rem + 2.5rem + 0.5rem + var(--sab));
}

.shortcut {
  display: block;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}

.shortcut img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
