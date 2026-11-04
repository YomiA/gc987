<script setup lang="ts">
/**
 * /withdrawSubView — Saque header record icon.
 *
 * Registro de Saques loads POST /cashOutOrderRecord. The day window uses the
 * site timezone. Status is not sent. Auditoria stays the empty mock.
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import WithdrawAuditSelect from '../components/withdraw/WithdrawAuditSelect.vue'
import WithdrawTimeFilter from '../components/withdraw/WithdrawTimeFilter.vue'
import {
  formatAmount,
  withdrawAuditFilters,
  withdrawDateRanges,
  withdrawStatusText,
  withdrawSubCopy as copy,
  type WithdrawSubTab,
} from '../api/withdrawRecord'
import { useWithdrawRecordStore } from '../stores/withdrawRecord'
import { showToast } from '../toast'
import { formatDateTime } from '../utils/timeZone'

const TABS: { key: WithdrawSubTab; label: string }[] = [
  { key: 'saques', label: copy.saquesTab },
  { key: 'auditoria', label: copy.auditTab },
]

const router = useRouter()
const records = useWithdrawRecordStore()
const row = ref<HTMLElement | null>(null)
const scroller = ref<HTMLElement | null>(null)
const indicator = ref({ left: 0, width: 0 })
const slides = ref(false)
let observer: ResizeObserver | null = null

const moreDots = [
  { top: '0%', left: '32%', delay: '-1000ms' },
  { top: '20.5692%', left: '24.5134%', delay: '-888.889ms' },
  { top: '31.5138%', left: '5.55674%', delay: '-777.778ms' },
  { top: '27.7128%', left: '-16%', delay: '-666.667ms' },
  { top: '10.9446%', left: '-30.0702%', delay: '-555.556ms' },
  { top: '-10.9446%', left: '-30.0702%', delay: '-444.444ms' },
  { top: '-27.7128%', left: '-16%', delay: '-333.333ms' },
  { top: '-31.5138%', left: '5.55674%', delay: '-222.222ms' },
  { top: '-20.5692%', left: '24.5134%', delay: '-111.111ms' },
]

function statusOf(code: number) {
  return withdrawStatusText[code] ?? { label: String(code), color: '#8792af' }
}

function amountOf(value: number) {
  return formatAmount(Math.round(Number(value) * 100))
}

async function copyText(value: string) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    /* clipboard can be blocked; the toast still confirms the tap */
  }
  showToast(copy.copied, 'success')
}

function maybeLoadMore() {
  const el = scroller.value
  if (!el || records.tab !== 'saques' || el.clientHeight === 0) return
  if (!records.hasMore || records.loading || records.loadingMore) return
  if (el.scrollTop + el.clientHeight < el.scrollHeight - 48) return
  void records.load(false)
}

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

watch(
  () => records.records.length,
  async () => {
    await nextTick()
    maybeLoadMore()
  },
)

onMounted(() => {
  void records.load(true)
  void records.loadAudit()
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

    <div ref="scroller" class="page-scroller sub-body" :class="records.tab" @scroll="maybeLoadMore">
      <div v-if="records.tab === 'saques'" class="top-area">
        <WithdrawTimeFilter
          :options="withdrawDateRanges"
          :model-value="records.dateRange"
          @update:model-value="records.selectDate"
        />
        <div class="total-area">
          {{ copy.totalLabel }}
          <span class="amount success">{{ formatAmount(records.totalAmountCents) }}</span>
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

      <template v-if="records.tab === 'saques'">
        <div v-if="records.loading" class="list-loading" role="status" aria-label="Loading">
          <span class="dots" aria-hidden="true">
            <i v-for="n in 8" :key="n" :style="{ '--i': n - 1 }" />
          </span>
        </div>

        <div v-else-if="records.records.length === 0" class="empty">
          <div class="empty-bg-img" />
          <span class="empty-label">{{ copy.empty }}</span>
        </div>

        <div v-for="row in records.records" :key="row.id" class="record-wrap">
          <div class="line top">
            <p class="name">{{ copy.name }}</p>
            <p class="money">{{ amountOf(row.orderAmt) }}</p>
          </div>
          <div class="line middle">
            <p class="time">{{ formatDateTime(row.orderTime) }}</p>
          </div>
          <div class="line bottom">
            <p class="order-line">
              <span class="order-no">{{ row.transactionId || row.id }}</span>
              <button
                type="button"
                class="copy"
                aria-label="Copiar"
                @click="copyText(row.transactionId || String(row.id))"
              >
                <SvgIcon class="copy-icon" name="record-copy" />
              </button>
            </p>
            <span class="status" :style="{ color: statusOf(row.status).color }">{{ statusOf(row.status).label }}</span>
          </div>
        </div>

        <div v-if="records.loadingMore" class="more-loading" role="status" aria-label="Loading">
          <span class="bubbles" aria-hidden="true">
            <i
              v-for="(dot, n) in moreDots"
              :key="n"
              :style="{ top: dot.top, left: dot.left, animationDelay: dot.delay }"
            />
          </span>
        </div>
      </template>

      <div v-else class="empty">
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

.list-loading,
.more-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #116fcd;
}

.list-loading {
  height: 18rem;
  color: #1680dc;
}

.dots,
.bubbles {
  position: relative;
  display: block;
}

.dots {
  width: 1.75rem;
  height: 1.75rem;
}

.dots i {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.3125rem;
  height: 0.3125rem;
  margin: -0.15625rem;
  border-radius: 50%;
  background-color: currentColor;
  transform: rotate(calc(var(--i) * 45deg)) translateY(-0.625rem);
  animation: spinner-dots 0.9s linear infinite;
  animation-delay: calc(var(--i) * -0.1125s);
}

.more-loading {
  height: 41px;
}

.bubbles {
  width: 28px;
  height: 28px;
}

.bubbles i {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  animation: spinner-scale-out 1s linear infinite;
}

.bubbles i::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4.375px;
  height: 4.375px;
  margin: -2.1875px 0 0 -2.1875px;
  border-radius: 50%;
  background: currentColor;
}

@keyframes spinner-dots {
  0%,
  70%,
  100% {
    opacity: 0.25;
  }
  35% {
    opacity: 1;
  }
}

@keyframes spinner-scale-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.record-wrap {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5625rem 0.625rem 0.5rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: var(--color-bg-200);
}

.line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}

.top {
  margin-bottom: 1rem;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.3125rem;
}

.name,
.money,
.time,
.order-line {
  margin: 0;
}

.middle {
  margin-bottom: 0.375rem;
  color: #6d788d;
  font-size: 0.75rem;
  line-height: 1.125rem;
}

.bottom {
  color: #9ba7be;
  font-size: 0.75rem;
  line-height: 1.8125rem;
}

.order-line {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
}

.order-no {
  min-width: 0;
  overflow: hidden;
  font-size: 0.75rem;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.copy {
  display: inline-flex;
  flex: 0 0 auto;
  margin-left: 0.1875rem;
  padding: 0;
  align-items: center;
  color: #9ba7be;
  background: transparent;
  cursor: pointer;
}

.copy-icon {
  width: 1.8rem;
  height: 1.8rem;
  color: #9ba7be;
}

.status {
  flex: 0 0 auto;
  margin-left: 0.5rem;
  font-size: 0.625rem;
  line-height: 1.8125rem;
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
