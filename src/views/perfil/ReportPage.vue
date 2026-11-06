<script setup lang="ts">
/**
 * /user/report — Perfil -> Relatórios.
 *
 * Five tabs over one body: a horizontally scrollable filter row, a list that
 * shows the "Sem Registros" state for this account, and a totals strip on the
 * two tabs that have one. Geometry is the live page at 390x844x3; see
 * docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import ReportFooterCount from '../../components/perfil/ReportFooterCount.vue'
import ReportSegment from '../../components/perfil/ReportSegment.vue'
import ReportSelect from '../../components/perfil/ReportSelect.vue'
import { betGameTypeLabel, betStatusOf, type BetRecord, type ReportFilter } from '../../api/report'
import { useReportStore } from '../../stores/report'
import { showToast } from '../../toast'
import { formatReais } from '../../utils/money'
import { formatDateTime } from '../../utils/timeZone'

const router = useRouter()
const report = useReportStore()
const scroller = ref<HTMLElement>()

// Same nine-dot bubbles as the deposit and withdraw record footers.
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

const layout = computed(() => report.activeTab?.layout ?? 'statement')
const filters = computed((): ReportFilter[] => {
  const tab = report.activeTab
  if (!tab) return []
  if (tab.key !== 'bet') return tab.filters
  return tab.filters.map((filter) =>
    filter.key === 'platform' ? { ...filter, options: report.platformOptions } : filter,
  )
})
const showEmpty = computed(() => report.loaded && !report.loading && report.records.length === 0)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/perfil')
}

function profitText(row: BetRecord) {
  const amount = row.profitAmount
  if (amount == null || amount === 0) return ''
  const text = formatReais(amount)
  return amount > 0 ? `+${text}` : text
}

function profitTone(row: BetRecord) {
  const amount = row.profitAmount
  if (amount == null || amount === 0) return 'white'
  return amount < 0 ? 'red' : 'green'
}

async function copyRound(value: string) {
  if (!value) return
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    /* clipboard can be blocked; the toast still confirms the tap */
  }
  showToast('Cópia Bem-sucedida', 'success')
}

function maybeLoadMore() {
  const el = scroller.value
  if (!el || report.active !== 'bet' || !report.hasMore || report.loading || report.loadingMore) return
  if (el.scrollTop + el.clientHeight < el.scrollHeight - 48) return
  void report.loadMore()
}

watch(
  () => report.records.length,
  async () => {
    await nextTick()
    maybeLoadMore()
  },
)

onMounted(() => void report.load(true))
</script>

<template>
  <div class="ion-page">
    <header class="report-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">{{ tr('Relatórios') }}</span></h1>
      </div>

      <ReportSegment :tabs="report.tabs" :active="report.active" @select="report.selectTab" />
    </header>

    <div v-if="report.activeTab" class="report-body">
      <div class="top">
        <div class="select-scroll">
          <ReportSelect
            v-for="filter in filters"
            :key="`${report.active}-${filter.key}`"
            class="filter"
            :class="layout === 'statement' ? 'statement-select' : 'betting-select'"
            :options="filter.options"
            :model-value="report.activePicks[filter.key]"
            @update:model-value="report.selectFilter(filter.key, $event)"
          />
        </div>
      </div>

      <div ref="scroller" class="page-scroller report-list" @scroll="maybeLoadMore">
        <template v-if="report.active === 'bet'">
          <div v-for="(row, index) in report.records" :key="`${row.id}-${index}`" class="item">
            <div class="num">
              <p class="white">{{ row.platformName }}{{ row.gameType ? ` ${tr(betGameTypeLabel(row.gameType))}` : '' }}</p>
              <p class="amount" :class="profitTone(row)">{{ profitText(row) }}</p>
            </div>
            <div class="num">
              <p class="white">{{ row.gameName }}</p>
              <p :class="betStatusOf(row.status).tone">{{ tr(betStatusOf(row.status).label) }}</p>
            </div>
            <div class="minor">
              <p>{{ formatDateTime(row.createTime) }}</p>
              <div class="copy">
                <p class="round">{{ row.roundNo }}</p>
                <button type="button" class="copy-btn" :aria-label="tr('Copiar')" @click="copyRound(row.roundNo)">
                  <SvgIcon class="copy-icon" name="record-copy" />
                </button>
              </div>
            </div>
          </div>
          <div v-if="report.loadingMore" class="more-loading" role="status" :aria-label="tr('Loading')">
            <span class="bubbles" aria-hidden="true">
              <i
                v-for="(dot, n) in moreDots"
                :key="n"
                :style="{ top: dot.top, left: dot.left, animationDelay: dot.delay }"
              />
            </span>
          </div>
        </template>
        <div v-if="showEmpty" class="empty" :class="{ 'empty-box': layout === 'bet' }">
          <div class="empty-bg-img" />
          <span class="empty-label">{{ tr('Sem Registros') }}</span>
        </div>
      </div>

      <ReportFooterCount v-if="report.activeTab.summary" :summary="report.activeTab.summary" />
    </div>
  </div>
