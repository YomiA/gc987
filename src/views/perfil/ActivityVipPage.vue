<script setup lang="ts">
/**
 * /activity/vip — Perfil Aposta / VIP card.
 *
 * Same VipPanel as /main/promo's VIP tab. Only the chrome differs: a 50px
 * ion-no-border toolbar (back + "VIP") and no TabBar, so the upgrade bar
 * sits on the bottom edge. The VIP sub-tab is local — live /activity/vip
 * always opens on Bônus, independent of /main/promo.
 */
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import VipPanel from '../../components/promo/VipPanel.vue'
import { usePromoStore } from '../../stores/promo'

const router = useRouter()
const promo = usePromoStore()
/** Own selection, not `promo.vipSubTab`. Live /activity/vip always opens on Bônus. */
const subTab = ref('bonus')

function selectSubTab(key: string) {
  subTab.value = key
}

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/perfil')
}

onMounted(() => void promo.load())
</script>

<template>
  <div class="ion-page vip-activity">
    <header class="vip-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">VIP</span></h1>
      </div>
    </header>

    <VipPanel
      :levels="promo.vipLevels"
      :info="promo.vipInfo"
      :rules="promo.vipRules"
      :retention-rules="promo.vipRetentionRules"
      :sub-tab="subTab"
      @select-sub-tab="selectSubTab"
    />
  </div>
</template>

<style scoped>
/* ion-header.md ion-no-border, z-index 10, 50 tall (toolbar only). */
.vip-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
}

/* ion-toolbar (ios): --background #154084, --min-height 3.125rem,
   --padding-start/end 4px. No elevation on this route. */
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

/* Live claim bar is `fixed bottom: 0` because this route has no tab bar.
   VipPanel keeps `bottom: 3.5rem` for /main/promo; only this page moves it. */
.vip-activity :deep(.vip-footer) {
  bottom: 0;
}
</style>
