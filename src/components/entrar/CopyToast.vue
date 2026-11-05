<script setup lang="ts">
/**
 * Middle ion-toast stand-in. Live: duration 2000, position middle,
 * message "Cópia Bem-sucedida".
 */
defineProps<{ message: string }>()
</script>

<template>
  <div class="toast-root">
    <div class="toast-panel">
      <p class="toast-msg">{{ tr(message) }}</p>
    </div>
  </div>
</template>

<style scoped>
.toast-root {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 60013;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.toast-panel {
  max-width: 18rem;
  background-color: #1a1d22;
  border-radius: 0.5rem;
}

.toast-msg {
  margin: 0;
  padding: 0.9375rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  color: rgb(244, 245, 248);
  text-align: center;
}
</style>
