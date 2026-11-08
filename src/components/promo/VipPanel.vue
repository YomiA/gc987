<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { formatAmount, type VipLevel } from '../../api/promo'
import { vipSubTabs } from '../../stores/promo'

const props = defineProps<{
  levels: VipLevel[]
  info: {
    level: number
    nextLevel: number
    remainingBet: number
    progressBet: number
    progressTarget: number
    progressRecharge: number
    rechargeTarget: number
    icon?: string
    rewardStatus: number
  }
  rules: string[]
  retentionRules: string[]
  subTab: string
}>()
const emit = defineEmits<{ selectSubTab: [key: string]; claim: []; history: [] }>()
/** Any level carrying upgradeRechargeAmt turns the deposit column on for the whole table. */
const showRecharge = computed(() =>
  props.subTab === 'bonus' && props.levels.some((level) => level.promotionRecharge != null),
)

/** Any non-zero upgrade bet turns the wager column on. A zero on V0 alone does not. */
const showBet = computed(() =>
  props.subTab === 'bonus' && props.levels.some((level) => level.promotionBet !== 0),
)

/** Retention stays in the data, but the tab is hidden until that list exists. */
const visibleTabs = computed(() => {
  const hasRetention = props.levels.some(
    (level) => level.retentionBet > 0 || level.retentionRecharge > 0,
  )
  return hasRetention ? vipSubTabs : vipSubTabs.filter((tab) => tab.key !== 'retention')
})

/**
 * Column titles follow the live order: Nível, then Depósito necessária when
 * any level has a deposit requirement, then Aposta necessária, then Bônus.
 */
const heads = computed(() => {
  if (props.subTab === 'daily') return ['Nível', 'Bônus Diário']
  if (props.subTab === 'weekly') return ['Nível', 'Bônus Semanal']
  if (props.subTab === 'monthly') return ['Nível', 'Bônus Mensal']
  const titles = ['Nível']
  if (showRecharge.value) titles.push('Depósito necessária')
  if (showBet.value) titles.push('Aposta necessária')
  titles.push('Bônus')
  return titles
})

/** Live copy on gc987.com/activity/vip. 12 upgrade, 13 daily, 14 weekly, 15 monthly. */
const CLAIM_LABEL: Record<string, string> = {
  bonus: 'Reclamar Recompensa de Upgrade',
  daily: 'Reivindicar Recompensa Diária',
  weekly: 'Reivindicar Recompensa Semanal',
  monthly: 'Reivindicar Recompensa Mensal',
}

const claimLabel = computed(() => CLAIM_LABEL[props.subTab] ?? CLAIM_LABEL.bonus)

/** res.data.rewardStatus: 1 lights Coletar Tudo, 0 leaves it gray. */
const canCollect = computed(() => props.info.rewardStatus === 1)

function onCollect() {
  if (!canCollect.value) return
  emit('claim')
}

const canClaim = computed(() =>
  props.levels.some((level) => {
    const status =
      props.subTab === 'daily'
        ? level.dailyStatus
        : props.subTab === 'weekly'
          ? level.weeklyStatus
          : props.subTab === 'monthly'
            ? level.monthlyStatus
            : level.promotionStatus
    return status === 2
  }),
)

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

const rechargeProgress = computed(() =>
  props.info.rechargeTarget ? props.info.progressRecharge / props.info.rechargeTarget : 0,
)

/** Still to deposit before the next level. Hidden when that remainder is 0. */
const remainingRecharge = computed(() =>
  Math.max(props.info.rechargeTarget - props.info.progressRecharge, 0),
)

