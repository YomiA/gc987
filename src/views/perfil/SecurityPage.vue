<script setup lang="ts">
/**
 * /security — Perfil -> Centro de Segurança.
 *
 * Two stacked cards over a 10px-padded scroller. No bottom tab bar. Geometry
 * is the live page at 390x844x3; see
 * docs/research/gc987-com/security/SECURITY_PAGE.spec.md.
 *
 * Password rows push the first Validação page (`/security/verify/password`
 * and `/security/verify/asset`). Email is still unwired.
 */
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SvgIcon from '../../components/base/SvgIcon.vue'
import SecurityList from '../../components/perfil/security/SecurityList.vue'
import { securityCopy, securityGroups } from '../../api/security'
import { usePerfilStore } from '../../stores/perfil'

const router = useRouter()
const perfil = usePerfilStore()

const groups = computed(() => securityGroups(perfil.profile?.account ?? '55900000000'))

function goBack() {
  if (router.options.history.state.back) router.back()
  else void router.push('/main/perfil')
}

onMounted(() => void perfil.load())
</script>

<template>
  <div class="ion-page">
    <header class="sec-header">
      <div class="toolbar">
        <button type="button" class="back" @click="goBack">
          <SvgIcon class="back-icon" name="report-back" />
        </button>
        <h1 class="toolbar-title"><span class="title-text">{{ securityCopy.title }}</span></h1>
      </div>
    </header>

    <div class="page-scroller sec-body">
      <SecurityList :groups="groups" />
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

/* ion-content: --background #090f1f, --padding .625rem on all four sides. */
.sec-body {
  padding: 0.625rem;
}
</style>
