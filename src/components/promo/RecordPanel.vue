<script setup lang="ts">
import { ref } from 'vue'
import { dateRanges } from '../../api/filters'
import { formatAmount } from '../../api/promo'
import DropdownSelect from '../base/DropdownSelect.vue'

/**
 * Histórico and Pendente share one component on the live page: same four
 * column titles and same empty state, but Histórico leads with the date filter
 * while Pendente drops it and gains the "Coletar Tudo" footer.
 */
const props = defineProps<{ variant: 'historico' | 'pendente'; bonus: number }>()

const COLUMNS = ['Tempo', 'Nome do Evento', 'Evento de Recompensa', 'Fonte']

const range = ref(dateRanges[0].key)
</script>

<template>
  <div class="record-panel" :class="props.variant">
    <div v-if="props.variant === 'historico'" class="filter-row">
      <DropdownSelect v-model="range" class="date-pill" :options="dateRanges" />
      <div class="bonus">
        {{ tr('Bônus') }}
        <span class="amount emphasis">{{ formatAmount(bonus) }}</span>
      </div>
    </div>

    <div v-else class="bonus-row">
      <div class="bonus">
        {{ tr('Bônus') }}
        <span class="amount emphasis">{{ formatAmount(bonus) }}</span>
      </div>
    </div>

    <div class="table-head">
      <div class="head-row">
        <span v-for="column in COLUMNS" :key="column">{{ tr(column) }}</span>
      </div>
    </div>

    <div class="page-scroller records">
      <!-- Histórico keeps an empty ion-grid above the rows; its 5px padding is
           what pushes the empty state 10px down. Pendente has none. -->
      <div v-if="props.variant === 'historico'" class="rows-spacer" />
      <div class="empty">
        <div class="empty-img" />
        <span>{{ tr('Sem Registros') }}</span>
      </div>
    </div>

    <div v-if="props.variant === 'pendente'" class="footer">
      <button type="button" class="collect-all">{{ tr('Coletar Tudo') }}</button>
    </div>
  </div>
</template>

<style scoped>
/* ion-content: --padding-top 10px, --padding-start/-end 15px, --background
   #090f1f, with the column itself a flex column of head + scroller. */
.record-panel {
  display: flex;
  position: relative;
  flex: 1 1 0%;
  min-height: 0;
  flex-direction: column;
  padding: 0.625rem 0.9375rem 0;
  background-color: #090f1f;
}

/* Only the Histórico column reserves the 72px tab-bar strip; Pendente ends on
   its footer instead. */
.record-panel.historico {
  padding-bottom: 4.5rem;
}

.filter-row {
  display: flex;
  flex: 0 0 auto;
  padding: 0 1rem;
  overflow-x: auto;
  scrollbar-width: none;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #fff;
}

.filter-row::-webkit-scrollbar {
  display: none;
}

/* The pill itself is DropdownSelect; only its `mr-2.5` belongs to this row. */
.date-pill {
  margin-right: 0.625rem;
}

.bonus-row {
  display: flex;
  flex: 0 0 auto;
  margin-bottom: 0.625rem;
  align-items: center;
  font-size: 0.75rem;
}

.bonus {
  flex: 1 1 0%;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: right;
  color: #fff;
}

.amount {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
}

.emphasis {
  color: #fba531;
}

/* ion-grid wrapper: 5px of padding around a row of four ion-cols that carry
   5px of their own, which is what makes the head 52px tall once "Nome do
   Evento" and "Evento de Recompensa" wrap to two lines. */
.table-head {
  flex: 0 0 auto;
  padding: 0.3125rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #fff;
}

.head-row {
  display: flex;
}

.head-row span {
  flex: 1 1 0%;
  padding: 0.3125rem;
  text-align: center;
}

.records {
  background-color: #090f1f;
}

.rows-spacer {
  padding: 0.3125rem;
}

.empty {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Live `.empty-height` resolves to the scroller height minus 46px, which keeps
   the artwork centred under the 10px grid spacer above it. */
.historico .empty {
  height: calc(100% - 2.875rem);
}

.empty-img {
  width: 7.5rem;
  height: 7.5rem;
  background-image: url('/images/promo-page/no-record.png');
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% auto;
}

.footer {
  flex: 0 0 auto;
  width: 100%;
  /* 81.6px on the live row: the tab bar plus the 25.6px it clears. */
  margin-bottom: 5.1rem;
}

.collect-all {
  display: flex;
  width: 10.9375rem;
  height: 2.5rem;
  margin: 0.25rem auto;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fff;
  /* Disabled state: nothing pending to claim. */
  background-color: rgb(98, 98, 98);
  border-radius: 5px;
}
</style>
