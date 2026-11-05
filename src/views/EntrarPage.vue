<script setup lang="ts">
/**
 * /main/entrar — signed-in Depósito (not the login form).
 *
 * TabBar Depósito lands here. Record icon opens the deposit history sheet.
 * Depositar Agora opens the PIX overlay on the same route. All PIX / order
 * values are mock.
 */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CopyToast from '../components/entrar/CopyToast.vue'
import DepositForm from '../components/entrar/DepositForm.vue'
import DepositRecordModal from '../components/entrar/DepositRecordModal.vue'
import PixOrder from '../components/entrar/PixOrder.vue'
import RealNameModal from '../components/entrar/RealNameModal.vue'
import TabBar from '../components/inicio/TabBar.vue'
import SvgIcon from '../components/base/SvgIcon.vue'
import { entrarCopy } from '../api/entrar'
import { selectMainTab } from '../auth/tabGuard'
import { useEntrarStore } from '../stores/entrar'
import { useHomeStore } from '../stores/home'

const router = useRouter()
const home = useHomeStore()
const entrar = useEntrarStore()
const toast = ref('')
const frameReady = ref(false)
const recordOpen = ref(false)
let toastTimer = 0

watch(
  () => entrar.payUrl,
  () => {
    frameReady.value = false
  },
)

function openRecords() {
  // Original record route clears the cashier. Opening records from the
  // payment page closes that page, so back lands on the deposit form.
  entrar.clearPay()
  recordOpen.value = true
}

function onTabSelect(key: string) {
  selectMainTab(router, key)
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
    <header class="entrar-header" :class="{ qr: !!entrar.payUrl }">
      <div class="toolbar">
        <button v-if="entrar.payUrl" type="button" class="finish" @click="entrar.clearPay()">
          {{ tr(entrarCopy.finish) }}
        </button>
        <h1 class="toolbar-title">
          <span class="title-text">{{ tr(entrarCopy.title) }}</span>
        </h1>
        <button type="button" class="record" :aria-label="tr('Registro de Depósito')" @click.stop="openRecords">
          <SvgIcon class="record-icon" name="entrar-record" />
        </button>
      </div>
    </header>

    <div class="page-scroller entrar-content" :class="{ frame: !!entrar.payUrl }">
      <div v-if="entrar.payUrl" class="pay-frame">
        <iframe
          :key="entrar.payUrl"
          class="pay-iframe"
          :src="entrar.payUrl"
          title="Pagamento"
          @load="frameReady = true"
        />
        <div v-if="!frameReady" class="pay-wait">
          <svg class="crescent" viewBox="0 0 64 64" aria-hidden="true">
            <circle r="26" transform="translate(32,32)" />
          </svg>
        </div>
      </div>
      <PixOrder v-else-if="entrar.order" :order="entrar.order" @copy="copyText" />
      <DepositForm
        v-else
        :tab-label="entrarCopy.tabOnline"
        :reco="entrarCopy.reco"
        :channel-label="entrar.channel.label"
        :channel-icon="entrar.channel.icon || ''"
        :channel-reco="entrar.channel.reco"
        :promo="entrarCopy.promo"
        :currency="entrarCopy.currency"
        :placeholder="tr(entrar.placeholder)"
        :amount-reais="entrar.amountReais"
        :amounts="entrar.amounts"
        :selected-cents="entrar.selectedCents"
        :can-submit="entrar.canSubmit"
        :submitting="entrar.submitting"
        :submit-label="entrarCopy.submit"
        @update:amount-reais="entrar.setAmount"
        @select-amount="entrar.selectAmount"
        @clear="entrar.clearAmount()"
        @submit="entrar.submit()"
      />
    </div>

    <TabBar :items="home.tabBarItems" active="deposito" @select="onTabSelect" />
    <CopyToast v-if="toast" :message="toast" />
    <RealNameModal
      v-if="entrar.realNameOpen"
      :submitting="entrar.submitting"
      @close="entrar.closeRealName()"
      @confirm="entrar.confirmIdentity"
    />
    <DepositRecordModal v-if="recordOpen" @close="recordOpen = false" />
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
  padding: 0 4px;
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
  padding: 0 90px;
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
  height: 32px;
  min-height: 32px;
  margin: 0 2px 0 auto;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.record-icon {
  width: 1.75rem;
  height: 1.25rem;
  color: var(--color-text-100);
}

/* ion-content.recharge-content: padding 0 .9375rem calc(tab + 1rem). */
.entrar-content {
  padding: 0 0.9375rem calc(56px + 1rem);
  background-color: var(--color-bar-bg);
}

/* Payment stays on this page. The frame is taller than the visible slot so
   the deposit scroller, not a nested locked box, moves the rest into view.
   Bottom padding keeps the end above the tab bar. */
.entrar-content.frame {
  padding: 0 0 calc(3.5rem + 1rem + var(--sab));
  background-color: #fff;
}

.pay-frame {
  position: relative;
  background: #fff;
}

.pay-iframe {
  display: block;
  width: 100%;
  height: calc(100dvh * 2.5);
  border: 0;
  background: #fff;
}

.pay-wait {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  height: calc(100dvh - 3.79375rem - 3.5rem - 1rem);
  align-items: center;
  justify-content: center;
  background: #fff;
}

.crescent {
  width: 5rem;
  height: 5rem;
  color: #116fcd;
  animation: spinner-rotate 0.75s linear infinite;
}

.crescent circle {
  fill: transparent;
  stroke: currentColor;
  stroke-width: 4px;
  stroke-dasharray: 128px;
  stroke-dashoffset: 82px;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 486px) {
  .entrar-content {
    padding-bottom: calc(70px + 1rem);
  }
}
</style>
