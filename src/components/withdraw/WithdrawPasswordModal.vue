<script setup lang="ts">
/**
 * Original `#confirmModalWithdraw` password step. The 6-cell grid is the
 * same control used to set the asset password. The order is sent only after
 * Retirar Agora is clicked.
 */
import { ref } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import SuffixDots from '../entrar/SuffixDots.vue'
import PinPasswordInput from '../perfil/security/PinPasswordInput.vue'
import { withdrawCopy as copy } from '../../api/withdraw'
import { formatAmount } from '../../utils/money'

defineProps<{
  amountCents: number
  submitting: boolean
}>()

const emit = defineEmits<{
  close: []
  confirm: [password: string]
}>()

const password = ref('')

function onConfirm() {
  if (password.value.length !== 6) return
  emit('confirm', password.value)
}
</script>

<template>
  <div class="overlay" @click="$emit('close')">
    <div class="pop-wrap" role="dialog" aria-modal="true" :aria-label="copy.passwordTitle" @click.stop>
      <button type="button" class="close" aria-label="Fechar" :disabled="submitting" @click="$emit('close')">
        <SvgIcon class="close-icon" name="close" />
      </button>
      <p class="title">{{ copy.passwordTitle }}</p>
      <p class="action">{{ copy.passwordAction }}</p>
      <p class="amount">
        <span>{{ copy.currency }}</span
        ><span class="sum">{{ formatAmount(amountCents) }}</span>
      </p>
      <div class="line" />
      <PinPasswordInput class="password-input" autofocus @input="password = $event" />
      <button
        type="button"
        class="submit"
        :disabled="password.length !== 6 || submitting"
        @click="onConfirm"
      >
        {{ copy.submit }}<SuffixDots :on="submitting" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20021;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.pop-wrap {
  position: relative;
  width: 22.875rem;
  max-width: calc(100% - 1.5rem);
  margin-top: 8.375rem;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 0.625rem;
  background-color: #090f1f;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.close {
  position: absolute;
  top: 0.875rem;
  right: 0.4375rem;
  display: flex;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  background: transparent;
}

.close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.title {
  margin: 0;
  padding-right: 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5rem;
  text-align: left;
  color: #8792af;
}

.action {
  margin: 1.125rem 0 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: #8792af;
}

.amount {
  margin: 0.75rem 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.125rem;
  color: var(--color-currency);
}

.sum {
  margin-left: 0.1875rem;
}

.line {
  height: 1px;
  width: 100%;
  background: var(--line-color);
}

.password-input {
  margin: 0.75rem 0 1.3125rem;
}

.submit {
  display: block;
  width: 60%;
  height: 2.5rem;
  margin: 0.75rem auto 0;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: #fff;
  text-align: center;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 4px 15px);
}

.submit:disabled {
  opacity: 0.5;
}
</style>
