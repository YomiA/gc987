<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { formatAmount, type VipLevel } from '../../api/promo'
import { vipSubTabs } from '../../stores/promo'

const props = defineProps<{
  levels: VipLevel[]
  info: { level: number; nextLevel: number; remainingBet: number; progressBet: number; progressTarget: number }
  rules: string[]
  retentionRules: string[]
  subTab: string
}>()
const emit = defineEmits<{ selectSubTab: [key: string] }>()

/**
 * Ten crowns cover 26 levels: the live table swaps artwork every two levels
 * (V0/V1 -> vip0-10, V2/V3 -> vip11-20 ... V18 and up -> vip91-100) and the
 * badge text takes the tier colour on the same pairing.
 */
const CROWNS = [
  'vip0-10',
  'vip11-20',
  'vip21-30',
  'vip31-40',
  'vip41-50',
  'vip51-60',
  'vip61-70',
  'vip71-80',
  'vip81-90',
  'vip91-100',
]

const BADGE_COLORS = [
  'rgb(117, 117, 117)',
  'rgb(206, 126, 54)',
  'rgb(103, 136, 164)',
  'rgb(139, 108, 181)',
  'rgb(255, 143, 1)',
  'rgb(0, 110, 241)',
  'rgb(244, 16, 134)',
  'rgb(245, 59, 20)',
  'rgb(240, 20, 245)',
  'rgb(255, 5, 1)',
]

function tier(level: number) {
  return Math.min(Math.floor(level / 2), 9)
}

function crown(level: number) {
  return `/images/promo-page/vip/${CROWNS[tier(level)]}.png`
}

function badgeColor(level: number) {
  return BADGE_COLORS[tier(level)]
}

/** Column titles of the sticky head; the retention tab has no head at all. */
const heads = computed(() => {
  switch (props.subTab) {
    case 'daily':
      return ['Nível', 'Bônus Diário']
    case 'weekly':
      return ['Nível', 'Bônus Semanal']
    case 'monthly':
      return ['Nível', 'Bônus Mensal']
    default:
      return ['Nível', 'Aposta necessária', 'Bônus']
  }
})

function reward(level: VipLevel) {
  switch (props.subTab) {
    case 'daily':
      return level.dailyReward
    case 'weekly':
      return level.weeklyReward
    case 'monthly':
      return level.monthlyReward
    default:
      return level.promotionReward
  }
}

const progress = computed(() =>
  props.info.progressTarget ? props.info.progressBet / props.info.progressTarget : 0,
)

const subRow = ref<HTMLElement | null>(null)

/**
 * Live ion-segment centres the checked button in the 358px track, then
 * clamps to [0, scrollWidth - clientWidth]. That is how Bônus Mensal and
 * Instruções para manter o nível land fully in view (scrollLeft 193 / 295
 * at 390). offsetLeft is wrong here: the sticky parent is the offsetParent
 * because of `position: sticky`, so geometry is taken from rects.
 */
function scrollActiveIntoView(smooth: boolean) {
  const rowEl = subRow.value
  const el = rowEl?.querySelector<HTMLElement>('.sub-btn.on')
  if (!rowEl || !el) return
  const btn = el.getBoundingClientRect()
  const base = rowEl.getBoundingClientRect()
  const left = rowEl.scrollLeft + (btn.left - base.left) - (rowEl.clientWidth / 2 - btn.width / 2)
  rowEl.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' })
}

onMounted(() => {
  requestAnimationFrame(() => scrollActiveIntoView(false))
})

watch(
  () => props.subTab,
  () => {
    void nextTick(() => requestAnimationFrame(() => scrollActiveIntoView(true)))
  },
)
</script>

