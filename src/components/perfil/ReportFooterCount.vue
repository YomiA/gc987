<script setup lang="ts">
/**
 * `ion-row.footer-count`, the totals strip under the list on the Detalhes da
 * Conta and Relatório tabs.
 *
 * Both variants share the .625rem padding, the rgb(26,34,58) bar and the
 * 12px/16px type; they differ in label colour and in whether each value is
 * pushed down by .625rem (which is what makes the statement rows 26 tall and
 * the report rows 16). Values off the live page at 390x844x3 — see
 * docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 */
import { formatAmount } from '../../api/promo'
import type { ReportSummary, ReportSummaryRow } from '../../api/report'

const props = defineProps<{ summary: ReportSummary }>()

function text(row: ReportSummaryRow) {
  return row.format === 'money' ? formatAmount(row.value) : `${row.value}`
}
</script>

<template>
  <div class="footer-count" :class="props.summary.variant">
    <div class="footer-col">
      <div v-for="row in props.summary.rows" :key="row.key" class="content-flex">
        <span class="label">{{ row.label }}</span>
        <div class="value" :class="row.tone">{{ text(row) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer-count {
  padding: 0.625rem;
  flex: 0 0 auto;
  font-size: 0.75rem;
  line-height: 1rem;
  /* --color-bg-50 on the live page, the same rgb(26,34,58) this clone already
     stores as --color-bg-200. */
  background-color: var(--color-bg-200);
}

/* The single full-width ion-col. */
.footer-col {
  padding: 0.3125rem;
}

.content-flex {
  display: flex;
  justify-content: space-between;
}

.content-flex + .content-flex {
  margin-top: 0.625rem;
}

.footer-count.statement .content-flex {
  color: rgb(135, 146, 175);
}

.footer-count.report .content-flex {
  color: var(--color-text-100);
}

/* .amount-display sits 10px lower than its label on the statement tab. */
.footer-count.statement .value {
  margin-top: 0.625rem;
}

.value.green {
  color: rgb(39, 212, 139);
}

.value.red {
  color: rgb(238, 70, 57);
}

/* span.money-text, i.e. --accent-color-orange-1. */
.value.money {
  color: var(--color-currency);
}
</style>
