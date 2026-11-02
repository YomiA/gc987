<script setup lang="ts">
/**
 * `/activity/:type/:id` — Eventos card detail.
 *
 * Assistance chrome from https://gc987.com/activity/Assistance/3734@style_0
 * at 390x844x3. Other types reuse this layout for now. Receber stays
 * `.unable` while claimable is 0. Mock only — never posts to gc987.com.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import {
  activityCountdownEnd,
  getActivityDetail,
  remainingParts,
} from '../api/activity'
import { formatAmount } from '../api/promo'

const route = useRoute()
const router = useRouter()
const clock = ref(remainingParts(activityCountdownEnd))
let tick = 0

const detail = computed(() =>
  getActivityDetail(String(route.params.type || ''), String(route.params.id || '')),
)

const canReceive = computed(() => detail.value.claimableCents > 0)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/promo')
}

onMounted(() => {
  tick = window.setInterval(() => {
    clock.value = remainingParts(activityCountdownEnd)
  }, 1000)
})

onBeforeUnmount(() => {
  window.clearInterval(tick)
})
</script>

<template>
  <div class="ion-page">
    <header class="act-header">
      <div class="toolbar">
        <button type="button" class="back" aria-label="Voltar" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ detail.title }}</span>
        </h1>
      </div>
    </header>

    <div class="page-scroller act-body">
      <div class="stack">
        <div class="banner" :style="{ backgroundImage: `url(${detail.banner})` }">
          <div class="countdown">
            <div class="tick">
              <p class="digit">{{ clock.day }}</p>
              <span class="unit">DAY</span>
            </div>
            <div class="tick">
              <p class="digit">{{ clock.hrs }}</p>
              <span class="unit">HRS</span>
            </div>
            <div class="tick">
              <p class="digit">{{ clock.min }}</p>
              <span class="unit">MIN</span>
            </div>
          </div>
        </div>

        <div class="caption-row">
          <span class="caption">{{ detail.countdownCaption }}</span>
        </div>

        <p class="rescue-title">{{ detail.rescueTitle }}</p>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ detail.lossCol }}</th>
                <th>{{ detail.claimCol }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tier in detail.tiers" :key="tier.loss">
                <th class="loss">{{ tier.loss }}</th>
                <th class="rate">{{ tier.rate }}</th>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="week-title">{{ detail.weekTitle }}</p>

        <div class="profit">
          <div class="profit-col">
            <p class="profit-label">{{ detail.myLossLabel }}</p>
            <p class="profit-value">R$ {{ formatAmount(detail.myLossCents) }}</p>
          </div>
          <div class="profit-col">
            <p class="profit-label">{{ detail.claimableLabel }}</p>
            <p class="profit-value">R$ {{ formatAmount(detail.claimableCents) }}</p>
          </div>
        </div>

        <div class="rules">
          <div class="rules-head">{{ detail.rulesTitle }}</div>
          <div class="rules-wrap">
            <p class="rule-item">{{ detail.rules.join('\n\n') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="act-footer">
      <button type="button" class="receive" :class="{ unable: !canReceive }" disabled>
        {{ detail.receive }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.act-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
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

.back {
  display: flex;
  width: 2.375rem;
  height: 1.375rem;
  padding-left: 0.125rem;
  margin: 0 0.125rem;
  justify-content: flex-start;
  align-items: center;
}

.back-icon {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  color: var(--color-text-100);
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
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
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.act-body {
  padding: 1rem 1rem 7rem;
  background-color: var(--color-bar-bg);
}

.stack {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner {
  position: relative;
  width: 100%;
  height: 9.375rem;
  overflow: hidden;
  color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0.625rem;
}

.countdown {
  display: flex;
  position: absolute;
  top: 1.25rem;
  left: 0.625rem;
  gap: 6px;
}

.tick {
  width: 35px;
  height: 30px;
  padding-top: 4px;
  overflow: hidden;
  text-align: center;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 5px;
}

.digit {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 14px;
}

.unit {
  display: block;
  font-size: 10px;
  font-weight: 400;
  line-height: 8px;
}

.caption-row {
  margin: 14px 0;
  text-align: center;
}

.caption {
  display: inline-block;
  padding: 4px 6px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: #fff;
  background-color: var(--color-bg-400);
  border-radius: 5px;
}

.rescue-title,
.week-title {
  margin: 0 0 8px;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 21px;
  color: #fff;
}

.week-title {
  margin: 20px 0 8px;
  font-weight: 900;
}

.table-wrap {
  width: 100%;
  overflow: hidden;
  border: 1px solid rgb(42, 50, 78);
  border-radius: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.875rem;
  line-height: 1.875rem;
}

th {
  padding: 0;
  font-stretch: 100%;
}

thead th {
  width: 50%;
  height: 30.33px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  background-color: var(--color-bg-400);
}

tbody th {
  width: 50%;
  height: 30.67px;
  font-weight: 700;
  background-color: var(--color-bg-400);
}

.loss {
  color: #fff;
}

.rate {
  font-weight: 400;
  color: #fba531;
}

.profit {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.profit-col {
  width: calc(50% - 10px);
  padding: 8px 5px;
  text-align: center;
  border: 1px solid rgb(42, 50, 78);
  border-radius: 5px;
}

.profit-label {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: rgba(255, 255, 255, 0.5);
}

.profit-value {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  line-height: 16px;
  color: #fff;
}

.rules {
  width: 100%;
  margin: 20px 0 0;
}

.rules-head {
  margin: 0 0 20px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: rgba(255, 255, 255, 0.4);
}

.rules-wrap {
  padding: 10px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.4);
  background-color: var(--color-bg-400);
  border-radius: 10px;
}

.rule-item {
  margin: 0;
  white-space: pre-wrap;
}

.act-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 20;
  width: 100%;
  max-width: var(--app-max-width);
  height: 80px;
  padding-top: 20px;
  background-color: #191e2d;
  box-shadow: var(--divider) 0 0.5px 0 0 inset;
  transform: translateX(-50%);
}

.receive {
  display: block;
  width: 280px;
  height: 40px;
  margin: 0 auto;
  font-size: 16px;
  font-weight: 400;
  line-height: 40px;
  color: #fff;
  text-align: center;
  background-color: rgb(98, 98, 98);
  border-radius: 10px;
}

.receive.unable {
  pointer-events: none;
}
</style>
