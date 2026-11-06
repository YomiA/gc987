<script setup lang="ts">
/**
 * /security/bind/email and /security/bind/phone. Same field chrome as the
 * email page, plus a verification-code row. The code button is disabled
 * while a minute is counting down.
 */
import { computed, ref } from 'vue'
import SvgIcon from '../../base/SvgIcon.vue'
import { isBrazilianMobile, isValidSecurityEmail, securityBindCopy as copy } from '../../../api/security'

const props = defineProps<{
  kind: 'phone' | 'email'
  cooldown: number
  sending: boolean
  sent: boolean
}>()

const emit = defineEmits<{
  confirm: [account: string, verifyCode: string]
  send: [account: string]
  tooLong: []
}>()

const account = ref('')
const code = ref('')

const error = computed(() => {
  if (!account.value) return ''
  if (props.kind === 'phone') return isBrazilianMobile(account.value) ? '' : copy.phoneError
  return isValidSecurityEmail(account.value) ? '' : copy.error
})

const sendReady = computed(() =>
  props.kind === 'phone' ? isBrazilianMobile(account.value) : isValidSecurityEmail(account.value),
)

function accountValue() {
  return props.kind === 'phone' ? account.value : account.value.replace(/\s/g, '')
}

function canSendAccount() {
  if (props.kind === 'email' && account.value.replace(/\s/g, '').length > 64) {
    emit('tooLong')
    return false
  }
  return !error.value && !!account.value
}

function onPhoneInput(event: Event) {
  account.value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 11)
}

function onCodeInput(event: Event) {
  code.value = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 8)
}

function onSend() {
  if (props.cooldown > 0 || props.sending) return
  if (!canSendAccount()) return
  emit('send', accountValue())
}

function onSubmit() {
  if (!canSendAccount() || !code.value) return
  emit('confirm', accountValue(), code.value)
}
</script>

<template>
  <form class="bind-form" @submit.prevent="onSubmit">
    <p class="heading">{{ tr(kind === 'phone' ? copy.phoneHeading : copy.heading) }}</p>

    <div class="field-wrap">
      <div class="field" :class="{ invalid: !!error }">
        <span v-if="kind === 'phone'" class="prefix">
          <span class="flag" title="BR"></span>
          <span class="dial">+55</span>
        </span>
        <div class="native">
          <input
            v-if="kind === 'phone'"
            class="control"
            type="tel"
            inputmode="numeric"
            maxlength="11"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
            :placeholder="tr(copy.phonePlaceholder)"
            required
            :value="account"
            @input="onPhoneInput"
          />
          <input
            v-else
            class="control"
            type="text"
            inputmode="email"
            maxlength="64"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
            :placeholder="tr(copy.placeholder)"
            required
            v-model="account"
          />
          <button
            type="button"
            class="clear"
            :class="{ on: !!account }"
            :aria-label="tr('reset')"
            @click="account = ''"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
          <span class="end-gap" />
        </div>
      </div>
      <div class="hint" :class="{ on: !!error }">
        <p class="error">
          <SvgIcon class="warn" name="security-warning" />{{ tr(kind === 'phone' ? copy.phoneError : copy.error) }}
        </p>
      </div>
    </div>

    <div class="code-line">
      <div class="field">
        <div class="native">
          <input
            class="control"
            type="text"
            inputmode="numeric"
            maxlength="8"
            autocomplete="one-time-code"
            spellcheck="false"
            :placeholder="tr(copy.codePlaceholder)"
            required
            :value="code"
            @input="onCodeInput"
          />
          <span class="end-gap" />
        </div>
      </div>
      <button
        type="button"
        class="send"
        :class="{ ready: sendReady }"
        :disabled="!sendReady || cooldown > 0 || sending"
        @click="onSend"
      >
        {{ cooldown > 0 ? `${cooldown}s` : tr(sent ? copy.resendCode : copy.sendCode) }}
      </button>
    </div>

    <div class="submit-item">
      <button type="submit" class="submit">{{ tr(copy.confirm) }}</button>
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

/* w-full h-[3.125rem] mt-[.625rem] mb-[2.125rem] */
.field-wrap {
  width: 100%;
  height: 3.125rem;
  margin: 0.625rem 0 1.5rem;
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
  margin-right: 0.25rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: url('../../../assets/icons/flag-br.svg') 50% 50% / contain no-repeat;
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

.code-line {
  display: flex;
  align-items: center;
}

.code-line .field {
  flex: 1 1 auto;
  min-width: 0;
}

.send {
  display: flex;
  height: 2.872rem;
  margin-left: 0.5rem;
  padding: 0 0.75rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  color: rgba(255, 255, 255, 0.35);
  white-space: nowrap;
  background: #3b4152;
  border: 0;
  border-radius: 0.625rem;
}

.send.ready {
  color: #fff;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
}

.send:disabled {
  cursor: default;
}

.send.ready:disabled {
  opacity: 0.55;
}

/* ion-input height 2.872rem; wrapper 1px #1a233e, radius 4px, pad-left 12. */
.field {
  display: flex;
  position: relative;
  height: 2.872rem;
  padding-left: 0.75rem;
  align-items: stretch;
  border: 1px solid rgb(26, 35, 62);
  border-radius: 0.25rem;
}

.field.invalid {
  border-color: rgb(230, 64, 33);
}

.native {
  display: flex;
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  align-items: center;
}

.control {
  display: block;
  width: auto;
  height: 1.0625rem;
  margin: 0;
  padding: 0;
  flex: 1 1 0%;
  min-width: 0;
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
  background: transparent;
  border: 0;
  visibility: hidden;
}

.clear.on {
  visibility: visible;
}

.clear-icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Empty ion-input end slot keeps ~16px after the clear control. */
.end-gap {
  flex: 0 0 1rem;
  width: 1rem;
  height: 100%;
}

.submit-item {
  min-height: 3.375rem;
  margin: 1.25rem 2.5rem;
  overflow: hidden;
  filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 0.25rem 0.9375rem);
}

.submit {
  display: flex;
  width: 100%;
  height: 2.3125rem;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 0.875rem;
  color: var(--color-text-100);
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  border: 0;
  border-radius: 0.625rem;
}

.hint {
  display: none;
  padding-left: 0.75rem;
}

.hint.on {
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
</style>
