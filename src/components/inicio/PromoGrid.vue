<script setup lang="ts">
import type { Promo } from '../../api/mock'

const props = defineProps<{ promos: Promo[] }>()

const halves = () => props.promos.filter((p) => p.span === 'half')
const full = () => props.promos.find((p) => p.span === 'full')
</script>

<template>
  <div class="activity">
    <div class="row">
      <div class="col">
        <div v-for="(promo, i) in halves()" :key="promo.id" class="cell" :class="{ spaced: i > 0 }">
          <img :src="promo.image" alt="" />
        </div>
      </div>
      <div class="col col-tall">
        <img v-if="full()" :src="full()!.image" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity {
  width: 24.375rem;
  height: 6.75rem;
  margin-top: 0.625rem;
  padding: 0 0.5625rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

.row {
  display: flex;
  width: 23.25rem;
  height: 6.75rem;
  flex-wrap: wrap;
}

.col {
  position: relative;
  width: 11.625rem;
  height: 6.75rem;
  max-width: 50%;
  padding: 0 0.1875rem;
  flex: 0 0 50%;
}

.cell {
  display: flex;
  width: 11.25rem;
  height: 3.125rem;
  flex-wrap: wrap;
}

.cell.spaced {
  margin-top: 0.4375rem;
}

.cell img {
  width: 11.25rem;
  height: 3.125rem;
  max-width: 100%;
  border-radius: 0.625rem;
}

.col-tall img {
  width: 11.25rem;
  height: 6.75rem;
  max-width: 100%;
  border-radius: 0.625rem;
}
</style>
