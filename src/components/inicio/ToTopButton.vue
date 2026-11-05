<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ top: [] }>()
</script>

<template>
  <button
    v-show="visible"
    class="to-top-box"
    type="button"
    :aria-label="tr('TOP')"
    @click="emit('top')"
  >
    <i class="icon-wall">
      <SvgIcon class="icon" name="to-top" />
    </i>
    <span class="to-top-text">{{ tr('TOP') }}</span>
  </button>
</template>

<style scoped>
.to-top-box {
  display: flex;
  position: absolute;
  right: 1.25rem;
  bottom: calc(3.5rem + 1rem + var(--sab));
  z-index: 50;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  flex-flow: column;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.625rem;
  color: rgb(255, 255, 255);
  background-color: rgb(77, 163, 65);
  border: 0;
  border-radius: 50%;
}

.icon-wall {
  display: flex;
  width: 1.375rem;
  height: 1.375rem;
  padding-top: 1rem;
  justify-content: center;
  align-items: center;
  font-size: 1.375rem;
  color: rgb(255, 255, 255);
}

.icon {
  width: 1.375rem;
  height: 1.375rem;
  color: rgb(255, 255, 255);
}

.to-top-text {
  margin-bottom: 0.125rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.125rem;
  color: rgb(255, 255, 255);
}
</style>
