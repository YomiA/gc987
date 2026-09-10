<script setup lang="ts">
/**
 * Signed-in Depósito form: online segment, pix channel, promo copy, amount
 * input, chips, submit. Geometry from https://gc987.com/main/entrar at 390.
 */
import SvgIcon from '../base/SvgIcon.vue'
import { formatAmount } from '../../api/entrar'

const props = defineProps<{
  tabLabel: string
  reco: string
  channelLabel: string
  channelReco: boolean
  promo: string
  currency: string
  placeholder: string
  amountReais: string
  amounts: number[]
  selectedCents: number | null
  canSubmit: boolean
  submitLabel: string
}>()

const emit = defineEmits<{
  'update:amountReais': [value: string]
  selectAmount: [cents: number]
  clear: []
  submit: []
}>()

function onInput(event: Event) {
  const el = event.target as HTMLInputElement
  emit('update:amountReais', el.value)
}
</script>

<template>
  <div class="form">
    <div class="seg">
      <button type="button" class="seg-btn on">
        <span class="seg-inner">
          <span class="seg-label">{{ props.tabLabel }}</span>
          <span class="seg-tag">{{ props.reco }}</span>
        </span>
        <span class="seg-indicator" />
      </button>
    </div>

    <ul class="channel-list">
      <li class="channel on">
        <div v-if="props.channelReco" class="channel-tag"><i>{{ props.reco }}</i></div>
        {{ props.channelLabel }}
      </li>
    </ul>

    <div class="line" />

    <p class="text-description">
      <span class="desc-text">{{ props.promo }}</span>
    </p>

    <div class="money-input">
      <span class="left-label">{{ props.currency }}</span>
      <input
        class="native-input"
        type="number"
        inputmode="decimal"
        :placeholder="props.placeholder"
        :value="props.amountReais"
        @input="onInput"
      />
      <button
        type="button"
        class="clear-btn"
        :class="{ hide: props.amountReais === '' }"
        aria-label="reset"
        @click="emit('clear')"
      >
        <SvgIcon class="clear-icon" name="register-clear" />
      </button>
      <span class="end-wrapper" />
    </div>

    <div class="chip-list">
      <button
        v-for="cents in props.amounts"
        :key="cents"
        type="button"
        class="chip"
        :class="{ on: props.selectedCents === cents }"
        @click="emit('selectAmount', cents)"
      >
        <span class="chip-amount">{{ formatAmount(cents) }}</span>
      </button>
      <div class="placeholder-btn" aria-hidden="true" />
    </div>

    <button
      type="button"
      class="submit"
      :class="{ disabled: !props.canSubmit }"
      :disabled="!props.canSubmit"
      @click="emit('submit')"
    >
      {{ props.submitLabel }}
    </button>
  </div>
</template>

<style scoped>
.seg {
  display: flex;
  position: relative;
  height: 3.0625rem;
  margin-top: 0.625rem;
  border-bottom: 1px solid var(--divider);
}

.seg-btn {
  display: flex;
  position: relative;
  height: 3rem;
  padding: 0 1rem;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

/* Live slots RECO inside ion-segment's .button-inner (100.54 wide), not the
   padded host. right: 2px is measured from this inner box. */
.seg-inner {
  display: flex;
  position: relative;
  height: 3rem;
  align-items: center;
  justify-content: center;
}

.seg-label {
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  color: rgb(255, 255, 255);
  white-space: nowrap;
}

.seg-tag {
  position: absolute;
  top: 0.25rem;
  right: 0.125rem;
  padding: 0 2px 2px;
  border-radius: 4px;
  background-color: #e64021;
  font-size: 8px;
  line-height: normal;
  text-align: center;
  color: rgb(255, 255, 255);
}

.seg-indicator {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 0.0625rem;
  background-image: linear-gradient(0deg, #0167ca, #38a8fa);
}

.channel-list {
  display: flex;
  width: 100%;
  height: 3.4375rem;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: space-between;
}

.channel {
  position: relative;
  width: 6.875rem;
  height: 2.5rem;
  margin-top: 0.9375rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 2.5rem;
  color: rgb(255, 255, 255);
  text-align: center;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
}

.channel-tag {
  position: absolute;
  top: -0.375rem;
  right: 0;
  height: 0.9375rem;
  padding: 0 3px;
  border-radius: 4px;
  background-color: #e64021;
  font-size: 8px;
  line-height: 0.9375rem;
  color: rgb(255, 255, 255);
}

.channel-tag i {
  font-size: 8px;
  font-style: italic;
  font-weight: 400;
  color: rgb(255, 255, 255);
}

.line {
  width: 100%;
  height: 1px;
  margin-top: 0.9375rem;
  background-color: var(--divider);
}

.text-description {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5rem;
  color: rgb(255, 255, 255);
}

.desc-text {
  display: block;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  color: rgb(255, 255, 255);
  white-space: pre-line;
}

.money-input {
  display: flex;
  width: 100%;
  height: 3.125rem;
  margin: 1.125rem 0;
  padding: 0 0.625rem;
  align-items: center;
  border-radius: 0.375rem;
  background-color: var(--game-card-bg);
}

.left-label {
  margin-right: 0.3125rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: normal;
  color: rgb(135, 146, 175);
  flex: 0 0 auto;
}

.native-input {
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

.native-input::placeholder {
  color: rgb(135, 146, 175);
}

.native-input::-webkit-outer-spin-button,
.native-input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

.native-input[type='number'] {
  -moz-appearance: textfield;
}

.clear-btn {
  display: flex;
  width: 30px;
  height: 30px;
  margin: 10px 0;
  padding: 0;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: rgb(153, 153, 153);
}

/* Live ion-input keeps the clear control in flow (visibility:hidden when empty)
   plus a 16px end-wrapper, so the value does not shift after a chip is picked. */
.clear-btn.hide {
  visibility: hidden;
}

.end-wrapper {
  flex: 0 0 auto;
  width: 0;
  margin-left: 16px;
}

.clear-icon {
  width: 18px;
  height: 18px;
}

.chip-list {
  display: flex;
  width: 100%;
  margin-bottom: 0.625rem;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  align-content: space-between;
  gap: 0.625rem;
}

.chip {
  display: flex;
  height: 2.5rem;
  flex: 0 0 calc(33.333% - 0.416667rem);
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  line-height: 2.5rem;
  text-align: center;
  background-color: rgb(26, 34, 58);
}

.chip.on {
  background-color: transparent;
  background-image: linear-gradient(90deg, #202940 0%, #131a2c 100%);
  border: 1px solid #38a8fa;
}

.chip-amount {
  display: block;
  height: 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: rgb(109, 120, 141);
}

.placeholder-btn {
  flex: 0 0 calc(33.333% - 0.416667rem);
}

.chip.on .chip-amount {
  color: rgb(255, 255, 255);
}

.submit {
  display: block;
  width: 17.5rem;
  height: 2.5rem;
  margin: 1.25rem auto 0;
  border-radius: 0.625rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 2.5rem;
  color: rgb(255, 255, 255);
  text-align: center;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  filter: drop-shadow(rgba(32, 139, 229, 0.25) 0 4px 15px);
}

.submit.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
