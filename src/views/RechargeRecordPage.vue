<script setup lang="ts">
/**
 * /rechargeRecord — same list as the deposit record sheet.
 * The header icon on /main/entrar opens the sheet in place; this route
 * stays for a direct visit.
 */
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import DepositRecordPanel from '../components/entrar/DepositRecordPanel.vue'
import { rechargeRecordCopy as copy } from '../api/rechargeRecord'

const router = useRouter()

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/entrar')
}
</script>

<template>
  <div class="ion-page">
    <header class="rec-header">
      <div class="toolbar">
        <button type="button" class="back" aria-label="Voltar" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ copy.title }}</span>
        </h1>
      </div>
    </header>
    <DepositRecordPanel />
  </div>
</template>

<style scoped>
.rec-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
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
  position: relative;
  z-index: 2;
  width: 2.625rem;
  height: 3.125rem;
  margin: 0;
  padding: 0 0.875rem;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.back-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: var(--color-text-100);
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0 90px;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
