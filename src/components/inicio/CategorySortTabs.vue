<script setup lang="ts">
/**
 * Todos / Popular / Recente / Favoritos on /game/category.
 * Live ion-segment.tab-bar: 285×35.33, 4-col grid, gap 8px, margin 0 10px 5px.
 * Idle 1px --divider; checked fill #116fcd, radius 7px.
 */
export interface CategorySortTab {
  key: string
  label: string
}

defineProps<{ tabs: CategorySortTab[]; active: string }>()
const emit = defineEmits<{ select: [key: string] }>()
</script>

<template>
  <div class="tab-bar" role="tablist">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      type="button"
      role="tab"
      class="tab-btn"
      :class="{ on: tab.key === active }"
      :aria-selected="tab.key === active"
      @click="emit('select', tab.key)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  display: grid;
  flex: 0 0 auto;
  width: 17.8125rem;
  height: 2.2083rem;
  margin: 0 0.625rem 0.3125rem;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.5rem;
  overflow: hidden;
}

.tab-btn {
  display: flex;
  height: 1.9583rem;
  margin: 0.125rem 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 0.8125rem;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  color: var(--color-text-100);
  background: transparent;
  border: 0.0625rem solid var(--divider);
  border-radius: 0.4375rem;
}

.tab-btn.on {
  border-color: transparent;
  background-color: #116fcd;
}
</style>
