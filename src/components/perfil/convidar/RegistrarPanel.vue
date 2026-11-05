<script setup lang="ts">
/**
 * /spread tab 6 — "Registrar Subordinados".
 *
 * A 360-wide form card filling the 740 viewport: a two-line hint, a Brazil
 * +55 phone field, password + confirm with eye toggles, and a 250-wide
 * gradient "Criar". Geometry is the live page at 390x844x3.
 *
 * Validation matches the live ion-input: 11 digits for the phone, 6–16
 * characters for the password, and a middle toast when the two passwords
 * disagree. Submit never talks to gc987.com — `registerSubordinate` is mock.
 */
import { onBeforeUnmount, ref } from 'vue'
import { registerSubordinate, spreadRegisterCopy as copy } from '../../../api/spread'
import SvgIcon from '../../base/SvgIcon.vue'

const phone = ref('')
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const phoneTouched = ref(false)
const passwordTouched = ref(false)
const toast = ref('')
let toastTimer = 0

onBeforeUnmount(() => window.clearTimeout(toastTimer))

const phoneError = () =>
  phoneTouched.value && !/^\d{11}$/.test(phone.value) ? copy.phoneError : ''
const passwordError = () => {
  if (!passwordTouched.value) return ''
  const n = password.value.length
  return n < 6 || n > 16 ? copy.passwordError : ''
}

function onPhoneInput(event: Event) {
  phone.value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
}

function showToast(message: string) {
  window.clearTimeout(toastTimer)
  toast.value = message
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 2000)
}

async function onSubmit() {
  phoneTouched.value = true
  passwordTouched.value = true
  if (phoneError() || passwordError()) return
  if (password.value !== confirm.value) {
    showToast(copy.mismatch)
    return
  }
  await registerSubordinate({ phone: phone.value, password: password.value })
  showToast(copy.success)
  phone.value = ''
  password.value = ''
  confirm.value = ''
  phoneTouched.value = false
  passwordTouched.value = false
  showPassword.value = false
  showConfirm.value = false
}
</script>

<template>
  <form class="reg" @submit.prevent="onSubmit">
    <p class="hint">{{ tr(copy.hint) }}</p>

    <div class="item" :class="{ err: !!phoneError() }">
      <div class="field has-prefix">
        <span class="prefix">
          <SvgIcon class="flag" name="flag-br" />
          <span class="dial">{{ tr(copy.dial) }}</span>
        </span>
        <input
          class="control"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          maxlength="11"
          :placeholder="tr(copy.phonePlaceholder)"
          :value="phone"
          @input="onPhoneInput"
          @blur="phoneTouched = true"
        />
        <button v-if="phone" type="button" class="clear" @click="phone = ''">
          <SvgIcon class="clear-icon" name="register-clear" />
        </button>
      </div>
      <p v-if="phoneError()" class="error">{{ tr(phoneError()) }}</p>
    </div>

    <div class="item" :class="{ err: !!passwordError() }">
      <div class="field">
        <input
          class="control"
          :type="showPassword ? 'text' : 'password'"
          maxlength="16"
          autocomplete="new-password"
          :placeholder="tr(copy.passwordPlaceholder)"
          v-model="password"
          @blur="passwordTouched = true"
        />
      </div>
      <button type="button" class="eye" @click="showPassword = !showPassword">
        <SvgIcon :name="showPassword ? 'register-eye-off' : 'register-eye'" />
      </button>
      <p v-if="passwordError()" class="error">{{ tr(passwordError()) }}</p>
    </div>

    <div class="item">
      <div class="field">
        <input
          class="control"
          :type="showConfirm ? 'text' : 'password'"
          maxlength="16"
          autocomplete="new-password"
          :placeholder="tr(copy.confirmPlaceholder)"
          v-model="confirm"
        />
      </div>
      <button type="button" class="eye" @click="showConfirm = !showConfirm">
        <SvgIcon :name="showConfirm ? 'register-eye-off' : 'register-eye'" />
      </button>
    </div>

    <button type="submit" class="submit"><span class="submit-inner">{{ tr(copy.submit) }}</span></button>
  </form>

  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast" class="toast-root">
        <div class="toast-panel">
          <p class="toast-msg">{{ tr(toast) }}</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* form: 360 wide, 15px side margin, 10 padding, radius 10, --color-bg-400.
   Live is `flex flex-col`, so the last item's 10px margin adds to Criar's 2rem. */
