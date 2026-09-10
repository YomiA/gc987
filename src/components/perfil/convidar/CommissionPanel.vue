<script setup lang="ts">
/**
 * /spread tab 4 — "Comissão".
 *
 * Same flex column as "Desempenho" — a filter bar, the 48-tall table header,
 * then the list — but the filter is a date *range* plus a game-category
 * select, and the empty art hangs 9.1rem below the header with the leftover
 * height parked in a trailing flex-1 rather than centring itself.
 *
 * The range field drives one calendar twice, which is what the live page does:
 * the first "Feito" commits the start and collapses the range onto it, then
 * the picker reopens with that day as its lower bound for the end.
 */
import { computed, nextTick, ref } from 'vue'
import AbSelect from '../../base/AbSelect.vue'
import DatePickerPopover from '../../base/DatePickerPopover.vue'
import SvgIcon from '../../base/SvgIcon.vue'
import type {
  SpreadCommissionColumn,
  SpreadCommissionRow,
  SpreadCommissionType,
} from '../../../api/spread'

const props = defineProps<{
  columns: SpreadCommissionColumn[]
  types: SpreadCommissionType[]
  rows: SpreadCommissionRow[]
  start: string
  end: string
  type: string
}>()

const emit = defineEmits<{
  'update:start': [string]
  'update:end': [string]
  'update:type': [string]
}>()

/** 0 closed, 1 picking the start, 2 picking the end. */
const step = ref(0)
const pickerOpen = ref(false)
const anchor = ref<DOMRect | null>(null)
const field = ref<HTMLElement | null>(null)
/** Set once the start is committed, so the close hands over to the end. */
const chaining = ref(false)

/** The live picker reaches exactly one year back from now. */
const minStart = computed(() => {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
})

const pickerValue = computed(() => (step.value === 2 ? props.end : props.start))
const pickerMin = computed(() => (step.value === 2 ? props.start : minStart.value))

function openRange() {
  anchor.value = field.value?.getBoundingClientRect() ?? null
  chaining.value = false
  step.value = 1
  pickerOpen.value = true
}

function onPicked(value: string) {
  if (step.value === 1) {
    emit('update:start', value)
    chaining.value = true
    return
  }
  emit('update:end', value)
}

async function onPickerOpen(open: boolean) {
  pickerOpen.value = open
  if (open) return
  if (!chaining.value) {
    step.value = 0
    return
  }
  chaining.value = false
  step.value = 2
  await nextTick()
  pickerOpen.value = true
}
</script>

<template>
  <div class="comm">
    <div class="filters">
      <div class="select-date" @click="openRange">
        <div ref="field" class="date">
          <div class="time-choose">
            <p class="range-part" :class="{ on: step === 1 }">{{ start }}</p>
            <span class="separator">～</span>
            <p class="range-part" :class="{ on: step === 2 }">{{ end }}</p>
            <SvgIcon class="date-icon" name="spread-calendar" />
          </div>
        </div>
      </div>

      <AbSelect
        :options="types"
        :model-value="type"
        @update:model-value="emit('update:type', $event)"
      />
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

    <!-- The live list slot, which stays 0-tall while there is nothing to show. -->
    <div class="rows" />

    <div v-if="!rows.length" class="empty">
      <div class="empty-bg-img" />
      <span class="empty-label">Sem Registros</span>
    </div>

    <div class="tail" />

    <DatePickerPopover
      :open="pickerOpen"
      :model-value="pickerValue"
      :min="pickerMin"
      :anchor="anchor"
      @update:open="onPickerOpen"
      @update:model-value="onPicked"
    />
  </div>
</template>

<style scoped>
/* div.agent-commission: pt 10, px 10, text-xs, and no scrolling of its own. */
.comm {
  display: flex;
  height: 100%;
  padding: 0.625rem 0.625rem 0;
  flex-direction: column;
  font-size: 0.75rem;
  line-height: 1rem;
}

/* div.select-item, whose 48.2 height comes from the select's min-height. */
.filters {
  display: flex;
  padding: 0.625rem;
  justify-content: space-between;
  background-color: rgb(18, 22, 36);
  border-radius: 0.625rem 0.625rem 0 0;
  color: rgb(143, 156, 180);
}

.select-date {
  display: flex;
  padding: 0.125rem 0.25rem;
  align-items: center;
  background-color: rgb(9, 15, 31);
  border-radius: 0.375rem;
}

/* The inner box the calendar hangs off; it is 4.2 shorter than the field. */
.date {
  display: flex;
  padding: 0.125rem 0.25rem;
  justify-content: space-between;
  align-items: center;
}

.time-choose {
  display: flex;
  flex: 1;
  margin-left: 0.3125rem;
  justify-content: space-between;
  align-items: center;
}

/* The end being picked is underlined, which makes that line 1 taller. */
.range-part.on {
  border-bottom: 1px solid rgb(22, 128, 220);
}

.separator {
  margin: 0 0.25rem;
  font-weight: 700;
}

.date-icon {
  width: 1rem;
  height: 1rem;
  margin: 0.125rem 0 0.125rem 0.25rem;
}

/* ion-item.commission-item-title, whose native part starts 10 in and whose
   inner part keeps Ionic's 16 end padding, leaving the grid 344 wide. */
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

.rows {
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin-top: 9.1rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}

.empty-label {
  margin-bottom: 0.3125rem;
  font-size: 0.875rem;
  line-height: 1.375rem;
  color: rgb(99, 100, 105);
}

/* The live column ends with an empty flex-1, so the art does not re-centre. */
.tail {
  flex: 1;
}
</style>
