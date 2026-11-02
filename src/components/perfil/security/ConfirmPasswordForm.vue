<script setup lang="ts">
/**
 * /security/confirm/password form. Painted live UI is two
 * ion-item.password bars (54px #101629, radius 10, 20px eye) — not the
 * Ot verify field. Error-text stays hidden; submit is mock.
 */
import { ref } from 'vue'
import SvgIcon from '../../base/SvgIcon.vue'
import { isValidConfirmPassword, securityConfirmCopy as copy } from '../../../api/security'

const emit = defineEmits<{
  confirm: []
  mismatch: []
}>()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)

function onSubmit() {
  if (!isValidConfirmPassword(password.value) || !isValidConfirmPassword(confirmPassword.value)) {
    return
  }
  if (password.value !== confirmPassword.value) {
    emit('mismatch')
    return
  }
  emit('confirm')
}
</script>

<template>
  <form class="confirm-form" @submit.prevent="onSubmit">
    <p class="heading">{{ copy.heading }}</p>

    <div class="item">
      <div class="bar">
        <input
          class="control"
          :type="showPassword ? 'text' : 'password'"
          maxlength="16"
          autocomplete="new-password"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
          :placeholder="copy.password"
          v-model="password"
        />
      </div>
      <button type="button" class="eye" @click="showPassword = !showPassword">
        <SvgIcon
          class="eye-icon"
          :name="showPassword ? 'security-eye-show' : 'security-eye-hide'"
        />
      </button>
    </div>

    <div class="item">
      <div class="bar">
        <input
          class="control"
          :type="showConfirm ? 'text' : 'password'"
          maxlength="16"
          autocomplete="new-password"
          spellcheck="false"
          autocapitalize="off"
          autocorrect="off"
          :placeholder="copy.confirmPassword"
          v-model="confirmPassword"
        />
      </div>
      <button type="button" class="eye" @click="showConfirm = !showConfirm">
        <SvgIcon
          class="eye-icon"
          :name="showConfirm ? 'security-eye-show' : 'security-eye-hide'"
        />
      </button>
    </div>

    <div class="submit-item">
      <button type="submit" class="submit">{{ copy.confirm }}</button>
    </div>
  </form>
</template>

<style scoped>
.heading {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: var(--color-text-100);
}

/* ion-item.password: 59 tall, margin 10px 0 5px, inner-padding-end .25rem. */
.item {
  display: block;
  position: relative;
  height: 3.6875rem;
  margin: 10px 0 5px;
  padding-right: 0.25rem;
}

/* ion-input in-item wrapper: 354×54, pad 0 16px, radius 10, bg #101629. */
.bar {
  display: flex;
  height: 3.375rem;
  padding: 0 1rem;
  align-items: center;
  background-color: #101629;
  border-radius: 0.625rem;
}

.control {
  display: block;
  width: 100%;
  height: 1.0625rem;
  margin: 0;
  padding: 0;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: normal;
  color: var(--color-text-100);
  background: transparent;
  border: 0;
  outline: none;
}

.control::placeholder {
  color: rgb(155, 167, 190);
  opacity: 0.6;
}

/* ion-icon.confirm-eye-color: 20×20, top 18 right 18, rgb(109,120,141). */
.eye {
  display: flex;
  position: absolute;
  top: 1.125rem;
  right: 1.125rem;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  color: rgb(109, 120, 141);
  background: transparent;
  border: 0;
}

.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.eye-icon :deep(g) {
  opacity: 1;
}

.submit-item {
  min-height: 3.375rem;
  margin: 1.25rem 2.5rem;
  overflow: hidden;
  filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 0.25rem 0.9375rem);
}

/* Confirm submit: 36 tall, radius 4px, weight 700 — not verify’s 10px/500. */
.submit {
  display: flex;
  width: 100%;
  height: 2.25rem;
  margin: 0;
  padding: 0.5rem 0.9625rem;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 0.875rem;
  color: var(--color-text-100);
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  border: 0;
  border-radius: 0.25rem;
}
</style>
