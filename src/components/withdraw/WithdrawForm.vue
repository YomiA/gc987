<script setup lang="ts">
/**
 * Signed-in Saque form. Geometry from https://gc987.com/main/withdraw at 390.
 */
import { ref } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'
import { formatAmount, withdrawCopy as copy } from '../../api/withdraw'
import { useWithdrawStore } from '../../stores/withdraw'

const withdraw = useWithdrawStore()
const hiddenIcons = ref<string[]>([])

function hideIcon(src: string) {
  if (!src || hiddenIcons.value.includes(src)) return
  hiddenIcons.value = [...hiddenIcons.value, src]
}
function onAmountInput(event: Event) {
  const el = event.target as HTMLInputElement
  withdraw.setAmount(el.value)
  if (el.value !== withdraw.amountReais) el.value = withdraw.amountReais
}

function onNameInput(event: Event) {
  const el = event.target as HTMLInputElement
  withdraw.setName(el.value)
}

function onCpfInput(event: Event) {
  const el = event.target as HTMLInputElement
  withdraw.setCpf(el.value)
}

function onSubmit() {
  withdraw.requestCashOut()
}
</script>

<template>
  <div class="form">
    <div class="balance-area">
      <p class="balance-wrap">
        <span class="account">{{ copy.account }}</span>
        <span class="balance-w"
          >{{ copy.currency }}<span class="amount">{{ formatAmount(withdraw.balanceCents) }}</span></span
        >
      </p>
    </div>

    <div class="channel-wrap main-tab">
      <ul class="channel-list">
        <li
          v-for="(item, index) in withdraw.channels"
          :key="index"
          :class="{ active: withdraw.selectedChannel === index }"
          @click="withdraw.selectChannel(index)"
        >
          <img
            v-if="item.icon && !hiddenIcons.includes(item.icon)"
            class="channel-icon"
            :src="item.icon"
            alt=""
            @error="hideIcon(item.icon)"
          />
          <span v-if="item.label">{{ item.label }}</span>
        </li>
        <li v-if="withdraw.channels.length === 0" class="active">{{ copy.channel }}</li>
      </ul>
    </div>

    <div class="line" />

    <h6 class="amount-title">{{ copy.amountTitle }}</h6>

    <ul class="amount-list">
      <li
        v-for="cents in withdraw.amounts"
        :key="cents"
        class="amount-item"
        :class="{
          disabled: withdraw.chipDisabled(cents),
          on: withdraw.selectedCents === cents,
        }"
        @click="withdraw.selectAmount(cents)"
      >
        <span class="chip-amount">{{ formatAmount(cents) }}</span>
      </li>
      <li class="chip-spacer" aria-hidden="true" />
      <li class="chip-spacer" aria-hidden="true" />
    </ul>

    <h6 v-if="withdraw.overBalance" class="tips">
      <SvgIcon class="help" name="withdraw-help" />
      <span>{{ copy.feePrefix }} {{ formatAmount(withdraw.balanceCents) }} {{ copy.feeSuffix }}</span>
    </h6>

    <div class="item-row">
      <span class="left-slot" aria-hidden="true" />
      <input
        class="amount-input"
        type="number"
        inputmode="decimal"
        :placeholder="withdraw.placeholder"
        :value="withdraw.amountReais"
        @input="onAmountInput"
      />
      <button
        type="button"
        class="clear-btn"
        :class="{ hide: withdraw.amountReais === '' }"
        aria-label="reset"
        @click="withdraw.clearAmount()"
      >
        <SvgIcon class="clear-icon" name="register-clear" />
      </button>
      <p v-if="withdraw.amountError" class="amount-error">{{ copy.amountError }}</p>
    </div>

    <div class="line" />

    <div class="channel-wrap sub-tab">
      <p class="method-title">{{ copy.methodTitle }}</p>
      <ul class="channel-list">
        <li class="active">{{ copy.method }}</li>
      </ul>
    </div>

    <div class="form-wrap">
      <div class="item">
        <p class="label">{{ copy.nameLabel }}</p>
        <div class="field" :class="{ invalid: withdraw.nameError }">
          <input
            class="text-input"
            type="text"
            maxlength="128"
            autocomplete="off"
            spellcheck="false"
            autocapitalize="off"
            autocorrect="off"
            :placeholder="copy.namePlaceholder"
            :value="withdraw.name"
            @input="onNameInput"
          />
          <button
            type="button"
            class="field-clear"
            :class="{ hide: withdraw.name === '' }"
            aria-label="reset"
            @click="withdraw.clearName()"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
          <span class="highlight" />
          <div class="input-bottom" />
        </div>
        <p v-if="withdraw.nameError" class="field-error">{{ copy.nameError }}</p>
      </div>

      <div class="item">
        <p class="label">{{ copy.cpfLabel }}</p>
        <div class="field" :class="{ invalid: withdraw.cpfError }">
          <input
            class="text-input"
            type="tel"
            maxlength="11"
            autocomplete="off"
            spellcheck="false"
            :placeholder="copy.cpfPlaceholder"
            :value="withdraw.cpf"
            @input="onCpfInput"
          />
          <button
            type="button"
            class="field-clear"
            :class="{ hide: withdraw.cpf === '' }"
            aria-label="reset"
            @click="withdraw.clearCpf()"
          >
            <SvgIcon class="clear-icon" name="register-clear" />
          </button>
          <span class="highlight" />
          <div class="input-bottom" />
        </div>
        <p v-if="withdraw.cpfError" class="field-error">{{ copy.cpfError }}</p>
      </div>
    </div>

    <button type="button" class="submit" @click="onSubmit">
      {{ copy.submit }}
    </button>
  </div>
