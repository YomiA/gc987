<script setup lang="ts">
/**
 * /spread tab 3 — "Desempenho".
 *
 * A flex column that fills the 740 viewport instead of scrolling: a
 * 52-tall filter bar (date field + ID search), the 48-tall table header,
 * and the rest given to the list, which is empty for this account.
 */
import { computed, ref } from 'vue'
import DatePickerPopover from '../../base/DatePickerPopover.vue'
import SvgIcon from '../../base/SvgIcon.vue'
import type { SpreadPerformanceColumn, SpreadPerformanceRow } from '../../../api/spread'

const props = defineProps<{
  columns: SpreadPerformanceColumn[]
  rows: SpreadPerformanceRow[]
  date: string
  query: string
}>()

const emit = defineEmits<{ 'update:date': [string]; 'update:query': [string] }>()

const pickerOpen = ref(false)
const anchor = ref<DOMRect | null>(null)
const field = ref<HTMLElement | null>(null)

/** The live field prints the ISO value as YYYY/MM/DD. */
const dateLabel = computed(() => props.date.replace(/-/g, '/'))

function openPicker() {
  anchor.value = field.value?.getBoundingClientRect() ?? null
  pickerOpen.value = true
}
</script>

<template>
  <div class="perf">
    <div class="filters">
      <div ref="field" class="date" @click="openPicker">
        <div class="time-choose">
          <span class="date-text">{{ dateLabel }}</span>
          <SvgIcon class="date-icon" name="spread-calendar" />
        </div>
      </div>

      <div class="search">
        <input
          class="search-input"
          type="search"
          placeholder="ID"
          :value="query"
          @input="emit('update:query', ($event.target as HTMLInputElement).value)"
        />
        <SvgIcon class="search-icon" name="spread-search" />
      </div>
    </div>

    <div class="head">
      <div class="head-grid">
        <span
          v-for="column in columns"
          :key="column.key"
          class="head-cell"
          :style="{ width: column.width }"
          >{{ column.label }}</span
        >
      </div>
    </div>

    <div class="list">
      <div v-if="!rows.length" class="empty">
        <div class="empty-bg-img" />
        <span class="empty-label">Sem Registros</span>
      </div>
    </div>

    <DatePickerPopover
      v-model:open="pickerOpen"
      :model-value="date"
      :anchor="anchor"
      @update:model-value="emit('update:date', $event)"
    />
  </div>
</template>

<style scoped>
/* div.agent-performance: pt 10, px 10, and no scrolling of its own. */
.perf {
  display: flex;
  height: 100%;
  padding: 0.625rem 0.625rem 0;
  flex-direction: column;
  font-size: 0.75rem;
}

.filters {
  display: flex;
  height: 3.25rem;
  padding: 0.625rem;
  justify-content: space-between;
  background-color: rgb(18, 22, 36);
  border-radius: 0.625rem 0.625rem 0 0;
  color: rgb(86, 100, 136);
}

.date {
  display: flex;
  width: 6.125rem;
  padding: 0.125rem 0.25rem;
  justify-content: center;
  align-items: center;
  background-color: rgb(9, 15, 31);
  border-radius: 0.375rem;
}

.time-choose {
  display: flex;
  flex: 1;
  margin-left: 0.3125rem;
  justify-content: space-between;
  align-items: center;
}

.date-text {
  margin: 0.125rem 0;
  font-weight: 700;
  line-height: 1rem;
  color: var(--color-text-100);
}

.date-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-100);
}

/* ion-searchbar: the host only pads the left, the input carries the pill. */
.search {
  display: flex;
  position: relative;
  flex: 1;
  padding-left: 0.5rem;
  align-items: center;
  overflow: hidden;
}

.search-input {
  width: 100%;
  height: 1.65625rem;
  padding: 0.375rem 0.75rem 0.375rem 0.3125rem;
  background-color: rgb(9, 15, 31);
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-text-100);
}

.search-input::placeholder {
  color: rgb(86, 100, 136);
}

.search-input::-webkit-search-cancel-button {
  display: none;
}

.search-icon {
  position: absolute;
  right: 0.25rem;
  width: 0.875rem;
  height: 0.875rem;
  color: rgb(155, 167, 190);
}

/* ion-item.performance-item-title, whose native part starts 10 in. */
.head {
  display: flex;
  height: 3rem;
  padding-left: 0.625rem;
  align-items: center;
  background-color: rgb(21, 28, 48);
  font-size: 0.6875rem;
  color: var(--color-text-100);
}

.head-grid {
  display: flex;
  width: 21.5rem;
  height: 2rem;
}

.head-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1rem;
  text-align: center;
}

.list {
  flex: 1;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* /icons/No_record.png, already downloaded for the promo Histórico panel. */
.empty-bg-img {
  width: 7.5rem;
  height: 7.5rem;
  margin-top: 9rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}

.empty-label {
  margin-bottom: 0.3125rem;
  font-size: 0.875rem;
  line-height: 1.375rem;
  color: rgb(99, 100, 105);
}
</style>
