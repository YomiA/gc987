<script setup lang="ts">
/**
 * /withdrawSubView — Saque header record icon.
 *
 * Two toolbar tabs, no TabBar. Empty mock lists. Geometry from
 * docs/research/gc987-com/withdraw-sub-view/.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import WithdrawAuditSelect from '../components/withdraw/WithdrawAuditSelect.vue'
import WithdrawTimeFilter from '../components/withdraw/WithdrawTimeFilter.vue'
import {
  formatAmount,
  withdrawAuditFilters,
  withdrawDateRanges,
  withdrawSubCopy as copy,
  type WithdrawSubTab,
} from '../api/withdrawRecord'
import { useWithdrawRecordStore } from '../stores/withdrawRecord'

const TABS: { key: WithdrawSubTab; label: string }[] = [
  { key: 'saques', label: copy.saquesTab },
  { key: 'auditoria', label: copy.auditTab },
]

const router = useRouter()
const records = useWithdrawRecordStore()
const row = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, width: 0 })
const slides = ref(false)
let observer: ResizeObserver | null = null

const saquesTotal = computed(() => String(records.saquesTotalCents / 100))

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/withdraw')
}

function measure() {
  const rowEl = row.value
  const el = rowEl?.querySelector<HTMLElement>('.seg-btn.on')
  if (!rowEl || !el) return
  const btn = el.getBoundingClientRect()
  const base = rowEl.getBoundingClientRect()
  indicator.value = { left: btn.left - base.left, width: btn.width }
  if (!slides.value) requestAnimationFrame(() => (slides.value = true))
}

watch(
  () => records.tab,
  () => requestAnimationFrame(measure),
)

onMounted(() => {
  void records.load()
  requestAnimationFrame(measure)
  if (typeof ResizeObserver !== 'undefined' && row.value) {
    observer = new ResizeObserver(measure)
    observer.observe(row.value)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="ion-page">
    <header class="sub-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <div ref="row" class="seg-row">
          <button
            v-for="tab in TABS"
            :key="tab.key"
            type="button"
            class="seg-btn"
            :class="{ on: records.tab === tab.key }"
            @click="records.selectTab(tab.key)"
          >
            <span class="seg-label" :class="{ on: records.tab === tab.key }">{{ tab.label }}</span>
          </button>
          <span
            class="seg-indicator"
            :class="{ slides }"
            :style="{
              width: `${indicator.width}px`,
              transform: `translate3d(${indicator.left}px, 0, 0)`,
            }"
          />
        </div>
      </div>
    </header>

    <div class="page-scroller sub-body" :class="records.tab">
      <div v-if="records.tab === 'saques'" class="top-area">
        <WithdrawTimeFilter
          :options="withdrawDateRanges"
          :model-value="records.dateRange"
          @update:model-value="records.selectDate"
        />
        <div class="total-area">
          {{ copy.totalLabel }}
          <span class="amount success">{{ saquesTotal }}</span>
        </div>
      </div>

      <div v-else class="audit-header">
        <p class="detail-text">
          {{ copy.auditLabel }}
          <span class="amount currency">{{ formatAmount(records.auditAmountCents) }}</span>
        </p>
        <WithdrawAuditSelect
          :options="withdrawAuditFilters"
          :model-value="records.auditFilter"
          @update:model-value="records.selectAudit"
        />
      </div>

      <div class="empty">
        <div class="empty-bg-img" />
        <span class="empty-label">{{ copy.empty }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sub-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 0.25rem;
  align-items: center;
  overflow: hidden;
  background-color: #154084;
}

/* ion-back-button 38×22 @(6,14), glyph @(16,17) — same as /user/report. */
.back {
  display: flex;
  width: 2.375rem;
  height: 1.375rem;
  padding-left: 0.125rem;
  margin: 0 0.125rem;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
}

.back-icon {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  color: var(--color-text-100);
}

.seg-row {
  display: flex;
  position: relative;
  height: 3.125rem;
  flex: 1 1 auto;
  justify-content: flex-start;
  align-items: stretch;
}

.seg-btn {
  display: flex;
  position: relative;
  min-width: 5.625rem;
  height: 3.125rem;
  padding: 0 0.5rem;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  background: transparent;
}

.seg-label {
  max-width: 100%;
  overflow: hidden;
  font-size: 0.78rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: rgb(109, 120, 141);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.seg-label.on {
  color: #fff;
}

.seg-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  will-change: transform;
}

.seg-indicator.slides {
  transition:
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.sub-body {
  padding: 1rem;
  background-color: var(--color-bar-bg);
}

.top-area {
  display: flex;
  height: 2rem;
  margin: 0 0 0.625rem;
  align-items: center;
  justify-content: space-between;
}

.total-area {
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.125rem;
  color: #fff;
}

.amount.success {
  color: #27d48b;
}

.audit-header {
  display: flex;
  height: 2.25rem;
  margin: 0 0 0.625rem;
  align-items: center;
  justify-content: space-between;
}

.detail-text {
  margin: 0;
  width: 12.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: #fff;
}

.amount.currency {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--color-currency);
}

.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.saques .empty {
  height: 18rem;
}

.auditoria .empty {
  height: 17.25rem;
}

.empty-bg-img {
  width: 7.5rem;
  height: 7.5rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}

.saques .empty-bg-img {
  margin-top: 9rem;
}

.auditoria .empty-bg-img {
  margin-top: 8.5rem;
}

.empty-label {
  color: rgb(99, 100, 105);
}

.saques .empty-label {
  font-size: 1rem;
  line-height: 1.5rem;
}

.auditoria .empty-label {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
