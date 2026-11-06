<script setup lang="ts">
/**
 * /security/bind/:type — phone or email after /verifyPassword succeeded.
 * Sending a code starts a 60s countdown. Confirm posts /bindPhone or
 * /bindEmail. See docs/research/gc987-com/security/SECURITY_BIND.spec.md.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import BindEmailForm from '../../components/perfil/security/BindEmailForm.vue'
import CopyToast from '../../components/entrar/CopyToast.vue'
import {
  bindEmail,
  bindPhone,
  securityBindCopy,
  sendEmailCode,
  sendPhoneCode,
} from '../../api/security'
import { useSecurityStore } from '../../stores/security'
import { showToast as showAppToast } from '../../toast'

const route = useRoute()
const router = useRouter()
const security = useSecurityStore()

const toast = ref('')
const cooldown = ref(0)
const sending = ref(false)
const sent = ref(false)
let toastTimer = 0
let leaveTimer = 0
let cooldownTimer = 0

const kind = computed<'phone' | 'email'>(() => (route.params.type === 'phone' ? 'phone' : 'email'))
const title = computed(() => (kind.value === 'phone' ? securityBindCopy.phoneTitle : securityBindCopy.title))

function guard() {
  if (route.params.type !== 'phone' && route.params.type !== 'email') {
    void router.replace('/security')
    return
  }
  if (security.bindTarget !== kind.value) void router.replace(`/security/verify/${kind.value}`)
}

function resetCode() {
  cooldown.value = 0
  sent.value = false
  sending.value = false
  window.clearInterval(cooldownTimer)
}

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/security')
}

function showToast(message: string) {
  window.clearTimeout(toastTimer)
  toast.value = message
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 2000)
}

function startCooldown() {
  sent.value = true
  cooldown.value = 60
  window.clearInterval(cooldownTimer)
  cooldownTimer = window.setInterval(() => {
    cooldown.value -= 1
    if (cooldown.value <= 0) window.clearInterval(cooldownTimer)
  }, 1000)
}

function onTooLong() {
  showToast(securityBindCopy.tooLong)
}

async function onSend(account: string) {
  if (sending.value || cooldown.value > 0) return
  sending.value = true
  try {
    if (kind.value === 'phone') await sendPhoneCode(account)
    else await sendEmailCode(account)
    startCooldown()
  } catch (error) {
    showAppToast(error instanceof Error ? error.message : String(error), 'error')
  } finally {
    sending.value = false
  }
}

async function onConfirm(account: string, verifyCode: string) {
  try {
    if (kind.value === 'phone') {
      await bindPhone(account, verifyCode)
      security.bindPhone(account)
    } else {
      await bindEmail(account, verifyCode)
      security.bindEmail(account)
    }
    showToast(securityBindCopy.success)
    window.clearTimeout(leaveTimer)
    leaveTimer = window.setTimeout(() => {
      void router.replace('/security')
    }, 1000)
  } catch (error) {
    showAppToast(error instanceof Error ? error.message : String(error), 'error')
  }
}

onMounted(guard)
watch(kind, () => {
  resetCode()
  guard()
})

onBeforeUnmount(() => {
  window.clearTimeout(toastTimer)
  window.clearTimeout(leaveTimer)
  window.clearInterval(cooldownTimer)
})
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

    <div class="page-scroller verify-body">
      <BindEmailForm
        :key="kind"
        :kind="kind"
        :cooldown="cooldown"
        :sending="sending"
        :sent="sent"
        @confirm="onConfirm"
        @send="onSend"
        @too-long="onTooLong"
      />
    </div>

    <CopyToast v-if="toast" :message="toast" />
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

.verify-body {
  padding: 1rem;
}
</style>
