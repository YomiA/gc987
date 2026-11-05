<script setup lang="ts">
/**
 * Real-name gate for a deposit channel whose realNamePayStatus is 1.
 * Copy and fields follow the live Vincular CPF form: Nome + CPF ID.
 * The shell is the live centered ion-modal (same dim and radius as Sair).
 */
import { computed, ref } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import SuffixDots from './SuffixDots.vue'

const props = defineProps<{ submitting?: boolean }>()
const emit = defineEmits<{
  close: []
  confirm: [name: string, idNo: string]
}>()

const name = ref('')
const idNo = ref('')
const nameTouched = ref(false)
const idTouched = ref(false)

const nameError = computed(() => (nameTouched.value && !name.value.trim() ? 'Nome inválido' : ''))
const idError = computed(() => (idTouched.value && !idNo.value.trim() ? 'CPF inválido' : ''))
const canSubmit = computed(() => name.value.trim().length > 0 && idNo.value.trim().length > 0)

function onName(event: Event) {
  name.value = (event.target as HTMLInputElement).value.slice(0, 64)
  nameTouched.value = true
}

function onId(event: Event) {
  idNo.value = (event.target as HTMLInputElement).value.replace(/[^\dXx]/g, '').slice(0, 18).toUpperCase()
  idTouched.value = true
}

function submit() {
  nameTouched.value = true
  idTouched.value = true
  if (!canSubmit.value) return
  emit('confirm', name.value.trim(), idNo.value)
}
</script>

<template>
  <div class="overlay" @click="emit('close')">
    <div class="dialog" role="dialog" :aria-label="tr('Vincular CPF')" @click.stop>
      <h2 class="title">{{ tr('Vincular CPF') }}</h2>
      <p class="tip">
        {{ tr('Caro usuário, o canal de pagamento atual precisa que você complete suas informações de identidade de pagamento. Para garantir um processo de pagamento tranquilo, por favor, preencha as seguintes informações') }}
      </p>

      <div class="item">
        <p class="label">{{ tr('Nome') }}</p>
        <div class="input-area" :class="{ invalid: nameError }">
          <input
            class="text-input"
            type="text"
            maxlength="64"
            autocomplete="name"
            :placeholder="tr('Por favor, insira seu nome')"
            :value="name"
            @input="onName"
          />
          <button
            type="button"
            class="clear"
            :class="{ hide: name === '' }"
            :aria-label="tr('reset')"
            @click="name = ''"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
        </div>
        <p v-if="nameError" class="error">{{ tr(nameError) }}</p>
      </div>

      <div class="item">
        <p class="label">{{ tr('CPF ID') }}</p>
        <div class="input-area" :class="{ invalid: idError }">
          <input
            class="text-input"
            type="tel"
            inputmode="numeric"
            maxlength="18"
            autocomplete="off"
            :placeholder="tr('Por favor, insira o CPF ID para pagamento')"
            :value="idNo"
            @input="onId"
          />
          <button
            type="button"
            class="clear"
            :class="{ hide: idNo === '' }"
            :aria-label="tr('reset')"
            @click="idNo = ''"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
        </div>
        <p v-if="idError" class="error">{{ tr(idError) }}</p>
      </div>

      <button
        type="button"
        class="submit"
        :class="{ loading: props.submitting }"
        :disabled="!canSubmit || props.submitting"
        @click="submit"
      >{{ tr('Enviar') }}<SuffixDots :on="props.submitting" /></button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20018;
  justify-content: center;
  align-items: center;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.8);
}

.dialog {
  width: 22.875rem;
  max-width: 100%;
  padding: 1.0625rem 0.75rem 1.25rem;
  border-radius: 0.625rem;
  background-color: #090f1f;
}

.title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.6875rem;
  color: #fff;
  text-align: center;
}

.tip {
  margin: 1.25rem 0 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgb(109, 120, 141);
}

.item {
  margin-top: 1.25rem;
}

.item + .item {
  margin-top: 1.9rem;
}

.label {
  margin: 0.375rem 0;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 1.125rem;
  color: #fff;
}

.input-area {
  display: flex;
  width: 100%;
  height: 2.875rem;
  padding: 0 0.75rem;
  align-items: center;
  border-radius: 0.375rem;
  background: #070b18;
  border: 1px solid transparent;
}

.input-area.invalid {
  border-color: rgb(230, 64, 33);
}

.text-input {
  flex: 1 1 auto;
  min-width: 0;
  height: 2.875rem;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 2.875rem;
  color: #fff;
  outline: none;
}

.text-input::placeholder {
  font-weight: 400;
  color: rgb(109, 120, 141);
  opacity: 0.6;
}

.clear {
  display: flex;
  width: 1.875rem;
  height: 1.875rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: rgb(153, 153, 153);
  background: transparent;
}

.clear.hide {
  visibility: hidden;
}

.clear-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.error {
  margin: 0.3125rem 0 0;
  font-size: 0.625rem;
  line-height: 0.9375rem;
  color: rgb(230, 64, 33);
}

.submit {
  display: block;
  width: 100%;
  height: 2.5rem;
  margin-top: 1.5rem;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: #fff;
  text-align: center;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
}

.submit:disabled {
  opacity: 0.5;
  color: rgba(255, 255, 255, 0.5);
}

.submit.loading {
  opacity: 1;
  color: #fff;
  pointer-events: none;
}
</style>