/** No higher level: the board copies the current level into nextLevel. */
const atMax = computed(() => props.info.nextLevel === props.info.level)

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
                  <img v-if="info.icon" :src="info.icon" alt="" />
                </div>
              </div>
              <div class="card-text">
                <div class="level-copy">
                  <p class="dim">
                    <span>{{ `${tr('Siga')} ` }}</span><span class="next-level">VIP{{ tr(info.level) }}</span>
                  </p>
                  <p class="dim">
                    <span>{{ `${tr('Ainda precisa apostar')} ` }}</span><span class="need">{{ formatAmount(info.remainingBet) }}</span
                    ><span v-if="info.rechargeTarget > 0">{{ `, ${tr('Ainda precisa recarga')} ` }}</span
                    ><span v-if="info.rechargeTarget > 0" class="need">{{ formatAmount(remainingRecharge) }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="card-right">
              <div>
                <button type="button" class="btn-collect" :class="{ on: canCollect }" @click="onCollect">
                  {{ tr('Coletar Tudo') }}
                </button>
                <button type="button" class="btn-history" @click="emit('history')">
                  <span>{{ tr('Histórias') }}</span>
                </button>
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
            v-for="tab in visibleTabs"
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
                  <img v-if="level.icon" :src="level.icon" alt="" />
                </div>
              </div>

              <div v-if="showRecharge" class="col">
                <div class="col-pad">
                  <div class="dim">{{ level.promotionRecharge == null ? '' : formatAmount(level.promotionRecharge) }}</div>
                  <div v-if="!atMax && level.level === info.nextLevel && level.promotionRecharge != null">
                    <div class="row-bar">
                      <div class="row-bar-fill" :style="{ width: `${rechargeProgress * 100}%` }" />
                    </div>
                    <div>
                      {{ formatAmount(info.progressRecharge) }}/{{ formatAmount(info.rechargeTarget) }}
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showBet" class="col">
                <div class="col-pad">
                  <div class="dim">{{ formatAmount(level.promotionBet) }}</div>
                  <div v-if="!atMax && level.level === info.nextLevel">
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

    <!-- Live claim bar is `fixed` with z-index auto. Keeping auto here lets
         the tab-bar deposit hump (z-index 1) paint over this bar. A positive
         z-index covers that hump. Absolute, not fixed, so a wide window still
         hugs the centred column. -->
    <div class="vip-footer">
      <div class="upgrade-btn" :class="{ on: canClaim }">
        <span>{{ tr(claimLabel) }}</span>
      </div>
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
  /* Live ion-img is w-[54px], not rem, so it stays 54px on a wide column. */
  width: 54px;
  transform: translateY(-50%);
}

.crown img,
.crown-cell img {
  width: 54px;
  height: 54px;
  max-width: 54px;
  max-height: 54px;
  object-fit: contain;
}

.card-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  line-height: 1rem;
}

.level-copy p {
  margin: 0;
}

.dim {
  color: rgba(255, 255, 255, 0.4);
}

.next-level {
  font-weight: 700;
  color: #fba531;
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
  padding: 0;
  justify-content: center;
  align-items: center;
  border: 0;
  font: inherit;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.btn-collect {
  padding: 2px;
  line-height: 0.8125rem;
  /* rewardStatus 0. The live unable claim button is this gray. */
  background-color: rgb(98, 98, 98);
  cursor: default;
}

.btn-collect.on {
  /* rewardStatus 1. Same green as the live claimButtonEnabled gradient. */
  background-color: transparent;
  background-image: linear-gradient(rgb(19, 201, 106) 0%, rgb(29, 149, 84) 100%);
  cursor: pointer;
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
  min-width: 0;
  text-align: center;
}

.col-crown {
  display: flex;
  justify-content: center;
  align-items: center;
}

.crown-cell {
  position: relative;
  width: 54px;
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
  width: 100%;
  height: 5rem;
  justify-content: center;
  align-items: center;
  background-color: rgb(25, 30, 45);
  border-top: 0.5px solid #292d36;
}

.upgrade-btn {
  display: flex;
  width: 17.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  color: #fff;
  /* Same box as the live claim bar: 280×40 at a 390-wide phone. */
  background-color: rgb(98, 98, 98);
  border-radius: 6px;
}

.upgrade-btn.on {
  background-color: transparent;
  background-image: linear-gradient(180deg, #13c96a 0%, #1d9554 100%);
}
</style>
