<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppToast from './components/base/AppToast.vue'
import PageLoading from './components/base/PageLoading.vue'
import LoginModal from './components/inicio/LoginModal.vue'
import CashOutPasswordDialog from './components/withdraw/CashOutPasswordDialog.vue'
import SideFab from './components/inicio/SideFab.vue'
import { releasePageLoading } from './pageLoading'
import { refreshCurrentPage } from './pageRefresh'
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const user = useUserStore()

function onSetCashOutPassword() {
  user.closeFundTips()
  void router.push('/withdrawPW')
}

function onPushNavigate(event: Event) {
  const url = (event as CustomEvent<{ url?: string }>).detail?.url
  if (!url) return
  if (/^https?:\/\//.test(url)) {
    window.location.assign(url)
    return
  }
  void router.push(url)
}

function onVisible() {
  if (document.visibilityState !== 'visible') return
  void refreshCurrentPage(route.name)
}

onMounted(() => {
  releasePageLoading()
  window.addEventListener('push:navigate', onPushNavigate)
  document.addEventListener('visibilitychange', onVisible)
})
onBeforeUnmount(() => {
  window.removeEventListener('push:navigate', onPushNavigate)
  document.removeEventListener('visibilitychange', onVisible)
})
/** Live hides `.xuanfu` only on `/^\/game/`; every other route shows it. */
const showFab = computed(() => !/^\/game/.test(route.path))
</script>

<template>
  <!-- The provider logos are filled with `url(#svg-theme-color*)`. On the live
       page those gradients live in a zero-size SVG that every icon shares, so
       the same holder is mounted once here. -->
  <svg class="theme-gradients" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient
        id="svg-theme-color1"
        x1="20.4635"
        y1="-5.00817"
        x2="0.787575"
        y2="10.5236"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#6AE394" />
        <stop offset="1" stop-color="#90D23F" />
      </linearGradient>
      <linearGradient
        id="svg-theme-color2"
        x1="11.5677"
        y1="1.54517"
        x2="18.4448"
        y2="21.4853"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#6AE394" />
        <stop offset="1" stop-color="#3F74D2" />
      </linearGradient>
      <linearGradient
        id="svg-theme-color3"
        x1="25.6924"
        y1="24.1829"
        x2="3.14761"
        y2="1.3271"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#7041F3" />
        <stop offset="1" stop-color="#F5C84C" />
      </linearGradient>
      <linearGradient
        id="svg-theme-color4"
        x1="6.39036"
        y1="3.67933"
        x2="13.9247"
        y2="19.6325"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F7FB43" />
        <stop offset="1" stop-color="#FF932E" />
      </linearGradient>
      <linearGradient
        id="svg-theme-color5"
        x1="9.06836"
        y1="0"
        x2="9.06836"
        y2="18"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#E64021" />
        <stop offset="1" stop-color="#E64021" />
      </linearGradient>
      <!-- The provider filter's Popular flame uses its own gold-to-rust ramp
           rather than the shared theme colours. -->
      <linearGradient
        id="ONE_API_HOT_1"
        x1="11.5677"
        y1="1.54517"
        x2="18.4448"
        y2="21.4853"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#e0cb7f" />
        <stop offset="1" stop-color="#ae4137" />
      </linearGradient>
      <linearGradient
        id="svg-theme-color28"
        x1="9.78906"
        y1="24.2652"
        x2="19.826"
        y2="3.07508"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#FFBFC6" />
        <stop offset="1" stop-color="#FF2F38" />
      </linearGradient>
    </defs>
  </svg>

  <RouterView />
  <SideFab v-if="showFab" />
  <PageLoading />
  <CashOutPasswordDialog v-if="user.fundTipsOpen" @confirm="onSetCashOutPassword" />
  <div v-if="auth.dialogOpen" class="auth-host">
    <LoginModal
      :mode="auth.dialogMode"
      @update:mode="auth.setDialogMode"
      @close="auth.closeDialog()"
    />
  </div>
  <AppToast />
</template>

<style scoped>
.theme-gradients {
  position: absolute;
  width: 0;
  height: 0;
}

.auth-host {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 50%;
  z-index: 20020;
  width: 100%;
  max-width: var(--app-max-width);
  transform: translateX(-50%);
}
</style>
