<script setup lang="ts">
/**
 * `/withdrawalBindAccount` — Adicionar Conta PIX form.
 *
 * Geometry from https://gc987.com/withdrawalBindAccount at 390x844x3.
 * Submit is mock: stores the PIX locally and returns to Minha conta.
 */
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../components/base/SvgIcon.vue'
import { withdrawalAccountCopy as copy } from '../api/withdrawalAccount'
import { useWithdrawalAccountStore } from '../stores/withdrawalAccount'

const router = useRouter()
const accounts = useWithdrawalAccountStore()
const name = ref('')
const pix = ref('')

const canSubmit = computed(() => name.value.trim().length > 0 && pix.value.length > 0)

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/withdrawalAccount')
}

function onName(event: Event) {
  const el = event.target as HTMLInputElement
  name.value = el.value.slice(0, 128)
}

function onPix(event: Event) {
  const el = event.target as HTMLInputElement
  pix.value = el.value.replace(/\D/g, '').slice(0, 11)
}

async function submit() {
  if (!canSubmit.value) return
  await accounts.add(name.value.trim(), pix.value)
  if (router.options.history.state.back) router.back()
  else void router.replace('/withdrawalAccount')
}

onMounted(() => {
  void accounts.load()
})
</script>

<template>
  <div class="ion-page">
    <header class="bind-header">
      <div class="toolbar">
        <button type="button" class="back" aria-label="Voltar" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ copy.bindTitle }}</span>
        </h1>
      </div>
    </header>

    <div class="page-scroller bind-body">
      <div class="tab-list">
        <div class="tab on">{{ copy.tab }}</div>
      </div>

      <div class="tip tip-1">
        <p>{{ copy.tip1Num }}</p>
        {{ copy.tip1 }}
      </div>
      <div class="tip tip-2">
        <p>{{ copy.tip2Num }}</p>
        {{ copy.tip2 }}
      </div>

      <label class="field">
        <span class="label">{{ copy.nameLabel }}</span>
        <div class="input-area">
          <input
            class="text-input"
            type="text"
            maxlength="128"
            autocomplete="off"
            spellcheck="false"
            :placeholder="copy.namePlaceholder"
            :value="name"
            @input="onName"
          />
        </div>
      </label>

      <label class="field pix-field">
        <span class="label">{{ copy.pixLabel }}</span>
        <div class="input-area phone">
          <span class="prefix">{{ copy.pixPrefix }}</span>
          <input
            class="text-input"
            type="tel"
            maxlength="11"
            autocomplete="off"
            :placeholder="copy.pixPlaceholder"
            :value="pix"
            @input="onPix"
          />
        </div>
      </label>
    </div>

    <div class="bind-footer">
      <button type="button" class="submit" :class="{ on: canSubmit }" :disabled="!canSubmit" @click="submit">
        {{ copy.submit }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.bind-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 28.4px 0;
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
  width: 2.625rem;
  height: 3.125rem;
  align-items: center;
  justify-content: flex-start;
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
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
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

.bind-body {
  padding: 0 1.125rem 5.5rem;
  background-color: var(--color-bar-bg);
}

.tab-list {
  height: 44px;
  margin: 24px 0 35px;
}

.tab {
  display: flex;
  width: calc(100% - 10px);
  height: 40px;
  margin: 2px 10px 2px 0;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  background-color: var(--color-bg-400);
  border-radius: 4px;
}

.tip {
  display: flex;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
}

.tip p {
  margin: 0;
  flex: 0 0 auto;
}

.tip-1 {
  color: rgb(230, 64, 33);
}

.tip-2 {
  margin: 13px 0 21px;
  color: rgba(255, 255, 255, 0.4);
}

.field {
  display: block;
}

.label {
  display: block;
  margin: 6px 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
}

.input-area {
  display: flex;
  height: 45.95px;
  padding-left: 12px;
  align-items: center;
  background-color: rgb(26, 29, 34);
  border-radius: 4px;
}

.phone .prefix {
  margin-right: 6px;
  padding-right: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  border-right: 2px solid rgba(255, 255, 255, 0.4);
}

.text-input {
  flex: 1 1 0%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  outline: none;
}

.text-input::placeholder {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
}

.pix-field {
  margin-top: 30.4px;
}

.bind-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 20;
  width: 100%;
  max-width: var(--app-max-width);
  height: 70px;
  padding: 0 12px;
  transform: translateX(-50%);
}

.submit {
  display: flex;
  width: 100%;
  height: 46px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.4);
  background-image: linear-gradient(0deg, rgb(11, 56, 104) -13.77%, rgb(27, 76, 118) 102.34%);
  border-radius: 4px;
}

.submit.on {
  color: #fff;
}
</style>
