<script setup lang="ts">
/**
 * Same-route PIX overlay after Depositar Agora. Live stays on /main/entrar
 * (`ion-content.recharge-qr-code`). QR / PIX copy / order no are mock.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import MockQr from './MockQr.vue'
import { entrarCopy, formatAmount, formatCountdown, type PixOrder } from '../../api/entrar'

const props = defineProps<{ order: PixOrder }>()
const emit = defineEmits<{ copy: [value: string] }>()

const now = ref(Date.now())
let timer = 0

const left = computed(() => formatCountdown(props.order.expiresAt - now.value))
const amountLabel = computed(() => formatAmount(props.order.amountCents))

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <div class="qr-page">
    <ul class="tips">
      <li v-for="(tip, i) in entrarCopy.tips" :key="i">
        <span class="dotted" />
        {{ tip }}
      </li>
    </ul>

    <div class="qr-area">
      <div class="amount">
        <span class="symbol">{{ entrarCopy.currency }}</span>
        <span class="amount-num">{{ amountLabel }}</span>
        <button type="button" class="icon-btn" @click="emit('copy', amountLabel)">
          <SvgIcon class="copy-icon" name="entrar-copy" />
        </button>
      </div>

      <div class="qr-code">
        <MockQr :payload="props.order.pixCopy" />
      </div>

      <button type="button" class="qr-btn" @click="emit('copy', props.order.pixCopy)">
        {{ entrarCopy.copyQr }}
      </button>

      <div class="qr-code-info">
        <span>{{ entrarCopy.qrAddress }}</span>
        <span class="code">{{ props.order.pixMask }}</span>
        <button type="button" class="icon-btn" @click="emit('copy', props.order.pixCopy)">
          <SvgIcon class="copy-icon" name="entrar-copy" />
        </button>
      </div>

      <div class="count-down">
        <SvgIcon class="time-icon" name="entrar-time" />
        <span class="count-down-text">{{ entrarCopy.ttl }}</span>
        <div class="count-down-time">
          <span class="hour">{{ left.h }}</span>
          <span class="minute">{{ left.m }}</span>
          <span class="second">{{ left.s }}</span>
        </div>
      </div>
    </div>

    <ul class="order-detail">
      <li>
        <span class="left">{{ entrarCopy.status }}</span>
        <span class="right pending">{{ props.order.status }}</span>
      </li>
      <li>
        <span class="left">{{ entrarCopy.created }}</span>
        <span class="right">{{ props.order.createdLabel }}</span>
      </li>
      <li>
        <span class="left">{{ entrarCopy.orderNo }}</span>
        <span class="right">
          {{ props.order.orderNo }}
          <button type="button" class="icon-btn" @click="emit('copy', props.order.orderNo)">
            <SvgIcon class="copy-icon" name="entrar-copy" />
          </button>
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.qr-page {
  width: 21.25rem;
  margin: 0 auto;
}

.tips {
  margin: 1.3125rem 0 0;
  padding: 0;
  list-style: none;
}

.tips li {
  margin: 0 0 1.125rem;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgba(255, 255, 255, 0.4);
}

.tips li:last-child {
  color: rgb(22, 128, 220);
}

.dotted {
  display: inline-block;
  width: 0.375rem;
  height: 0.375rem;
  margin: 0.25rem 0.1875rem 0 0;
  border-radius: 0.125rem;
  background-color: rgba(255, 255, 255, 0.4);
  vertical-align: top;
}

.tips li:last-child .dotted {
  background-color: rgb(22, 128, 220);
}

.qr-area {
  width: 13.625rem;
  margin: 1.25rem auto;
  overflow: visible;
  font-size: 0.75rem;
  text-align: center;
}

.amount {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.75rem;
  color: #fba531;
}

.amount-num {
  margin: 0 0.1875rem;
}

.icon-btn {
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.copy-icon {
  width: 1rem;
  height: 1rem;
  color: #df8644;
  cursor: pointer;
}

.qr-code {
  width: 9.375rem;
  height: 9.375rem;
  margin: 0.5rem auto;
}

.qr-btn {
  display: block;
  width: 166px;
  height: 50px;
  margin: 0 auto;
  border-radius: 4px;
  background-color: #116fcd;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 50px;
  color: rgb(255, 255, 255);
  text-align: center;
  cursor: pointer;
}

.qr-code-info {
  display: flex;
  width: 18.75rem;
  margin: 1.25rem 0;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgba(255, 255, 255, 0.4);
}

.code {
  margin: 0 0.1875rem;
}

.count-down {
  display: flex;
  margin-top: 0.375rem;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgba(255, 255, 255, 0.4);
}

.time-icon {
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.count-down-text,
.minute {
  margin: 0 0.1875rem;
}

.count-down-time {
  color: rgba(255, 255, 255, 0.8);
}

.order-detail {
  margin: 0;
  padding: 0;
  list-style: none;
}

.order-detail li {
  display: flex;
  margin-bottom: 0.625rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
}

.left {
  color: rgba(255, 255, 255, 0.4);
}

.right {
  display: flex;
  align-items: center;
  color: rgb(255, 255, 255);
}

.pending {
  color: #fba531;
}

.right .icon-btn {
  margin-left: 0.25rem;
}
</style>
