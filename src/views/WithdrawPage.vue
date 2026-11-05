<script setup lang="ts">
/**
 * /main/withdraw — signed-in Saque.
 *
 * TabBar Saque lands here. Record icon pushes /withdrawSubView. Retirar Agora
 * opens the withdrawal-password modal on this page.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import WithdrawForm from '../components/withdraw/WithdrawForm.vue'
import WithdrawPasswordModal from '../components/withdraw/WithdrawPasswordModal.vue'
import FundPasswordTips from '../components/withdraw/FundPasswordTips.vue'
import TabBar from '../components/inicio/TabBar.vue'
import SvgIcon from '../components/base/SvgIcon.vue'
import { withdrawCopy } from '../api/withdraw'
import { selectMainTab } from '../auth/tabGuard'
import { useWithdrawStore } from '../stores/withdraw'
import { useHomeStore } from '../stores/home'

const router = useRouter()
const home = useHomeStore()
const withdraw = useWithdrawStore()

function onTabSelect(key: string) {
  selectMainTab(router, key)
}

function onFundTipsConfirm() {
  withdraw.closeFundTips()
  void router.push('/security/verify/asset')
}

onMounted(() => {
  void home.load()
  void withdraw.load()
  withdraw.resetErrors()
  withdraw.closeFundTips()
})
</script>

<template>
  <div class="ion-page">
    <header class="withdraw-header">
      <div class="toolbar">
        <h1 class="toolbar-title">
          <span class="title-text">{{ tr(withdrawCopy.title) }}</span>
        </h1>
        <button type="button" class="record" :aria-label="tr('Registro de Saque')" @click="router.push('/withdrawSubView')">
          <SvgIcon class="record-icon" name="entrar-record" />
        </button>
      </div>
    </header>

    <div class="page-scroller withdraw-content">
      <WithdrawForm />
    </div>

    <TabBar :items="home.tabBarItems" active="saque" @select="onTabSelect" />

    <WithdrawPasswordModal
      v-if="withdraw.passwordOpen"
      :amount-cents="withdraw.amountCents"
      :submitting="withdraw.submitting"
      @close="withdraw.closePassword()"
      @confirm="withdraw.submitCashOut"
    />

    <FundPasswordTips
      v-if="withdraw.fundTipsOpen"
      :message="withdrawCopy.fundTips"
      :confirm="withdrawCopy.fundTipsConfirm"
      @confirm="onFundTipsConfirm"
    />
  </div>
</template>

<style scoped>
.withdraw-header {
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

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  min-width: 0;
  overflow: hidden;
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.record {
  display: flex;
  position: relative;
  z-index: 2;
  height: 32px;
  min-height: 32px;
  margin: 0 2px 0 auto;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* 28×20 at 390 (1rem = 16px); rem so the same glyph tracks the desktop column. */
.record-icon {
  width: 1.75rem;
  height: 1.25rem;
  color: #fff;
}

.withdraw-content {
  padding: 16px 16px calc(56px + 1rem);
  background-color: var(--color-bar-bg);
}

@media (min-width: 486px) {
  .toolbar {
    padding: 0 4px;
  }

  .withdraw-content {
    padding-bottom: calc(70px + 1rem);
  }
}
</style>
