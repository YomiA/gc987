<script setup lang="ts">
/**
 * /security/confirm/asset PIN form. No Confirmar button — the second
 * 6-digit grid submits. Mock only; never posts to gc987.com.
 */
import { ref } from 'vue'
import PinPasswordInput from './PinPasswordInput.vue'
import { securityConfirmAssetCopy as copy } from '../../../api/security'

const emit = defineEmits<{
  confirm: []
  mismatch: []
}>()

const first = ref('')

function onFirst(value: string) {
  first.value = value
}

function onSecond(value: string) {
  if (value.length !== 6) return
  if (first.value.length !== 6 || first.value !== value) {
    emit('mismatch')
    return
  }
  emit('confirm')
}
</script>

<template>
  <form class="asset-form" @submit.prevent>
    <p class="heading">{{ copy.heading }}</p>
    <div class="fund">
      <p class="label">{{ copy.enter }}</p>
      <PinPasswordInput autofocus @input="onFirst" />
      <p class="label">{{ copy.confirm }}</p>
      <PinPasswordInput @input="onSecond" />
    </div>
  </form>
</template>

<style scoped>
.heading {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: var(--color-text-100);
}

.fund {
  padding-bottom: 1rem;
}

.label {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: rgb(109, 120, 141);
}
</style>
