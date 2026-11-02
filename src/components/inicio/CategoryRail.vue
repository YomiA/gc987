<script setup lang="ts">
/**
 * Left 85px platform rail on /game/category. Live ion-content.side +
 * ion-segment.custom-segment: 75×62 buttons, 16px gap, ALL uses
 * ELECTRONIC_on.png, the rest the homepage platform sprite.
 */
import type { CategoryPlatform } from '../../api/mock'

defineProps<{ platforms: CategoryPlatform[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()
</script>

<template>
  <nav class="rail" aria-label="Plataformas">
    <button
      v-for="item in platforms"
      :key="item.key"
      type="button"
      class="rail-btn"
      :class="{ on: item.key === active }"
      @click="emit('select', item.key)"
    >
      <img
        v-if="item.key === '0'"
        class="rail-img"
        src="/images/sort/ELECTRONIC_on.png"
        alt=""
      />
      <i
        v-else
        class="rail-sprite"
        :style="{ backgroundPosition: item.spritePosition ?? undefined }"
      />
      <span class="rail-label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.rail {
  display: flex;
  flex: 0 0 5.3125rem;
  width: 5.3125rem;
  height: 100%;
  padding: 0 0 0 0.625rem;
  flex-direction: column;
  align-items: stretch;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: none;
}

.rail::-webkit-scrollbar {
  display: none;
}

.rail-btn {
  display: flex;
  width: 4.6875rem;
  height: 3.875rem;
  margin: 0 0 1rem;
  padding: 0.25rem 0 0;
  flex: 0 0 3.875rem;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: var(--color-text-100);
  background-color: #191e2d;
  border-radius: 0.375rem;
  text-transform: capitalize;
}

.rail-btn.on {
  background-color: transparent;
  background-image: var(--color-bg-tab-on);
}

.rail-img,
.rail-sprite {
  width: 2.375rem;
  height: 2.375rem;
  flex: 0 0 2.375rem;
  object-fit: contain;
}

.rail-sprite {
  background-image: url('/images/bg/platform-sprite.png');
  background-size: 800% 500%;
  opacity: 0.4;
}

.rail-btn.on .rail-sprite {
  opacity: 1;
}

.rail-label {
  width: 3.3867rem;
  max-height: 2rem;
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  text-align: center;
  text-transform: none;
  color: var(--color-text-100);
}
</style>