</template>

<style scoped>
.balance-area {
  margin: 0.5rem 0;
}

.balance-wrap {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.125rem;
}

.account {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3125rem;
  color: var(--color-text-100);
}

.balance-w {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3125rem;
  color: var(--color-currency);
}

.balance-w .amount {
  margin-left: 3px;
}

.channel-wrap {
  overflow: hidden;
}

.channel-list {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: flex-end;
  touch-action: pan-x;
  scrollbar-width: none;
}

.channel-list::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.main-tab .channel-list li {
  display: flex;
  flex: 0 0 auto;
  width: auto;
  min-width: 7rem;
  height: 2.625rem;
  padding: 0 0.75rem;
  margin-right: 0.75rem;
  gap: 0.375rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  border: 0.0625rem solid var(--divider);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  text-align: center;
  color: var(--color-text-100);
  background-color: rgb(26, 34, 58);
  cursor: pointer;
}

.main-tab .channel-list li.active {
  background-color: transparent;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
}

.channel-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}

.line {
  height: 1px;
  margin-top: 0.625rem;
  background-color: var(--divider);
}

.amount-title {
  margin: 0.375rem 0 0.625rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  color: var(--color-text-100);
}

@media (min-width: 486px) {
  .amount-title {
    margin-bottom: 10px;
  }
}

.amount-list {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0 0 0.625rem;
  list-style: none;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
}

.amount-item {
  display: flex;
  height: 2.5rem;
  flex: 0 0 calc(33.333% - 0.5rem);
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  line-height: 2.5rem;
  text-align: center;
  background-color: rgb(26, 34, 58);
}

.amount-item.disabled {
  pointer-events: none;
}

