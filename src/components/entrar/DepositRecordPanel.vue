<script setup lang="ts">
/**
 * Deposit record body: date pill, running total, and the original card list.
 * The selected day window is sent. Status is not. The first fetch shows the dots spinner.
 * Scrolling to the end loads the next page of 10 and shows the original
 * 28px bubbles spinner until that page returns.
 */
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import WithdrawTimeFilter from '../withdraw/WithdrawTimeFilter.vue'
import {
  rechargeDateRanges,
  rechargeRecordCopy as copy,
  rechargeStatusText,
} from '../../api/rechargeRecord'
import { useRechargeRecordStore } from '../../stores/rechargeRecord'
import { showToast } from '../../toast'
import { formatAmount } from '../../utils/money'
import { formatDateTime } from '../../utils/timeZone'

const records = useRechargeRecordStore()
const scroller = ref<HTMLElement>()

// Ionic spinner-bubbles: nine circles, each a full-size layer offset from
// the 28px host, scaling from 1 to 0 over 1s.
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
  return rechargeStatusText[code] ?? { label: String(code), color: '#8792af' }
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
  if (!el || el.clientHeight === 0 || !records.hasMore || records.loading || records.loadingMore) return
  if (el.scrollTop + el.clientHeight < el.scrollHeight - 48) return
  void records.load(false)
}

watch(
  () => records.records.length,
  async () => {
    await nextTick()
    maybeLoadMore()
  },
)

function onVisible() {
  if (document.visibilityState !== 'visible') return
  void records.load(true)
}

onMounted(() => {
  void records.load(true)
  document.addEventListener('visibilitychange', onVisible)
})

onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisible))
</script>

<template>
  <div ref="scroller" class="page-scroller rec-body" @scroll="maybeLoadMore">
    <div class="top-area">
      <WithdrawTimeFilter
        :options="rechargeDateRanges"
        :model-value="records.dateRange"
        @update:model-value="records.selectDate"
      />
      <div class="total-area">
        {{ tr(copy.totalLabel) }}
        <span class="amount">{{ formatAmount(records.totalAmountCents) }}</span>
      </div>
    </div>

    <div v-if="records.loading" class="list-loading" role="status" :aria-label="tr('Loading')">
      <span class="dots" aria-hidden="true">
        <i v-for="n in 8" :key="n" :style="{ '--i': n - 1 }" />
      </span>
    </div>

    <div v-else-if="records.records.length === 0" class="empty">
      <div class="empty-bg-img" />
      <span class="empty-label">{{ tr(copy.empty) }}</span>
    </div>

    <div v-for="row in records.records" :key="row.id" class="record-wrap">
      <div class="line top">
        <p class="name">{{ tr(copy.name) }}</p>
        <p class="money">{{ tr(amountOf(row.orderAmt)) }}</p>
      </div>
      <div class="line middle">
        <p class="time">{{ formatDateTime(row.orderTime) }}</p>
      </div>
      <div class="line bottom">
        <p class="order-line">
          <span class="order-no">{{ tr(row.transactionId || row.id) }}</span>
          <button type="button" class="copy" :aria-label="tr('Copiar')" @click="copyText(row.transactionId || String(row.id))">
            <SvgIcon class="copy-icon" name="record-copy" />
          </button>
        </p>
        <span class="status" :style="{ color: statusOf(row.status).color }">{{ tr(statusOf(row.status).label) }}</span>
      </div>
    </div>

    <div v-if="records.loadingMore" class="more-loading" role="status" :aria-label="tr('Loading')">
      <span class="bubbles" aria-hidden="true">
        <i
          v-for="(dot, n) in moreDots"
          :key="n"
          :style="{ top: dot.top, left: dot.left, animationDelay: dot.delay }"
        />
      </span>
    </div>
  </div>
</template>

<style scoped>
.rec-body {
  padding: 16px;
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
  color: var(--color-text-100);
}

.amount {
  display: inline-flex;
  align-items: center;
  color: #27d48b;
  font-weight: 700;
}

.list-loading,
.more-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-loading {
  color: #1680dc;
}

.more-loading {
  color: #116fcd;
}

.list-loading {
  height: 18rem;
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
  border-radius: 50%;
  background-color: currentColor;
}

.dots i {
  width: 0.3125rem;
  height: 0.3125rem;
  margin: -0.15625rem;
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

.empty {
  display: flex;
  height: 18rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.empty-bg-img {
  width: 7.5rem;
  height: 7.5rem;
  margin-top: 9rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}

.empty-label {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5rem;
  color: rgb(99, 100, 105);
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
  vertical-align: middle;
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
</style>
