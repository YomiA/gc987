<script setup lang="ts">
/**
 * VIP progress card of /main/perfil (358x112 at (16,221) on the live page).
 * The crown hangs 25px above the card's inner box, exactly as the original's
 * absolutely positioned ion-img does.
 */
import { computed } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import { formatReais } from '../../utils/money'

const props = defineProps<{
  vip: {
    crown: string
    levelBadge: string
    levelBadgeColor: string
    nextLevel: string
    /** Reais already wagered. */
    orderAmt: number
    /** Reais required to reach the next level. */
    upgradeOrderAmt: number
    /** Reais already deposited. */
    rechargeAmt: number
    /** Reais of deposit required. The second row exists only when this is in use. */
    upgradeRechargeAmt: number
    showRecharge: boolean
  }
}>()

const rows = computed(() => {
  const list = [
    {
      label: 'Aposta necessária',
      current: props.vip.orderAmt,
      required: props.vip.upgradeOrderAmt,
    },
  ]
  if (props.vip.showRecharge) {
    list.push({
      label: 'Depósito necessária',
      current: props.vip.rechargeAmt,
      required: props.vip.upgradeRechargeAmt,
    })
  }
  return list
})

function ratio(current: number, required: number) {
  if (!(required > 0)) return 0
  return Math.min(1, Math.max(0, current / required))
}
</script>

<template>
  <div class="vip card-bg-gradient">
    <div class="top">
      <div class="left">
        <img class="crown" :src="props.vip.crown" alt="" />
        <div class="level-badge">
          <span :style="{ color: props.vip.levelBadgeColor }">{{ props.vip.levelBadge }}</span>
        </div>
      </div>

      <div class="right">
        <div class="level">
          <p>
            <span>{{ `${tr('Siga')} ` }}</span><span class="important-text">{{ props.vip.nextLevel }}</span
            ><span>{{ ` ${tr('Ainda precisa apostar')} ${formatReais(Math.max(props.vip.upgradeOrderAmt - props.vip.orderAmt, 0))}` }}</span
            ><span v-if="props.vip.showRecharge">{{ `, ${tr('Ainda precisa recarga')} ${formatReais(Math.max(props.vip.upgradeRechargeAmt - props.vip.rechargeAmt, 0))}` }}</span>
          </p>
          <SvgIcon class="chevron-forward" name="chevron-forward" />
        </div>
      </div>
    </div>

    <div class="bottom">
      <div v-for="row in rows" :key="row.label" class="line">
        <span class="line-label">{{ tr(row.label) }}</span>
        <span class="line-track">
          <div class="progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ transform: `scaleX(${ratio(row.current, row.required)})` }" />
            </div>
            <div class="progress-value">
              {{ formatReais(row.current) }}/{{ formatReais(row.required) }}
            </div>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ion-content .vip { width: 100%; padding: .875rem .625rem; border-radius: .5rem;
   font-size: .625rem } over the shared card gradient. */
.vip {
  position: relative;
  width: 100%;
  padding: 0.875rem 0.625rem;
  border-radius: 0.5rem;
  font-size: 0.625rem;
  background: var(--pwa-bar-bg);
}

.top {
  display: flex;
  align-items: center;
}

/* Both children are absolute, so the live .left measures 64x0. */
.left {
  position: relative;
  width: 4rem;
}

.crown {
  position: absolute;
  top: -1.5625rem;
  left: 0.625rem;
  width: 3.375rem;
  height: 3.375rem;
  object-fit: contain;
}

.level-badge {
  display: flex;
  position: absolute;
  left: 2.375rem;
  width: 1.875rem;
  justify-content: center;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 700;
  text-align: center;
}

.right {
  padding-top: 0.75rem;
  margin-left: 1rem;
  flex: 1 1 0%;
  text-align: center;
}

.level {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.important-text {
  color: var(--color-currency);
}

.chevron-forward {
  width: 1rem;
  height: 1rem;
  color: rgb(155, 167, 190);
}

.bottom {
  margin: 0.75rem 0;
}

.line {
  display: flex;
  align-items: center;
}

.line + .line {
  margin-top: 0.5rem;
}

/* Narrow enough that the live label wraps onto two lines. */
.line-label {
  width: 20%;
  text-align: center;
}

.line-track {
  width: 80%;
  height: 1rem;
}

.progress {
  position: relative;
}

/* ion-progress-bar: position absolute, height 1rem, radius 1rem,
   --background #3B4152, --progress-background the amber gradient. */
.progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1rem;
  border-radius: 1rem;
  background-color: rgb(59, 65, 82);
  overflow: hidden;
}

.progress-fill {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(359deg, #fa9a21 1.02%, #f8da9d 89.77%);
  transform-origin: left center;
}

.progress-value {
  position: absolute;
  top: 0;
  left: 50%;
  color: var(--color-text-100);
  transform: translateX(-50%);
}
</style>