.amount-item.on {
  background-color: transparent;
  background-image: linear-gradient(90deg, #202940 0%, #131a2c 100%);
  border: 1px solid #38a8fa;
}

.chip-amount {
  font-size: 1rem;
  font-weight: 400;
  line-height: 2.5rem;
  color: rgb(109, 120, 141);
}

.amount-item.on .chip-amount {
  font-weight: 700;
  color: rgb(255, 255, 255);
}

.chip-spacer {
  flex: 0 0 calc(33.333% - 0.5rem);
  height: 0;
}

.tips {
  display: flex;
  margin: 0 0 0.625rem;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  color: rgb(109, 120, 141);
}

.help {
  width: 16px;
  height: 16px;
  margin-right: 2px;
  color: rgb(22, 128, 220);
}

.tips span {
  color: rgb(22, 128, 220);
}

.item-row {
  display: flex;
  position: relative;
  width: 100%;
  height: 2.5rem;
  margin: 0 0 1.3125rem;
  padding-left: 0.5rem;
  align-items: center;
  border-radius: 0.375rem;
  background-color: var(--color-bg-400);
}

.left-slot {
  flex: 0 0 20px;
  width: 20px;
  height: 2.5rem;
  pointer-events: none;
}

.amount-input {
  flex: 1 1 0%;
  min-width: 0;
  height: 17px;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 17px;
  color: rgb(255, 255, 255);
  outline: none;
  appearance: none;
}

.amount-input::placeholder {
  color: rgb(255, 255, 255);
  opacity: 0.6;
}

.amount-input::-webkit-outer-spin-button,
.amount-input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.amount-input[type='number'] {
  -moz-appearance: textfield;
}

.clear-btn,
.field-clear {
  display: flex;
  width: 30px;
  height: 30px;
  padding: 0;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: rgb(153, 153, 153);
  background: transparent;
}

.clear-btn {
  margin: 5px 0;
}

.field-clear {
  margin: auto 0;
}

.clear-btn.hide,
.field-clear.hide {
  visibility: hidden;
}

.clear-icon {
  width: 18px;
  height: 18px;
}

.amount-error {
  position: absolute;
  top: 2.5rem;
  left: 0.5rem;
  margin: 5px 0 0;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
  color: rgb(197, 0, 15);
}

.method-title {
  margin: 0.75rem 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: var(--color-text-100);
}

.sub-tab .channel-list li {
  flex: 0 0 auto;
  width: 5rem;
  height: 2.125rem;
  padding: 0 0.75rem;
  margin-right: 0.75rem;
  border-radius: 0.375rem;
  border: 0.0625rem solid rgb(22, 128, 220);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 2.125rem;
  text-align: center;
  color: rgb(109, 120, 141);
  background-image: linear-gradient(90deg, rgb(32, 41, 64) 0%, rgb(19, 26, 44) 100%);
}

.form-wrap {
  margin-top: 1.3125rem;
  overflow: hidden;
}

.item {
  margin: 0 0 1.875rem;
}

.label {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.375rem;
  color: var(--color-text-100);
}

.field {
  display: flex;
  position: relative;
  height: 2.5rem;
  min-height: 44px;
  align-items: center;
}

.input-bottom {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  padding-top: 5px;
  border-top: 0.0625rem solid var(--divider);
  pointer-events: none;
}

.text-input {
  flex: 1 1 0%;
  min-width: 0;
  height: auto;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: normal;
  color: rgb(255, 255, 255);
  outline: none;
}

.text-input::placeholder {
  font-weight: 400;
  color: rgb(109, 120, 141);
  opacity: 0.6;
}

.highlight {
  position: absolute;
  right: 0;
  bottom: -1px;
  left: 0;
  height: 2px;
  background-color: rgb(56, 168, 250);
  transform: scale(0);
  transition: transform 0.2s;
  pointer-events: none;
}

.field:focus-within .highlight,
.field.invalid .highlight {
  transform: scale(1);
}

.field.invalid .highlight {
  background-color: rgb(230, 64, 33);
}

.field-error {
  margin: 5px 0 0;
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
  color: rgb(230, 64, 33);
}

.submit {
  display: block;
  width: 17.5rem;
  height: 2.5rem;
  margin: 1.25rem auto 0;
  /* Live `ion-item.submit` sets `--border-radius: 10px` on `.item-native`.
     Keep px so the corner does not grow with the scaled root rem. */
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: rgb(255, 255, 255);
  text-align: center;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 4px 15px);
}
</style>
