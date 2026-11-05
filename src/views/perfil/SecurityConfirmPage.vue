<script setup lang="ts">
/**
 * /security/confirm/:type — login-password bars or asset PIN grids after
 * a mock Validação. Submit is mock: mismatch toast, or success toast then
 * replace /security. See docs/research/gc987-com/security/SECURITY_CONFIRM.spec.md.
 */
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import ConfirmPasswordForm from '../../components/perfil/security/ConfirmPasswordForm.vue'
import ConfirmAssetForm from '../../components/perfil/security/ConfirmAssetForm.vue'
import CopyToast from '../../components/entrar/CopyToast.vue'
import { securityConfirmAssetCopy, securityConfirmCopy } from '../../api/security'
import { useSecurityStore } from '../../stores/security'
import { useWithdrawStore } from '../../stores/withdraw'

const route = useRoute()
const router = useRouter()
const security = useSecurityStore()
const withdraw = useWithdrawStore()

const toast = ref('')
let toastTimer = 0
let leaveTimer = 0

const type = computed(() => String(route.params.type || ''))
const isPassword = computed(() => type.value === 'password')
const isAsset = computed(() => type.value === 'asset')
const title = computed(() =>
  isAsset.value ? securityConfirmAssetCopy.title : securityConfirmCopy.title,
)

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

function onMismatch() {
  showToast(
    isAsset.value ? securityConfirmAssetCopy.mismatch : securityConfirmCopy.mismatch,
  )
}

function leaveToSecurity() {
  window.clearTimeout(leaveTimer)
  leaveTimer = window.setTimeout(() => {
    void router.replace('/security')
  }, 1000)
}

function onPasswordConfirm() {
  showToast(securityConfirmCopy.success)
  leaveToSecurity()
}

function onAssetConfirm() {
  security.setAssetPassword()
  withdraw.markAssetPasswordSet()
  showToast(securityConfirmAssetCopy.success)
  leaveToSecurity()
}

onBeforeUnmount(() => {
  window.clearTimeout(toastTimer)
  window.clearTimeout(leaveTimer)
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
      <ConfirmPasswordForm v-if="isPassword" @confirm="onPasswordConfirm" @mismatch="onMismatch" />
      <ConfirmAssetForm v-else-if="isAsset" @confirm="onAssetConfirm" @mismatch="onMismatch" />
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
