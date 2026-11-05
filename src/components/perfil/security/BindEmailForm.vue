<script setup lang="ts">
/**
 * /security/bind/email form. Same 16px-padded Validação chrome as the
 * verify pages. Field is the live Ot email input (no key, no eye): 12px
 * start pad, 30×30 clear, ~16px end gap. Error uses the same warning
 * glyph + 12px/16.8 rgb(197,0,15) as the login-password field.
 */
import { computed, ref } from 'vue'
import SvgIcon from '../../base/SvgIcon.vue'
import { isValidSecurityEmail, securityBindCopy as copy } from '../../../api/security'

const emit = defineEmits<{
  confirm: [email: string]
  tooLong: []
}>()

const email = ref('')

const error = computed(() => {
  if (!email.value) return ''
  return isValidSecurityEmail(email.value) ? '' : copy.error
})

function onSubmit() {
  if (email.value.replace(/\s/g, '').length > 64) {
    emit('tooLong')
    return
  }
  if (error.value || !email.value) return
  emit('confirm', email.value.replace(/\s/g, ''))
}
</script>

<template>
  <form class="bind-form" @submit.prevent="onSubmit">
    <p class="heading">{{ tr(copy.heading) }}</p>

    <div class="field-wrap">
      <div class="field" :class="{ invalid: !!error }">
        <div class="native">
          <input
            class="control"
            type="text"
            inputmode="email"
            maxlength="64"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
            :placeholder="tr(copy.placeholder)"
            v-model="email"
          />
          <button
            type="button"
            class="clear"
            :class="{ on: !!email }"
            :aria-label="tr('reset')"
            @click="email = ''"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
          <span class="end-gap" />
        </div>
      </div>
      <div class="hint" :class="{ on: !!error }">
        <p class="error"><SvgIcon class="warn" name="security-warning" />{{ tr(copy.error) }}</p>
      </div>
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
  margin: 0.625rem 0 2.125rem;
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
