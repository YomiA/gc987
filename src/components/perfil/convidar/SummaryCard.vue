<script setup lang="ts">
/**
 * The Comissão / Desempenho cards on /spread.
 *
 * One ion-list.card: a header row that carries the "mais" link and a chevron,
 * then one 44-tall row per figure. Rows are separated by the ios item hairline,
 * which stops 10px short of the right edge and is dropped on the last row.
 */
import SvgIcon from '../../base/SvgIcon.vue'
import type { SpreadSummaryCard } from '../../../api/spread'

defineProps<{ card: SpreadSummaryCard }>()
</script>

<template>
  <section class="card">
    <div class="item">
      <div class="item-inner">
        <span class="title">{{ tr(card.title) }}</span>
        <span class="more">{{ tr(card.more) }}</span>
        <SvgIcon class="chev" name="chevron-forward" />
      </div>
    </div>

    <div
      v-for="(row, index) in card.rows"
      :key="row.label"
      class="item"
    >
      <div class="item-inner" :class="{ last: index === card.rows.length - 1 }">
        <span class="label">{{ tr(row.label) }}</span>
        <span class="value" :class="row.tone">{{ tr(row.value) }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  flex: 0 0 auto;
  padding: 0 0.9375rem;
  margin: 0.625rem 0;
  border-radius: 0.625rem;
  background-color: rgb(16, 22, 41);
}

/* ion-item: 44 tall with 10px of end padding outside the hairline. */
.item {
  display: flex;
  padding-right: 0.625rem;
}

.item-inner {
  display: flex;
  flex: 1 1 0%;
  min-width: 0;
  height: 2.75rem;
  align-items: center;
  border-bottom: 0.03125rem solid rgb(64, 64, 64);
}

.item-inner.last {
  border-bottom: 0;
}

.title {
  flex: 1 1 0%;
  min-width: 0;
  margin-right: 0.5rem;
  font-size: 0.9375rem;
  line-height: 1.40625rem;
  color: var(--color-text-100);
}

.more {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(22, 128, 220);
}

/* ion-item's detail chevron: 14px at 25% opacity, 5px off the hairline end. */
.chev {
  width: 0.875rem;
  height: 0.875rem;
  margin-right: 0.3125rem;
  color: rgb(109, 120, 141);
  opacity: 0.25;
}

.label {
  flex: 1 1 0%;
  min-width: 0;
  margin-right: 0.5rem;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: rgb(155, 167, 190);
}

.value {
  margin-right: 0.625rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

.value.amber {
  color: rgb(251, 165, 49);
}

.value.white {
  color: var(--color-text-100);
}
</style>
