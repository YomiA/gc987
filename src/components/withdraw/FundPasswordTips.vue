<script setup lang="ts">
/**
 * Live Popup/first TIPS sheet for unset fund password (`popup.tips06`).
 * Backdrop does not dismiss. Confirmar is the only action.
 */
defineProps<{ message: string; confirm: string }>()

defineEmits<{ confirm: [] }>()
</script>

<template>
  <div class="overlay">
    <div class="main-bg" @click.stop>
      <div class="content-wrapper">
        <div class="content">{{ tr(message) }}</div>
      </div>
      <div class="btn-wrapper">
        <button type="button" class="left-btn" @click="$emit('confirm')">
          {{ tr(confirm) }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20020;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.main-bg {
  display: flex;
  position: relative;
  width: 21.25rem;
  min-height: 13.75rem;
  max-height: calc(100vh - 6rem);
  margin-top: 4.375rem;
  flex-direction: column;
  border-radius: 1.125rem;
  background-color: var(--color-bg-400);
}

.content-wrapper {
  display: flex;
  width: 100%;
  min-height: 3.75rem;
  margin: 1.25rem 0;
  flex: 1 1 0%;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
}

.content {
  width: 16.25rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}

.btn-wrapper {
  display: flex;
  margin: 0 0.5rem 1.25rem;
  align-items: center;
  justify-content: space-around;
}

.left-btn {
  width: 9.375rem;
  height: 2.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: #fff;
  text-align: center;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
}
</style>
