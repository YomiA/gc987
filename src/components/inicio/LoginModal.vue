<script setup lang="ts">
/**
 * Homepage auth overlay (#login-modal). Header Entrar / Registro and the
 * in-sheet switch share this sheet. Login posts /login. Register posts
 * /register. Forgot-password did not open in the live session.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { showToast } from '../../toast'
import SvgIcon from '../base/SvgIcon.vue'

const REMEMBER_KEY = 'gc987-remember-login'
const SHEET_MS = 280

const props = defineProps<{ mode: 'login' | 'register' }>()
const emit = defineEmits<{
  close: []
  'update:mode': ['login' | 'register']
}>()

const phone = ref('')
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const remember = ref(true)
const submitting = ref(false)
const sheetIn = ref(false)
let leaveTimer = 0
const auth = useAuthStore()
const { t } = useI18n()

const isLogin = computed(() => props.mode === 'login')
const title = computed(() => (isLogin.value ? t('login.title') : t('login.registerTitle')))
const hint = computed(() => (isLogin.value ? t('login.noAccount') : t('login.hasAccount')))
const switchLabel = computed(() => (isLogin.value ? t('login.register') : t('login.enter')))
const submitLabel = computed(() => (isLogin.value ? t('login.enter') : t('login.register')))

const phoneOk = computed(() => /^\d{11}$/.test(phone.value))
/** Live ion-input: empty hides the hint; the first typed char starts validation. */
const phoneError = computed(() => (phone.value.length >= 1 && !phoneOk.value ? t('login.phoneInvalid') : ''))
const passwordError = computed(() => {
  const n = password.value.length
  return n >= 1 && (n < 6 || n > 16) ? t('login.passwordRule') : ''
})
const confirmError = computed(() => {
  const n = confirm.value.length
  if (n >= 1 && (n < 6 || n > 16)) return t('login.passwordRule')
  if (n >= 1 && confirm.value !== password.value) return t('login.passwordMismatch')
  return ''
})
const phoneValid = computed(() => phoneOk.value)
const passwordValid = computed(() => password.value.length >= 6 && password.value.length <= 16)
const confirmValid = computed(
  () => confirm.value.length >= 6 && confirm.value.length <= 16 && confirm.value === password.value,
)

const canSubmit = computed(() => {
  if (!phoneOk.value) return false
  if (password.value.length < 6 || password.value.length > 16) return false
  if (!isLogin.value && !confirmValid.value) return false
  return true
})

function onPhoneInput(event: Event) {
  phone.value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
}

function toggleMode() {
  emit('update:mode', isLogin.value ? 'register' : 'login')
}

function persistRemember() {
  if (remember.value) {
    localStorage.setItem(
      REMEMBER_KEY,
      JSON.stringify({ phone: phone.value, password: password.value }),
    )
  } else {
    localStorage.removeItem(REMEMBER_KEY)
  }
}

async function onSubmit() {
  if (!canSubmit.value || submitting.value) return
  submitting.value = true
  try {
    if (isLogin.value) await auth.login(phone.value, password.value)
    else await auth.register(phone.value, password.value)
    persistRemember()
    dismiss()
  } catch (error) {
    showToast(
      error instanceof Error
        ? error.message
        : isLogin.value
          ? t('login.failed')
          : t('login.registerFailed'),
      'error',
    )
  } finally {
    submitting.value = false
  }
}

function dismiss() {
  sheetIn.value = false
  window.clearTimeout(leaveTimer)
  leaveTimer = window.setTimeout(() => emit('close'), SHEET_MS)
}

watch(
  () => props.mode,
  () => {
    confirm.value = ''
    showConfirm.value = false
    showPassword.value = false
  },
)

onMounted(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sheetIn.value = true
    })
  })
  try {
    const raw = localStorage.getItem(REMEMBER_KEY)
    if (!raw) return
    const saved = JSON.parse(raw) as { phone?: string; password?: string }
    if (saved.phone) phone.value = saved.phone.replace(/\D/g, '').slice(0, 11)
    if (saved.password) password.value = saved.password.slice(0, 16)
    remember.value = true
  } catch {
    /* mock remember is best-effort */
  }
})

onBeforeUnmount(() => window.clearTimeout(leaveTimer))
</script>

