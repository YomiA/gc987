<script setup lang="ts">
/**
 * `/withdrawalAccount` — Minha conta, empty PIX list + Adicionar Conta.
 *
 * Geometry from https://gc987.com/withdrawalAccount at 390x844x3.
 */
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import { withdrawalAccountCopy as copy } from '../api/withdrawalAccount'
import { useWithdrawalAccountStore } from '../stores/withdrawalAccount'

const router = useRouter()
const accounts = useWithdrawalAccountStore()

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/withdraw/apply')
}

onMounted(() => {
  void accounts.load()
})
</script>

<template>
  <div class="ion-page">
    <header class="acc-header">
      <div class="toolbar">
        <button type="button" class="back" :aria-label="tr('Voltar')" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ tr(copy.title) }}</span>
        </h1>
      </div>
    </header>

    <div class="page-scroller acc-body">
      <div class="tab-list">
        <div class="tab on">{{ tr(copy.tab) }}</div>
      </div>

      <div v-for="item in accounts.items" :key="item.id" class="bank-card">
        <span class="card-name">{{ tr(item.name) }}</span>
        <span class="card-pix">{{ tr(item.pix) }}</span>
      </div>

      <button type="button" class="add-card" @click="router.push('/withdrawalBindAccount')">
        <span class="plus" aria-hidden="true">+</span>
        {{ tr(copy.add) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.acc-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 28.4px 0;
}

.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 4px;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg-400);
}

.back {
  display: flex;
  width: 2.375rem;
  height: 3.125rem;
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
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
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

.acc-body {
  padding-top: 17px;
  background-color: var(--color-bar-bg);
}

.tab-list {
  height: 44px;
  margin: 24px 18px 35px;
}

.tab {
  display: flex;
  width: calc(100% - 10px);
  height: 40px;
  margin: 2px 10px 2px 0;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 16.67px;
  color: #fff;
  background-color: var(--color-bg-400);
  border-radius: 4px;
}

.bank-card {
  display: flex;
  box-sizing: border-box;
  width: calc(100% - 24px);
  height: 60px;
  margin: 0 12px 12px;
  padding: 10px 12px;
  flex-direction: column;
  justify-content: center;
  background-color: var(--color-bg-400);
  border-radius: 6px;
}

.card-name {
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.card-pix {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.add-card {
  display: flex;
  box-sizing: border-box;
  width: calc(100% - 24px);
  height: 60px;
  margin: 0 12px 12px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: rgb(17, 111, 205);
  background-color: var(--color-bg-400);
  border-radius: 6px;
}

.plus {
  margin-right: 6px;
  font-size: 18px;
  line-height: 18px;
}
</style>