<template>
  <div class="vip-panel">
    <div class="page-scroller vip-scroll">
      <div class="card-wrap">
        <div class="vip-card">
          <div class="card-row">
            <div class="card-left">
              <div class="crown-slot">
                <div class="crown">
                  <img :src="crown(info.level)" alt="" />
                  <span class="crown-badge card-badge" :style="{ color: badgeColor(info.level) }">
                    V{{ tr(info.level) }}
                  </span>
                </div>
              </div>
              <div class="card-text">
                <div>
                  <p class="dim">
                    {{ tr('Siga') }}
                    <span class="next-level">VIP{{ tr(info.nextLevel) }}</span>
                  </p>
                  <!-- One line: a line break here would drop the space Vue
                       condenses away, and the live text has one. -->
                  <p class="need-line">
                    <span class="dim">{{ tr('Ainda precisa apostar') }}</span> <span class="need">{{ formatAmount(info.remainingBet) }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="card-right">
              <div>
                <div class="btn-collect">{{ tr('Coletar Tudo') }}</div>
                <div class="btn-history"><span>{{ tr('Histórias') }}</span></div>
              </div>
            </div>
          </div>
          <div class="current-level">{{ tr('Nível Atual') }}</div>
        </div>
      </div>

      <div class="list-title">{{ tr('Lista de níveis VIP') }}</div>

      <div class="sub-sticky">
        <div ref="subRow" class="sub-row">
          <button
            v-for="tab in vipSubTabs"
            :key="tab.key"
            type="button"
            class="sub-btn"
            :class="{ on: tab.key === subTab }"
            @click="emit('selectSubTab', tab.key)"
          >
            <span>{{ tr(tab.label) }}</span>
          </button>
        </div>
        <div v-if="subTab !== 'retention'" class="table-head">
          <span v-for="head in heads" :key="head">{{ tr(head) }}</span>
        </div>
      </div>

      <div class="rows-wrap">
        <div class="vip-list">
          <template v-if="subTab !== 'retention'">
            <div
              v-for="(level, index) in levels"
              :key="level.level"
              class="vip-row"
              :class="{ alt: index % 2 === 0 }"
            >
              <div class="col col-crown">
                <div class="crown-cell">
                  <img :src="crown(level.level)" alt="" />
                  <span class="crown-badge row-badge" :style="{ color: badgeColor(level.level) }">
                    V{{ tr(level.level) }}
                  </span>
                </div>
              </div>

              <div v-if="subTab === 'bonus'" class="col">
                <div class="col-pad">
                  <div class="dim">{{ formatAmount(level.promotionBet) }}</div>
                  <div v-if="level.level === info.nextLevel">
                    <div class="row-bar">
                      <div class="row-bar-fill" :style="{ width: `${progress * 100}%` }" />
                    </div>
                    <div>
                      {{ formatAmount(info.progressBet) }}/{{ formatAmount(info.progressTarget) }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="col emphasis">{{ formatAmount(reward(level)) }}</div>
            </div>
          </template>

          <div v-else class="retention">
            <div>
              <div class="retention-title">{{ tr('Instruções para manter o nível') }}</div>
              <p v-for="rule in retentionRules" :key="rule" class="retention-p">{{ tr(rule) }}</p>
            </div>
            <div>
              <div class="retention-title table-title">{{ tr('Tabela de níveis de manutenção') }}</div>
              <div class="table-box">
                <table class="retention-table">
                  <thead>
                    <tr>
                      <th>{{ tr('Nível VIP') }}</th>
                      <th>{{ tr('A manutenção requer recarga') }}</th>
                      <th>{{ tr('A manutenção requer aposta') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="level in levels" :key="level.level">
                      <th>{{ tr(level.level) }}</th>
                      <th>{{ formatAmount(level.retentionRecharge) }}</th>
                      <th>{{ formatAmount(level.retentionBet) }}</th>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rules">
        <div class="rules-title">{{ tr('Instruções sobre regras VIP') }}</div>
        <p v-for="rule in rules" :key="rule">{{ tr(rule) }}</p>
      </div>
    </div>

    <!-- Live page anchors this bar with `fixed left-0 w-full`; inside the
         centred column that is the same box as an absolute one, and it keeps
         hugging the column instead of the window on a wide viewport. -->
    <div class="vip-footer">
      <div class="upgrade-btn">{{ tr('Reclamar Recompensa de Upgrade') }}</div>
    </div>
  </div>
</template>

<style scoped>
.vip-panel {
  display: flex;
  position: relative;
  flex: 1 1 0%;
  min-height: 0;
  flex-direction: column;
}

/* This tab's ion-content carries no padding of its own; every section below
   brings its own 1rem gutter. The 72px reserve stands in for the live
   scroller, which is that much shorter than the column so the last rule stops
   above the upgrade bar instead of sliding under it. */
.vip-scroll {
  padding-bottom: 4.5rem;
  background-color: #090f1f;
}

.card-wrap {
  width: 100%;
  padding: 0.625rem 1rem 0;
}

.vip-card {
  position: relative;
  width: 100%;
  height: 5rem;
  margin: 0.25rem 0;
  padding: 0 0.625rem;
  background-color: rgb(25, 30, 45);
  /* px: Ionic's `rounded-lg`, outside the site's rem scale. */
  border-radius: 8px;
}

.card-row {
  display: flex;
  height: 100%;
  justify-content: space-between;
}

.card-left {
  display: flex;
  align-items: center;
  font-size: 0.75rem;
}

.crown-slot {
  position: relative;
  height: 100%;
  padding: 0 2rem;
  font-size: 0.625rem;
}

.crown {
  position: absolute;
  top: 50%;
  left: 0;
  width: 3.375rem;
  transform: translateY(-50%);
}

.crown img,
.crown-cell img {
  width: 3.375rem;
  height: 3.375rem;
}

.crown-badge {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 1.875rem;
  height: 0.9375rem;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 0.9375rem;
  text-align: center;
}

.card-badge {
  top: 1.53125rem;
  left: 1.75rem;
}

.row-badge {
  top: 1.5625rem;
  left: 1.75rem;
}

.card-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  line-height: 1rem;
}

.dim {
  color: rgba(255, 255, 255, 0.4);
}

.next-level {
  font-weight: 700;
  color: #fba531;
}

.need-line {
  padding-right: 0.625rem;
}

.need {
  color: #fff;
}

.card-right {
  display: flex;
  width: 5rem;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.btn-collect,
.btn-history {
  display: flex;
  width: 5rem;
  height: 1.875rem;
  justify-content: center;
  align-items: center;
  color: #fff;
  border-radius: 6px;
}

.btn-collect {
  padding: 2px;
  line-height: 0.8125rem;
  /* Disabled state of the live button. */
  background-color: rgb(98, 98, 98);
}

.btn-history {
  margin-top: 0.5rem;
  line-height: 1rem;
  background-image: linear-gradient(rgb(255, 194, 113) 0%, rgb(242, 145, 13) 100%);
}

/* The live badge's `top-1 left-1` is overridden by its own class, so it sits
   flush in the card corner. */
.current-level {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0 2px 2px;
  font-size: 0.6rem;
  font-weight: 700;
  line-height: 0.9rem;
  color: #fff;
  background-color: rgb(254, 83, 83);
  border-radius: 3px;
}

.list-title {
  width: 100%;
  padding: 0.625rem 1rem 0;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #fff;
}

.sub-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  padding: 0 1rem;
}

.sub-row {
  display: flex;
  padding-bottom: 0.3125rem;
  overflow-x: auto;
  scrollbar-width: none;
  background-color: #090f1f;
  /* Keep horizontal pans on this row so the VIP scroller does not steal them. */
  touch-action: pan-x;
  /* The live ion-segment carries this hairline, which is what makes the row 54px
     tall instead of 53. */
  border-bottom: 1px solid rgb(26, 35, 62);
}

.sub-row::-webkit-scrollbar {
  display: none;
}

/* px type, as on the header segment: the size comes from Ionic, not the site. */
.sub-btn {
  display: flex;
  position: relative;
  height: 3rem;
  padding: 0 1rem;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  font-size: 14px;
  white-space: nowrap;
  color: rgb(109, 120, 141);
  transition: color 0.15s linear;
}

.sub-btn.on {
  color: #fff;
}

.sub-btn.on::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.125rem;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
}

.table-head {
  display: flex;
  height: 3.5rem;
  padding: 0.75rem 0;
  align-items: center;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(109, 120, 141);
  background-color: rgb(26, 34, 58);
}

.table-head span {
  flex: 1 1 0%;
  text-align: center;
}

.rows-wrap {
  width: 100%;
  padding: 0 1rem 1rem;
}

.vip-list {
  background-color: #101629;
}

.vip-row {
  display: flex;
  width: 100%;
  height: 3.75rem;
  align-items: center;
  font-size: 0.625rem;
  line-height: 0.9375rem;
  background-color: #090f1f;
}

.vip-row.alt {
  background-color: rgb(26, 29, 34);
}

.col {
  flex: 1 1 0%;
  text-align: center;
}

.col-crown {
  display: flex;
  justify-content: center;
  align-items: center;
}

.crown-cell {
  position: relative;
  width: 3.375rem;
  margin: 0 auto;
}

.col-pad {
  padding: 0 0.25rem;
}

.emphasis {
  color: #fba531;
}

/* ion-progress-bar.my-0.5 inside the current level row. */
.row-bar {
  height: 0.25rem;
  margin: 2px 0;
  overflow: hidden;
  background-color: rgb(59, 65, 82);
  border-radius: 16px;
}

.row-bar-fill {
  height: 100%;
  background-image: linear-gradient(rgb(255, 194, 113) 0%, rgb(242, 145, 13) 100%);
}

.retention {
  font-size: 0.75rem;
  line-height: 1.25rem;
  color: rgba(255, 255, 255, 0.4);
  background-color: #101629;
}

.retention-title {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.retention-p {
  margin-top: 0.5rem;
}

.table-title {
  margin: 1rem 0 0.5rem;
}

.table-box {
  overflow: hidden;
  border: 1px solid rgb(26, 35, 62);
  border-radius: 0.625rem;
}

.retention-table {
  width: 100%;
  font-size: 0.75rem;
  line-height: 1rem;
  border-collapse: collapse;
  background-color: rgb(23, 36, 79);
  overflow-wrap: break-word;
}

.retention-table thead {
  background-color: rgb(25, 30, 45);
}

/* Live `table.table th, td`: line-height 1.5625rem, width 12.5%. */
.retention-table th {
  width: 12.5%;
  padding: 0;
  font-weight: 400;
  line-height: 1.5625rem;
  text-align: center;
  vertical-align: middle;
  color: #fba531;
  border: 1px solid rgb(26, 35, 62);
}

/* Live `.unZhTable thead tr th`: height 2.6rem, line-height 0.9rem. */
.retention-table thead th {
  height: 2.6rem;
  line-height: 0.9rem;
  color: #fff;
}

.retention-table th:first-child {
  border-left: none;
}

.retention-table th:last-child {
  border-right: none;
}

.retention-table thead tr:first-child th {
  border-top: none;
}

.retention-table tbody tr:last-child th {
  border-bottom: none;
}

.rules {
  width: 100%;
  margin-top: 0.625rem;
  padding: 0 1rem 5.5rem;
  font-size: 0.75rem;
  line-height: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
}

.rules-title {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.rules p {
  margin-top: 0.75rem;
}

.vip-footer {
  display: flex;
  position: absolute;
  bottom: 3.5rem;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 5rem;
  justify-content: center;
  align-items: center;
  background-color: rgb(25, 30, 45);
}

.upgrade-btn {
  display: flex;
  width: 17.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  color: #fff;
  /* Disabled state: the account has no upgrade reward pending. */
  background-color: rgb(98, 98, 98);
  border-radius: 0.375rem;
}
</style>