<template>
  <div
    class="login-modal"
    :class="{ in: sheetIn }"
    role="dialog"
    aria-modal="true"
    :aria-label="tr(title)"
  >
    <div class="warpper">
      <div class="chrome">
        <div class="header-content">
          <img class="logo" src="/images/brand/LOGO.png" alt="logo" />
          <button class="btn-close" type="button" :aria-label="tr('Fechar')" @click="dismiss()">
            <SvgIcon class="close-icon" name="login-close" />
          </button>
        </div>
      </div>

      <div class="sheet">
        <div class="sheet-header" :class="mode">
          <p class="title">{{ tr(title) }}</p>
          <span class="switch-row">
            <span class="hint">{{ tr(hint) }}</span>
            <button class="switch" type="button" @click="toggleMode">{{ tr(switchLabel) }}</button>
          </span>
        </div>

        <div class="form-wrapper">
          <form class="form" autocomplete="off" @submit.prevent="onSubmit">
            <div class="item-height">
              <div class="field" :class="{ invalid: !!phoneError, valid: phoneValid }">
                <span class="prefix">
                  <span class="flag" title="BR"></span>
                  <span class="dial">+55</span>
                </span>
                <input
                  class="control"
                  type="tel"
                  inputmode="numeric"
                  name="username"
                  autocomplete="username"
                  maxlength="11"
                  required
                  :placeholder="t('login.phone')"
                  :value="phone"
                  @input="onPhoneInput"
                />
                <button
                  type="button"
                  class="clear"
                  :class="{ on: !!phone }"
                  :aria-label="tr('reset')"
                  @click="phone = ''"
                >
                  <SvgIcon class="clear-icon" name="register-clear" />
                </button>
              </div>
              <div class="hint-line" :class="{ on: !!phoneError }">
                <p class="error">
                  <SvgIcon class="warn" name="security-warning" />{{ tr(phoneError) }}
                </p>
              </div>
            </div>

            <div class="item-height">
              <div
                class="field"
                :class="{ invalid: !!passwordError, valid: passwordValid }"
              >
                <span class="icon-slot">
                  <SvgIcon class="key" name="security-key" />
                </span>
                <input
                  class="control"
                  :type="showPassword ? 'text' : 'password'"
                  :autocomplete="isLogin ? 'current-password' : 'new-password'"
                  minlength="6"
                  maxlength="16"
                  required
                  :placeholder="t('login.password')"
                  v-model="password"
                />
                <button
                  type="button"
                  class="clear"
                  :class="{ on: !!password }"
                  :aria-label="tr('reset')"
                  @click="password = ''"
                >
                  <SvgIcon class="clear-icon" name="register-clear" />
                </button>
                <div class="eye-slot">
                  <button type="button" class="eye" @click="showPassword = !showPassword">
                    <SvgIcon :name="showPassword ? 'security-eye-show' : 'security-eye-hide'" />
                  </button>
                </div>
              </div>
              <div class="hint-line" :class="{ on: !!passwordError }">
                <p class="error">
                  <SvgIcon class="warn" name="security-warning" />{{ tr(passwordError) }}
                </p>
              </div>
            </div>

            <div v-if="!isLogin" class="item-height">
              <div
                class="field"
                :class="{ invalid: !!confirmError, valid: confirmValid }"
              >
                <span class="icon-slot">
                  <SvgIcon class="key" name="security-key" />
                </span>
                <input
                  class="control"
                  :type="showConfirm ? 'text' : 'password'"
                  autocomplete="new-password"
                  minlength="6"
                  maxlength="16"
                  required
                  :placeholder="t('login.confirm')"
                  v-model="confirm"
                />
                <button
                  type="button"
                  class="clear"
                  :class="{ on: !!confirm }"
                  :aria-label="tr('reset')"
                  @click="confirm = ''"
                >
                  <SvgIcon class="clear-icon" name="register-clear" />
                </button>
                <div class="eye-slot">
                  <button type="button" class="eye" @click="showConfirm = !showConfirm">
                    <SvgIcon :name="showConfirm ? 'security-eye-show' : 'security-eye-hide'" />
                  </button>
                </div>
              </div>
              <div class="hint-line" :class="{ on: !!confirmError }">
                <p class="error">
                  <SvgIcon class="warn" name="security-warning" />{{ tr(confirmError) }}
                </p>
              </div>
            </div>

            <div v-if="isLogin" class="remember-account">
              <button
                type="button"
                class="checkbox"
                :class="{ on: remember }"
                :aria-checked="remember"
                role="checkbox"
                @click="remember = !remember"
              >
                <svg v-if="remember" class="check-mark" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1.73,12.91 8.1,19.28 22.79,4.59" />
                </svg>
              </button>
              <span class="text-warpper">
                <span>{{ t('login.remember') }}</span>
                <span>{{ t('login.forgot') }}</span>
              </span>
            </div>

            <div class="btn-login">
              <button
                class="submit"
                type="submit"
                :class="{ on: canSubmit && !submitting }"
                :disabled="!canSubmit || submitting"
              >
                {{ tr(submitLabel) }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-modal {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20009;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0);
  /* Live .modal-wrapper: 280ms cubic-bezier(0.36, 0.66, 0.04, 1) */
  transition: background-color 280ms cubic-bezier(0.36, 0.66, 0.04, 1);
}

.login-modal.in {
  background-color: rgba(0, 0, 0, 0.6);
}

.warpper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  transform: translate3d(0, 100%, 0);
  transition: transform 280ms cubic-bezier(0.36, 0.66, 0.04, 1);
  /* ion-modal#login-modal::part(content) { backdrop-filter: blur(4.45px) }
     Frosted homepage shows through the transparent logo/close chrome. */
  backdrop-filter: blur(4.45px);
  -webkit-backdrop-filter: blur(4.45px);
}

.login-modal.in .warpper {
  transform: none;
}

.chrome {
  width: 100%;
  height: 6.06rem;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  width: 100%;
  padding-top: 0.75rem;
  align-items: center;
  justify-content: space-between;
}

