<script setup lang="ts">
/**
 * /main/entrar — signed-in Depósito (not the login form).
 *
 * TabBar Depósito lands here. Record icon on the live site pushes
 * /rechargeRecord (not cloned this round). Depositar Agora opens the PIX
 * overlay on the same route. All PIX / order values are mock.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import CopyToast from '../components/entrar/CopyToast.vue'
import DepositForm from '../components/entrar/DepositForm.vue'
import PixOrder from '../components/entrar/PixOrder.vue'
import TabBar from '../components/inicio/TabBar.vue'
import SvgIcon from '../components/base/SvgIcon.vue'
import { entrarCopy } from '../api/entrar'
import { useEntrarStore } from '../stores/entrar'
import { useHomeStore } from '../stores/home'

const router = useRouter()
const home = useHomeStore()
const entrar = useEntrarStore()
const toast = ref('')
let toastTimer = 0

function onTabSelect(key: string) {
  if (key === 'inicio') {
    void router.push('/main/inicio')
    return
  }
  if (key === 'promo') {
    void router.push('/main/promo')
    return
  }
  if (key === 'perfil') {
    void router.push('/main/perfil')
    return
  }
  home.selectTab(key)
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value)
  } catch {
    /* clipboard can be blocked in some preview contexts; the toast still fires */
  }
  window.clearTimeout(toastTimer)
  toast.value = entrarCopy.toast
  toastTimer = window.setTimeout(() => {
    toast.value = ''
  }, 2000)
}

onMounted(() => {
  void home.load()
  void entrar.load()
})

onBeforeUnmount(() => window.clearTimeout(toastTimer))
</script>

<template>
  <div class="ion-page">
    <header class="entrar-header" :class="{ qr: !!entrar.order }">
      <div class="toolbar">
        <button v-if="entrar.order" type="button" class="finish" @click="entrar.finish()">
          {{ entrarCopy.finish }}
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ entrarCopy.title }}</span>
        </h1>
        <button type="button" class="record" aria-label="Registro de Depósito">
          <SvgIcon class="record-icon" name="entrar-record" />
        </button>
      </div>
    </header>

    <div class="page-scroller entrar-content">
      <PixOrder v-if="entrar.order" :order="entrar.order" @copy="copyText" />
      <DepositForm
        v-else
        :tab-label="entrarCopy.tabOnline"
        :reco="entrarCopy.reco"
        :channel-label="entrar.channel.label"
        :channel-reco="entrar.channel.reco"
        :promo="entrarCopy.promo"
        :currency="entrarCopy.currency"
        :placeholder="entrarCopy.placeholder"
        :amount-reais="entrar.amountReais"
        :amounts="entrar.amounts"
        :selected-cents="entrar.selectedCents"
        :can-submit="entrar.canSubmit"
        :submit-label="entrarCopy.submit"
        @update:amount-reais="entrar.setAmount"
        @select-amount="entrar.selectAmount"
        @clear="entrar.clearAmount()"
        @submit="entrar.submit()"
      />
    </div>

    <TabBar :items="home.tabBarItems" active="deposito" @select="onTabSelect" />
    <CopyToast v-if="toast" :message="toast" />
  </div>
</template>

<style scoped>
/* ion-header.md ion-no-border, z-index 10. Form toolbar is 50px; the PIX
   overlay's Finalizar button is 52.7 + 4px ionic margin so the host is 60.7. */
.entrar-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
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

.qr .toolbar {
  height: 3.79375rem;
  min-height: 3.79375rem;
  overflow: visible;
}

.finish {
  position: relative;
  z-index: 2;
  margin: 4px 2px;
  padding: 13px 17px;
  font-size: 17px;
  font-weight: 400;
  line-height: 25.5px;
  color: rgb(255, 255, 255);
  white-space: nowrap;
  background: transparent;
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
  justify-content: center;
  margin: 0;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.75rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  min-width: 0;
  overflow: hidden;
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.record {
  display: flex;
  position: relative;
  z-index: 2;
  width: 38px;
  height: 32px;
  margin: 0 2px 0 auto;
  padding: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.record-icon {
  width: 28px;
  height: 20px;
  color: var(--color-text-100);
}

/* ion-content.recharge-content: --background #090f1f, padding 0 15px 72px. */
.entrar-content {
  padding: 0 0.9375rem 4.5rem;
  background-color: var(--color-bar-bg);
}
</style>
