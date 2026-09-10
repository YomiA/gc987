<script setup lang="ts">
/**
 * /user/report — Perfil -> Relatórios.
 *
 * Five tabs over one body: a horizontally scrollable filter row, a list that
 * shows the "Sem Registros" state for this account, and a totals strip on the
 * two tabs that have one. Geometry is the live page at 390x844x3; see
 * docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import ReportFooterCount from '../../components/perfil/ReportFooterCount.vue'
import ReportSegment from '../../components/perfil/ReportSegment.vue'
import ReportSelect from '../../components/perfil/ReportSelect.vue'
import { useReportStore } from '../../stores/report'

const router = useRouter()
const report = useReportStore()

const layout = computed(() => report.activeTab?.layout ?? 'statement')
const showEmpty = computed(() => report.loaded && !report.loading && report.records.length === 0)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/perfil')
}

onMounted(() => void report.load())
</script>

<template>
  <div class="ion-page">
    <header class="report-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">Relatórios</span></h1>
      </div>

      <ReportSegment :tabs="report.tabs" :active="report.active" @select="report.selectTab" />
    </header>

    <div v-if="report.activeTab" class="report-body">
      <div class="top">
        <div class="select-scroll">
          <ReportSelect
            v-for="filter in report.activeTab.filters"
            :key="`${report.active}-${filter.key}`"
            class="filter"
            :class="layout === 'statement' ? 'statement-select' : 'betting-select'"
            :options="filter.options"
            :model-value="report.activePicks[filter.key]"
            @update:model-value="report.selectFilter(filter.key, $event)"
          />
        </div>
      </div>

      <div class="page-scroller report-list">
        <div v-if="showEmpty" class="empty" :class="{ 'empty-box': layout === 'bet' }">
          <div class="empty-bg-img" />
          <span class="empty-label">Sem Registros</span>
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
