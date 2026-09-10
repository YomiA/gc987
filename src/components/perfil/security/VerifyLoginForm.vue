<script setup lang="ts">
/**
 * Shared first-step form on /security/verify/password and
 * /security/verify/asset. Both pages reuse the live login-password field
 * (key + Senha de Login placeholder + clear + 16px eye). Confirmar stays
 * on this page — the live next step is not cloned.
 */
import { computed, ref } from 'vue'
import SvgIcon from '../../base/SvgIcon.vue'
import { securityVerifyCopy as copy } from '../../../api/security'

defineProps<{ showIntro: boolean }>()

const password = ref('')
const showPassword = ref(false)

/** Live ion-input: empty and 6–16 hide the hint; 1–5 chars show it immediately. */
const error = computed(() => {
  const n = password.value.length
  return n >= 1 && n < 6 ? copy.error : ''
})

function onSubmit() {
  if (error.value || password.value.length < 6) return
}
</script>

<template>
  <form class="verify-form" @submit.prevent="onSubmit">
    <div v-if="showIntro" class="intro">
      <p class="heading">{{ copy.loginHeading }}</p>
      <p class="tip">{{ copy.loginTip }}</p>
    </div>
    <div v-else class="intro-slot" />

    <div class="field-wrap">
      <div class="field" :class="{ invalid: !!error }">
        <span class="icon-slot">
          <SvgIcon class="key" name="security-key" />
        </span>
        <div class="native">
          <input
            class="control"
            :type="showPassword ? 'text' : 'password'"
            maxlength="16"
            autocomplete="new-password"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
            :placeholder="copy.placeholder"
            v-model="password"
          />
          <button
            type="button"
            class="clear"
            :class="{ on: !!password }"
            aria-label="reset"
            @click="password = ''"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
          <div class="eye-slot">
            <div class="eye-pad">
              <button type="button" class="eye" @click="showPassword = !showPassword">
                <SvgIcon :name="showPassword ? 'security-eye-show' : 'security-eye-hide'" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="hint" :class="{ on: !!error }">
        <p class="error"><SvgIcon class="warn" name="security-warning" />{{ copy.error }}</p>
      </div>
    </div>

    <div class="submit-item">
      <button type="submit" class="submit">{{ copy.confirm }}</button>
    </div>
  </form>
</template>

<style scoped>
.intro {
  margin: 0;
}

/* p.mb-1.text-sm.verify-white-color: 14px/20px white, margin-bottom 4px. */
.heading {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: var(--color-text-100);
}

/* p.text-[.625rem].verify-minor-color: 10px/15px rgb(109,120,141). */
.tip {
  margin: 0;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
  color: rgb(109, 120, 141);
}

/* Empty title slot on /security/verify/asset — height 0, field still has mt. */
.intro-slot {
  display: block;
}

/* h-[3.125rem] w-full mt-[.625rem] mb-[2.125rem] */
.field-wrap {
  width: 100%;
  height: 3.125rem;
  margin: 0.625rem 0 2.125rem;
}

/* ion-input height --v590f90e0 = 2.872rem; wrapper 1px #1a233e, radius 4px. */
.field {
  display: flex;
  position: relative;
  height: 2.872rem;
  padding-left: 0.75rem;
  align-items: stretch;
  border: 1px solid rgb(26, 35, 62);
  border-radius: 0.25rem;
}

/* ion-invalid .input-wrapper: 1px solid var(--color-danger) → rgb(230, 64, 33). */
.field.invalid {
  border-color: rgb(230, 64, 33);
}

/* Ionic label slot: 24 wide, margin-right 4px, icon 24×24 overflow hidden. */
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
  overflow: hidden;
  color: var(--color-text-100);
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

/* Ionic input-clear-icon: 30×30, always in layout, visibility hidden when empty. */
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

/* slot=end wrapper: ml 16px; inner pr-[.8125rem]; icon 16×16. */
.eye-slot {
  display: flex;
  height: 100%;
  margin-left: 1rem;
  flex: 0 0 auto;
  align-items: center;
}

.eye-pad {
  display: flex;
  height: 100%;
  padding-right: 0.8125rem;
  align-items: center;
}

.eye {
  display: flex;
  width: 1rem;
  height: 1rem;
  padding: 0;
  color: var(--color-text-100);
  background: transparent;
  border: 0;
}

/* ion-item.submit host 54 tall, overflow hidden; native bar 278×37. */
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

/* .input-bottom under ion-invalid: padding-top 0, padding-left 12px, 12px/1.4.
   Sits in the wrap's 34px bottom margin; does not push Confirmar. */
.hint {
  display: none;
  padding-left: 0.75rem;
}

.hint.on {
  display: block;
}

/* .error-text: 12px/16.8px rgb(197,0,15), padding-left 6px, position relative. */
.error {
  position: relative;
  margin: 0;
  padding-left: 0.375rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.4;
  color: rgb(197, 0, 15);
}

/* ::after warning SVG: 16×16, top 0, left -12px. Fill is #D74141 on the glyph. */
.warn {
  position: absolute;
  top: 0;
  left: -0.75rem;
  width: 1rem;
  height: 1rem;
}
</style>
