<script setup lang="ts">
/**
 * /security/verify/password, /asset, and /email — first Validação page.
 *
 * Shared chrome (md elevation-4 header, ion-padding 16px). Login-password
 * and email show the two intro lines (email and phone use the vincular
 * tip); asset leaves that slot empty. Phone and email Confirmar skip
 * /verifyPassword for now and open the bind page. Password Confirmar pushes
 * /security/confirm/password. Asset Confirmar pushes
 * /security/confirm/asset. See
 * docs/research/gc987-com/security/SECURITY_VERIFY.spec.md.
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import VerifyLoginForm from '../../components/perfil/security/VerifyLoginForm.vue'
import { securityVerifyCopy, type SecurityVerifyVariant } from '../../api/security'
import { useSecurityStore } from '../../stores/security'

const route = useRoute()
const router = useRouter()
const security = useSecurityStore()

const variant = computed<SecurityVerifyVariant>(() => {
  if (route.path.endsWith('/asset')) return 'asset'
  if (route.path.endsWith('/email')) return 'email'
  if (route.path.endsWith('/phone')) return 'phone'
  return 'password'
})

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/security')
}

function onConfirm() {
  if (variant.value === 'password') {
    void router.push('/security/confirm/password')
    return
  }
  if (variant.value === 'asset') {
    void router.push('/security/confirm/asset')
    return
  }
  // /verifyPassword is failing, so phone and email go straight to the bind page.
  security.allowBind(variant.value)
  void router.push(`/security/bind/${variant.value}`)
}
</script>

<template>
  <div class="ion-page">
    <header class="sec-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">{{ tr(securityVerifyCopy.title) }}</span></h1>
      </div>
    </header>

    <div class="page-scroller verify-body">
      <VerifyLoginForm :variant="variant" @confirm="onConfirm" />
    </div>
  </div>
</template>

<style scoped>
/* ion-header.md elevation-4, z-index 10, 50 tall (toolbar only). */
.sec-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  box-shadow:
    0 2px 4px -1px rgba(0, 0, 0, 0.2),
    0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
}

/* ion-toolbar (ios): --background #154084, --min-height 3.125rem,
   --padding-start/end 4px. */
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

/* ion-content.ion-padding: --background #090f1f, --padding 16px. */
.verify-body {
  padding: 1rem;
}
</style>
