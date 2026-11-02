<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PromoEventCard from '../components/promo/PromoEventCard.vue'
import PromoSegment from '../components/promo/PromoSegment.vue'
import RebatePanel from '../components/promo/RebatePanel.vue'
import RecordPanel from '../components/promo/RecordPanel.vue'
import RedeemPanel from '../components/promo/RedeemPanel.vue'
import VipPanel from '../components/promo/VipPanel.vue'
import TabBar from '../components/inicio/TabBar.vue'
import type { PromoEvent } from '../api/promo'
import { useHomeStore } from '../stores/home'
import { usePromoStore } from '../stores/promo'

const router = useRouter()
const home = useHomeStore()
const promo = usePromoStore()

function openEvent(event: PromoEvent) {
  if (event.type === 'VIP') {
    void router.push('/activity/vip')
    return
  }
  if (event.type === 'Rebate') {
    promo.selectTab('rebate')
    return
  }
  void router.push(`/activity/${event.type}/${event.routeId}`)
}

function openRebateHistory() {
  void router.push('/activity/rebate/record')
}

function onTabSelect(key: string) {
  if (key === 'inicio') {
    void router.push('/main/inicio')
    return
  }
  if (key === 'deposito') {
    void router.push('/main/entrar')
    return
  }
  if (key === 'perfil') {
    void router.push('/main/perfil')
    return
  }
  if (key === 'saque') {
    void router.push('/main/withdraw')
    return
  }
  home.selectTab(key)
}

onMounted(() => {
  // The bottom bar is the app-level one shared with /main/inicio, so its items
  // come from the same store even when this route is opened directly.
  void home.load()
  void promo.load()
})
</script>

<template>
  <div class="ion-page">
    <PromoSegment :tabs="promo.tabs" :active="promo.activeTab" @select="promo.selectTab" />

    <div v-if="promo.activeTab === 'eventos'" class="page-scroller promo-content">
      <div class="event-list">
        <PromoEventCard
          v-for="event in promo.events"
          :key="event.id"
          :event="event"
          @select="openEvent(event)"
        />
      </div>
    </div>

    <RebatePanel
      v-else-if="promo.activeTab === 'rebate'"
      :categories="promo.rebateCategories"
      :rows="promo.rebateRows"
      :receivable="promo.rebateReceivable"
      :active-category="promo.rebateCategory"
      @select-category="promo.selectRebateCategory"
      @history="openRebateHistory"
    />

    <VipPanel
      v-else-if="promo.activeTab === 'vip'"
      :levels="promo.vipLevels"
      :info="promo.vipInfo"
      :rules="promo.vipRules"
      :retention-rules="promo.vipRetentionRules"
      :sub-tab="promo.vipSubTab"
      @select-sub-tab="promo.selectVipSubTab"
    />

    <RedeemPanel v-else-if="promo.activeTab === 'resgate'" />

    <RecordPanel
      v-else
      :variant="promo.activeTab === 'pendente' ? 'pendente' : 'historico'"
      :bonus="0"
    />

    <TabBar :items="home.tabBarItems" active="promo" @select="onTabSelect" />
  </div>
</template>

<style scoped>
/* ion-content: --background #090f1f, --padding-top 10px,
   --padding-start/-end 15px, --padding-bottom 0. */
.promo-content {
  padding: 0.625rem 0.9375rem 0;
  background-color: var(--color-bar-bg);
}

/* The live list wrapper reserves 72px under the last card so the tab bar never
   covers it. */
.event-list {
  padding-bottom: 4.5rem;
}
</style>