.logo {
  max-width: 7.5rem;
  height: 1.75rem;
  object-fit: contain;
}

.btn-close {
  display: flex;
  width: 1.875rem;
  height: 1.875rem;
  align-items: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.close-icon {
  width: 0.75rem;
  height: 0.75rem;
}

.sheet {
  display: flex;
  width: 100%;
  height: calc(100% - 6.06rem);
  padding: 0 1rem;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg-400);
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: var(--more-link) 0 2px 0 0 inset;
  filter: drop-shadow(rgba(3, 177, 58, 0.44) 0 -14px 60px);
}

.sheet-header {
  padding: 2.8rem 0 2.37rem;
}

.sheet-header.register {
  padding: 1.0625rem 0 0.9375rem;
}

.title {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text-100);
}

.switch-row {
  display: inline;
}

.hint {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  padding-right: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.switch {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3125rem;
  color: var(--color-currency);
}

.form-wrapper {
  display: flex;
  flex: 1 1 auto;
  min-height: 0;
  padding-top: 0.5rem;
  flex-direction: column;
  overflow: auto;
  scrollbar-width: none;
}

.form-wrapper::-webkit-scrollbar {
  display: none;
}

.form {
  padding-bottom: 0.9375rem;
}

.item-height {
  height: 4.375rem;
}

.field {
  display: flex;
  position: relative;
  height: 2.872rem;
  padding-left: 0.75rem;
  align-items: center;
  background-color: rgb(26, 29, 34);
  border: 1px solid rgb(26, 35, 62);
  border-radius: 0.25rem;
}

.field.valid {
  border-color: rgb(39, 212, 139);
}

.field.invalid {
  border-color: rgb(230, 64, 33);
}

.prefix {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-right: 0.25rem;
  line-height: 0;
}

.flag {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
  line-height: 1.25rem;
  margin-right: 0.25rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background-image: url('../../assets/icons/flag-br.svg');
  background-size: contain;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  /* Live ion-input flag sits ~1px higher than +55; keep the SVG centered so the green disc stays full. */
  transform: translateY(-1px);
}

.dial {
  padding-right: 0.625rem;
  margin-right: 0.375rem;
  border-right: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 0.875rem;
  line-height: normal;
  color: var(--color-text-100);
}

.icon-slot {
  display: flex;
  width: 1.5rem;
  margin-right: 0.25rem;
  flex: 0 0 auto;
  align-items: center;
}

.key {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-100);
}

.control {
  display: block;
  width: auto;
  min-width: 0;
  height: 1.0625rem;
  margin: 0;
  padding: 0;
  flex: 1 1 0%;
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
  color: rgba(255, 255, 255, 0.4);
  opacity: 1;
}

.clear {
  display: flex;
  width: 1.875rem;
  height: 1.875rem;
  margin: 0;
  padding: 0;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: rgb(153, 153, 153);
  visibility: hidden;
}

.clear.on {
  visibility: visible;
}

.clear-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.eye-slot {
  display: flex;
  height: 100%;
  padding-right: 0.8125rem;
  margin-left: 1rem;
  flex: 0 0 auto;
  align-items: center;
}

.eye {
  display: flex;
  width: 1rem;
  height: 1rem;
  color: var(--color-text-100);
}

.hint-line {
  display: none;
  padding-left: 0.75rem;
}

.hint-line.on {
  display: block;
}

.error {
  position: relative;
  margin: 0;
  padding-left: 0.375rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  color: rgb(197, 0, 15);
}

.warn {
  position: absolute;
  top: 0;
  left: -0.75rem;
  width: 1rem;
  height: 1rem;
}

.remember-account {
  display: flex;
  margin-bottom: 1.875rem;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.4);
}

.checkbox {
  display: flex;
  width: 1rem;
  height: 1rem;
  padding: 2px;
  box-sizing: border-box;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0.25rem;
}

.checkbox.on {
  background-image: var(--color-checkbox-bg);
  border: 0;
}

.check-mark {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  fill: none;
  stroke: rgb(255, 255, 255);
  stroke-width: 4;
  stroke-linecap: butt;
  stroke-linejoin: miter;
}

.text-warpper {
  display: flex;
  flex: 1 1 0%;
  padding: 0 0.25rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.625rem;
  color: rgba(255, 255, 255, 0.4);
}

.btn-login {
  margin-bottom: 1rem;
}

.submit {
  display: flex;
  width: 100%;
  height: 2.875rem;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 0.875rem;
  color: rgba(255, 255, 255, 0.4);
  background-image: linear-gradient(0deg, rgb(11, 56, 104) -13.77%, rgb(27, 76, 118) 102.34%);
  border-radius: 0.25rem;
}

.submit:disabled {
  cursor: default;
  /* ion-button host opacity 0.5 when disabled; native fill stays the
     gradient and this composites it onto the dark sheet. */
  opacity: 0.5;
}

.submit.on {
  color: rgb(255, 255, 255);
  background-image: none;
  background-color: var(--more-link);
  opacity: 1;
}
</style>
