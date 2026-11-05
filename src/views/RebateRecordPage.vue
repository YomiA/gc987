<script setup lang="ts">
/**
 * `/activity/rebate/record` — Rebate panel Histórico.
 *
 * Empty mock list. Geometry from https://gc987.com/activity/rebate/record
 * at 390x844x3. Live first pill rendered the i18n key `sort.`; the clone
 * uses Tempo. Mock only.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DropdownSelect from '../components/base/DropdownSelect.vue'
import SvgIcon from '../components/base/SvgIcon.vue'
import { dateRanges } from '../api/filters'
import { rebatePlatforms, rebateRecordCopy as copy } from '../api/activity'

const router = useRouter()
const range = ref(dateRanges[0]?.key ?? 'today')
const platform = ref(rebatePlatforms[0]?.key ?? 'all')
const filterRow = ref<HTMLElement | null>(null)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/promo')
}
</script>

<template>
  <div class="ion-page">
    <header class="rec-header">
      <div class="toolbar">
        <button type="button" class="back" :aria-label="tr('Voltar')" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ tr(copy.title) }}</span>
        </h1>
      </div>
    </header>

    <div class="page-scroller rec-body">
      <div ref="filterRow" class="filter-row">
        <DropdownSelect v-model="range" class="time-pill" :options="dateRanges" :anchor="filterRow" />
        <DropdownSelect
          v-model="platform"
          class="platform-pill"
          :options="rebatePlatforms"
          :anchor="filterRow"
        />
        <span class="col-label">{{ tr(copy.betCol) }}</span>
        <span class="col-label rate">{{ tr(copy.rateCol) }}</span>
      </div>

      <div class="empty">
        <div class="empty-img" />
        <span>{{ tr(copy.empty) }}</span>
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
  margin: 0;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.875rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rec-body {
  padding: 1rem;
  background-color: var(--color-bar-bg);
}

.filter-row {
  display: flex;
  height: 32px;
  margin: 10px 0;
  align-items: center;
}

.time-pill {
  width: 88.5px;
  max-height: 1.5rem;
  flex: 0 0 auto;
}

.platform-pill {
  width: 113.3px;
  max-height: 1.5rem;
  margin-left: 10px;
  flex: 0 0 auto;
}

.col-label {
  width: 62.1px;
  margin-left: auto;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
}

.col-label.rate {
  margin-left: 12px;
  margin-right: 0;
}

.empty {
  display: flex;
  margin: 0;
  padding-top: 9rem;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.4);
}

.empty-img {
  width: 7.5rem;
  height: 7.5rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}
</style>
