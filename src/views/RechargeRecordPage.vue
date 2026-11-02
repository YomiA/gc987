<script setup lang="ts">
/**
 * /rechargeRecord — Depósito header record icon.
 *
 * Dark ios toolbar, date pill + total, empty mock list. Geometry from
 * docs/research/gc987-com/recharge-record/.
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import WithdrawTimeFilter from '../components/withdraw/WithdrawTimeFilter.vue'
import { rechargeDateRanges, rechargeRecordCopy as copy } from '../api/rechargeRecord'
import { useRechargeRecordStore } from '../stores/rechargeRecord'

const router = useRouter()
const records = useRechargeRecordStore()
const total = computed(() => String(records.totalAmountCents / 100))

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/entrar')
}

onMounted(() => {
  void records.load()
})
</script>

<template>
  <div class="ion-page">
    <header class="rec-header">
      <div class="toolbar">
        <button type="button" class="back" aria-label="Voltar" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ copy.title }}</span>
        </h1>
      </div>
    </header>

    <div class="page-scroller rec-body">
      <div class="top-area">
        <WithdrawTimeFilter
          :options="rechargeDateRanges"
          :model-value="records.dateRange"
          @update:model-value="records.selectDate"
        />
        <div class="total-area">
          {{ copy.totalLabel }}
          <span class="amount">{{ total }}</span>
        </div>
      </div>

      <div class="empty">
        <div class="empty-bg-img" />
        <span class="empty-label">{{ copy.empty }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rec-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
}

/* ion-toolbar.ios: --background #101629, --min-height 3.125rem.
   --padding-start/end stay 4px at 390 and 1440 (not 0.25rem). */
.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 4px;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg-400);
}

/* ion-button 42×50 @(4,0), native padding 0 14px, icon 14×14 @(18,18). */
.back {
  display: flex;
  position: relative;
  z-index: 2;
  width: 2.625rem;
  height: 3.125rem;
  padding: 0 0.875rem;
  margin: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.back-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-text-100);
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 90px;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ion-content.ion-padding keeps --padding 16px on desktop; 1rem would be 19.94px. */
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
</style>
