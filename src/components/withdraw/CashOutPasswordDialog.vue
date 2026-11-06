<script setup lang="ts">
import { withdrawCopy } from '../../api/withdraw'

const emit = defineEmits<{ confirm: [] }>()
</script>

<template>
  <div class="fund-mask" role="presentation">
    <div class="fund-card" role="dialog" aria-modal="true">
      <div class="bg-img-wrapper">
        <img class="bg-img" src="/images/popup/popup_bg.png" alt="" />
      </div>
      <img class="popup-icon" src="/images/popup/popup_icon001.png" alt="" />
      <div class="fund-body">
        <p class="fund-text">{{ tr(withdrawCopy.fundTips) }}</p>
      </div>
      <button type="button" class="fund-confirm" @click="emit('confirm')">
        {{ tr(withdrawCopy.fundTipsConfirm) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.fund-mask {
  position: fixed;
  z-index: 20030;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
}

.fund-card {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 21.25rem;
  max-width: calc(100vw - 1.5rem);
  min-height: 13.75rem;
  margin-top: 4.375rem;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 1.25rem;
}

.bg-img-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 1.125rem 1.125rem 0 0;
}

.bg-img {
  display: block;
  width: 100%;
  height: auto;
}

.popup-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  transform: translateY(-4.375rem);
  pointer-events: none;
}

.fund-body {
  display: flex;
  width: 100%;
  min-height: 3.75rem;
  margin: 1.25rem 0;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.fund-text {
  width: 16.25rem;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: #595959;
  text-align: center;
}

.fund-confirm {
  width: 6.875rem;
  height: 2.1875rem;
  margin: 0.2rem 0 calc(1.25rem + 0.2rem);
  padding: 0;
  border-radius: 0.3125rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 2.1875rem;
  color: #fff;
  background: #fba531;
}
</style>