.reg {
  display: flex;
  width: 22.5rem;
  height: 100%;
  padding: 0.625rem;
  margin: 0 auto;
  flex-direction: column;
  overflow-y: auto;
  border-radius: 0.625rem;
  background-color: #101629;
  scrollbar-width: none;
}

.reg::-webkit-scrollbar {
  display: none;
}

/* .illustrate[data-v-eac92d26]: 21.25rem, 20px vertical, 6.4px side, 12/14 white. */
.hint {
  width: 21.25rem;
  margin: 1.25rem auto;
  padding: 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 0.875rem;
  color: var(--color-text-100);
}

/* ion-item 340x48, mb 10. Live ion-input is 45px centred in the 48px item
   (1.5px down) with a 40px dark bar at the top of that host. Item/bar heights
   stay px on desktop; rem would inflate them. Grows to 60 when the error shows. */
.item {
  position: relative;
  width: 21.25rem;
  height: 48px;
  margin: 0 auto 0.625rem;
}

.item.err {
  height: auto;
  min-height: 60px;
}

.field {
  display: flex;
  position: relative;
  height: 40px;
  margin-top: 1.5px;
  align-items: center;
  overflow: hidden;
  background-color: #090f1f;
  border-radius: 0.625rem;
}

/* Confirm's ion-input is 40px (not 45) so it centres in the 48px item — 4px
   from the item top, 2.5px lower than the phone/senha bars. */
.item:last-of-type .field {
  margin-top: 4px;
}

.prefix {
  display: flex;
  height: 40px;
  padding: 0 1rem 0 0.625rem;
  align-items: center;
  flex: 0 0 auto;
}

.flag {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
  overflow: hidden;
  border-radius: 0.75rem;
}

.dial {
  padding-left: 0.5rem;
  border-left: 2px solid rgb(255, 255, 255);
  font-size: 12px;
  line-height: normal;
  color: rgb(135, 146, 175);
}

.control {
  flex: 1 1 0%;
  min-width: 0;
  height: auto;
  padding: 0 0 0 0.625rem;
  background: transparent;
  border: 0;
  outline: none;
  appearance: none;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  color: var(--color-text-100);
}

.has-prefix .control {
  padding-left: 0;
}

.control::placeholder {
  color: rgb(135, 146, 175);
  opacity: 1;
}

.clear {
  display: flex;
  width: 1.875rem;
  height: 1.875rem;
  flex: 0 0 auto;
  justify-content: center;
  align-items: center;
}

.clear-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: rgb(135, 146, 175);
}

/* Overlay is on the 48px ion-item (not the 40px bar): top 4, right 6,
   min-height 36, flex items-center, 20x20 glyph. */
.eye {
  display: flex;
  position: absolute;
  top: 4px;
  right: 6px;
  z-index: 2;
  width: 20px;
  min-height: 36px;
  justify-content: center;
  align-items: center;
  color: rgb(109, 120, 141);
}

.eye :deep(.svg-icon) {
  width: 20px;
  height: 20px;
}

.error {
  padding: 0.3125rem 0 0 0.625rem;
  font-size: 0.625rem;
  line-height: 0.9375rem;
  color: rgb(255, 0, 0);
}

/* ion-item.submit is the 40px gradient; the label is a small clear ion-button
   (25px, padding 2px, line-height = font-size) flex-centered inside it. */
.submit {
  display: flex;
  width: 15.625rem;
  height: 40px;
  margin: 2rem auto 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.625rem;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
  filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 0.25rem 0.9375rem);
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 0.875rem;
  color: var(--color-text-100);
  text-align: center;
}

.submit-inner {
  display: flex;
  width: 100%;
  height: 25px;
  min-height: 25px;
  padding: 2px 0.6em;
  align-items: center;
  justify-content: center;
  line-height: 0.875rem;
}

.toast-root {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 20080;
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
  padding: 0.9375rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  color: rgb(244, 245, 248);
  text-align: center;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.15s linear;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>
