<script setup lang="ts">
/**
 * /spread — Perfil -> Convidar ("ConvidarCentro").
 *
 * Six in-page tabs over one scroller. Built: "Link de Convite",
 * "Rede de Agentes", "Desempenho", "Comissão", "Taxa de Bônus do Agente"
 * and "Registrar Subordinados". Geometry is the live page at 390x844x3;
 * see docs/research/gc987-com/spread/CONVIDAR_PAGE.spec.md.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import AgentInfoCard from '../../components/perfil/convidar/AgentInfoCard.vue'
import AgentNetworkPanel from '../../components/perfil/convidar/AgentNetworkPanel.vue'
import BonusRatePanel from '../../components/perfil/convidar/BonusRatePanel.vue'
import CommissionPanel from '../../components/perfil/convidar/CommissionPanel.vue'
import ConvidarSegment from '../../components/perfil/convidar/ConvidarSegment.vue'
import PerformancePanel from '../../components/perfil/convidar/PerformancePanel.vue'
import RegistrarPanel from '../../components/perfil/convidar/RegistrarPanel.vue'
import ShareInfoCard from '../../components/perfil/convidar/ShareInfoCard.vue'
import SummaryCard from '../../components/perfil/convidar/SummaryCard.vue'
import { useSpreadStore } from '../../stores/spread'

const router = useRouter()
const spread = useSpreadStore()

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/perfil')
}

onMounted(() => void spread.load(true))
</script>

<template>
  <div class="ion-page">
    <header class="convidar-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">{{ tr('ConvidarCentro') }}</span></h1>
      </div>

      <ConvidarSegment :tabs="spread.tabs" :active="spread.active" @select="spread.selectTab" />
    </header>

    <div class="page-scroller convidar-body" :class="{ inset: spread.active === 'link' }">
      <template v-if="spread.active === 'link' && spread.info && spread.share">
        <AgentInfoCard :info="spread.info" />
        <ShareInfoCard :share="spread.share" />
        <SummaryCard v-for="card in spread.cards" :key="card.key" :card="card" />
      </template>

      <AgentNetworkPanel
        v-else-if="spread.active === 'rede' && spread.network"
        :network="spread.network"
      />

      <PerformancePanel
        v-else-if="spread.active === 'desempenho'"
        :columns="spread.perfColumns"
        :rows="spread.perfRows"
        :date="spread.perfDate"
        :query="spread.perfQuery"
        @update:date="spread.setPerfDate"
        @update:query="spread.setPerfQuery"
      />

      <CommissionPanel
        v-else-if="spread.active === 'comissao'"
        :columns="spread.commColumns"
        :types="spread.commTypes"
        :rows="spread.commRows"
        :start="spread.commStart"
        :end="spread.commEnd"
        :type="spread.commType"
        @update:start="spread.setCommStart"
        @update:end="spread.setCommEnd"
        @update:type="spread.setCommType"
      />

      <BonusRatePanel
        v-else-if="spread.active === 'taxa'"
        :tabs="spread.rateTabs"
        :active="spread.rateTab"
        :rows="spread.rateRows"
        @select="spread.selectRateTab"
      />

      <RegistrarPanel v-else-if="spread.active === 'registrar'" />
    </div>
  </div>
</template>

<style scoped>
/* ion-header carries ion-no-border here, so unlike /user/report there is no
   elevation under the toolbar. */
.convidar-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
}

/* ion-toolbar (ios mode): --background #101629, --min-height 3.125rem,
   --padding-start/end 4px. */
.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 0.25rem;
  align-items: center;
  overflow: hidden;
  background-color: #101629;
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

/* ion-title (ios mode) spans the toolbar with 90px gutters and must not eat the
   back button's taps. */
.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
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
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Tab 1's scroller is inset 10px on both sides; Rede de Agentes uses the full
   390 and pads itself instead. */
.convidar-body.inset {
  margin: 0 0.625rem;
}
</style>
