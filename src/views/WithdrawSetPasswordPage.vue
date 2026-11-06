<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import PinPasswordInput from '../components/perfil/security/PinPasswordInput.vue'
import { setCashOutPwd } from '../api/withdraw'
import { showToast } from '../toast'

const router = useRouter()
const password = ref('')
const confirm = ref('')
const submitting = ref(false)

const title = 'Saque Senha'
const heading = 'Configurar Saque Senha'
const newLabel = 'Novo Saque Senha'
const confirmLabel = 'Confirmar Novo Senha'
const hint = 'Para o primeiro saque, você precisa definir a senha de saque primeiro'
const submitLabel = 'Retirar Agora'
const mismatch = 'As senhas inseridas duas vezes não correspondem'
const incomplete = 'Senha inválida'
const success = 'Configurar Sucesso'

function goBack() {
  if (window.history.length > 1) router.back()
  else void router.replace('/main/inicio')
}

async function submit() {
  if (submitting.value) return
  if (password.value.length !== 6 || confirm.value.length !== 6) {
    showToast(incomplete, 'error')
    return
  }
  if (password.value !== confirm.value) {
    showToast(mismatch, 'error')
    return
  }
  submitting.value = true
  try {
    await setCashOutPwd(password.value)
    showToast(success, 'success')
    await router.replace('/main/withdraw')
  } catch (error) {
    showToast(error instanceof Error ? error.message : String(error), 'error')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="ion-page">
    <header class="sec-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">{{ tr(title) }}</span></h1>
      </div>
    </header>

    <div class="page-scroller set-body">
      <h2 class="heading">{{ tr(heading) }}</h2>
      <p class="label">{{ tr(newLabel) }}</p>
      <PinPasswordInput autofocus @input="password = $event" />
      <p class="label">{{ tr(confirmLabel) }}</p>
      <PinPasswordInput @input="confirm = $event" />
      <p class="hint">{{ tr(hint) }}</p>
      <button type="button" class="submit" @click="submit">
        {{ tr(submitLabel) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.sec-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 0.25rem;
  align-items: center;
  overflow: hidden;
  background-color: #154084;
}

.back {
  display: flex;
  width: 2.375rem;
  height: 1.375rem;
  padding-left: 0.125rem;
  margin: 0 0.125rem;
  justify-content: flex-start;
  align-items: center;
}

.back-icon {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  color: var(--color-text-100);
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.875rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.set-body {
  padding: 1rem;
}

.heading {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #fff;
}

.label {
  margin: 16px 0 10px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  color: #6d788d;
}

.hint {
  margin: 16px 0 1.75rem;
  font-size: 0.625rem;
  font-weight: 500;
  line-height: 1.2;
  color: #6d788d;
}

.submit {
  display: block;
  box-sizing: border-box;
  width: calc(100% - 6rem);
  min-height: 2.5rem;
  margin: 0.2rem 3rem 0;
  border-radius: 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: #fff;
  text-align: center;
  text-transform: none;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  box-shadow:
    0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>