</template>

<style scoped>
/* ion-header: transparent itself, md elevation-4 shadow, above the content. */
.report-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

/* ion-toolbar (ios mode): --background #154084, --min-height 3.125rem,
   --padding-start/end 4px, no border. */
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

/* The back ion-button measures 38x22 at (6,14) with its glyph at (16,17). */
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

/* ion-title (ios mode) is absolute over the whole toolbar with 90px gutters, so
   it needs to let taps through to the button underneath. */
.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.875rem;
  text-align: center;
  pointer-events: none;
}

.title-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.report-body {
  display: flex;
  position: relative;
  flex: 1 1 0%;
  min-height: 0;
  flex-direction: column;
}

.top {
  margin: 0.625rem 0;
  flex: 0 0 auto;
}

.select-scroll {
  display: flex;
  padding: 0 1rem;
  overflow-x: auto;
  font-size: 0.75rem;
  scrollbar-width: none;
}

.select-scroll::-webkit-scrollbar {
  display: none;
}

.select-scroll .filter {
  margin-right: 0.625rem;
}

/* The two bodies inherit different line-heights, which is the only reason the
   live pills measure 28 tall on the statement tabs and 26 on the bet ones. */
.select-scroll .statement-select {
  line-height: 1.125rem;
}

.select-scroll .betting-select {
  line-height: 1rem;
}

/* The nested ion-content.list: --padding-start/end 1rem, scrolls on its own. */
.report-list {
  padding: 0 1rem;
}

.item {
  margin-bottom: 0.625rem;
  padding: 0.625rem;
  border-radius: 0.375rem;
  background: var(--color-bg-200);
}

.num {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.white {
  color: #fff;
}

.green {
  color: #27d48b;
}

.red {
  color: #ee4639;
}

.amount {
  flex: 0 0 auto;
  font-weight: 700;
}

.minor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6d788d;
  font-size: 0.75rem;
  line-height: 1rem;
}

.copy {
  display: flex;
  align-items: center;
}

.round {
  width: 10rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  text-align: right;
}

.copy-btn {
  display: flex;
  margin-left: 0.375rem;
  color: inherit;
}

.copy-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.more-loading {
  display: flex;
  height: 41px;
  align-items: center;
  justify-content: center;
  color: #116fcd;
}

.bubbles {
  position: relative;
  display: block;
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
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* The bet tabs shorten the block, which lifts the artwork off centre. */
.empty.empty-box {
  height: calc(100% - 6.16rem);
}

/* /icons/No_record.png on the live page — the same file this project already
   downloaded for the promo Histórico panel. */
.empty-bg-img {
  width: 7.5rem;
  height: 7.5rem;
  background: url('/images/promo-page/no-record.png') 0 0 / 7.5rem auto no-repeat;
}

.empty-label {
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgb(146, 148, 156);
}
</style>
