<script setup lang="ts">
/**
 * Full-page Registro de Depósito. Opening it from the payment page closes
 * the cashier first, so dismissing the list returns to the deposit form.
 */
import SvgIcon from '../base/SvgIcon.vue'
import DepositRecordPanel from './DepositRecordPanel.vue'
import { rechargeRecordCopy as copy } from '../../api/rechargeRecord'

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="record-modal">
    <div class="panel">
      <header class="rec-header">
        <div class="toolbar">
          <button type="button" class="back" aria-label="Voltar" @click="emit('close')">
            <SvgIcon class="back-icon" name="report-back" />
          </button>
          <h1 class="toolbar-title">
            <span class="title-text">{{ copy.title }}</span>
          </h1>
        </div>
      </header>
      <DepositRecordPanel />
    </div>
  </div>
</template>

<style scoped>
.record-modal {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 30;
  flex-direction: column;
  background-color: var(--color-bar-bg);
}

.panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-height: 0;
}

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
