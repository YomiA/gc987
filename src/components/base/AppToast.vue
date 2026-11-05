<script setup lang="ts">
import { toastState } from '../../toast'
</script>

<template>
  <div v-if="toastState.open" class="app-toast" :class="toastState.kind" role="status">
    <svg v-if="toastState.kind === 'success'" class="icon" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208 208-93.31 208-208S370.69 48 256 48zm108.25 138.29-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32 122.59-145.91a16 16 0 0 1 24.5 20.58z"
      />
    </svg>
    <p class="msg">{{ tr(toastState.message) }}</p>
  </div>
</template>

<style scoped>
.app-toast {
  position: fixed;
  z-index: 30000;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: max-content;
  min-width: 10rem;
  max-width: min(var(--app-max-width, 486px), calc(100vw - 2rem));
  height: auto;
  overflow: visible;
  background: #1a1d22;
  border-radius: 0.5rem;
  box-shadow:
    0 3px 5px -1px rgba(0, 0, 0, 0.2),
    0 6px 10px 0 rgba(0, 0, 0, 0.14),
    0 1px 18px 0 rgba(0, 0, 0, 0.12);
}

.icon {
  width: 1.75rem;
  height: 1.75rem;
  margin-inline-start: 0.75rem;
  flex: 0 0 auto;
  fill: var(--ion-color-warning);
}

.msg {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding: 0.75rem;
  overflow: visible;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25;
  text-align: center;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: break-word;
  color: var(--ion-color-light);
}

.success .icon {
  fill: var(--ion-color-success);
}

.success .msg,
.warning .msg {
  text-align: start;
}
</style>
