<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SvgIcon from '../base/SvgIcon.vue'
import { useAuthStore } from '../../stores/auth'
import { useHomeStore } from '../../stores/home'
import { formatAmount } from '../../utils/money'

defineEmits<{ menu: []; login: []; register: []; search: [] }>()

const { t } = useI18n()
const auth = useAuthStore()
const home = useHomeStore()
const balanceText = computed(() => formatAmount(home.balanceCents))
</script>

<template>
  <div class="header-bar">
    <button class="menu-btn" type="button" :aria-label="tr('Menu')" @click="$emit('menu')">
      <SvgIcon name="menu" />
    </button>

    <div class="logo">
      <img src="/images/brand/LOGO.png" alt="" />
    </div>

    <div class="header-gap"></div>

    <div v-if="auth.isLoggedIn" class="assets-box">
      <p class="currency">R$</p>
      <p class="assets-box-number">{{ tr(balanceText) }}</p>
      <div class="wallet">
        <SvgIcon class="wallet-icon" name="wallet" />
      </div>
    </div>
    <div v-else class="actions">
      <button class="btn btn-login" type="button" @click="$emit('login')">{{ t('login.enter') }}</button>
      <button class="btn btn-register" type="button" @click="$emit('register')">{{ t('login.register') }}</button>
    </div>

    <button class="search" type="button" :aria-label="tr('Buscar')" @click="$emit('search')">
      <SvgIcon name="search" />
    </button>
  </div>
</template>

<style scoped>
.header-bar {
  display: flex;
  position: relative;
  z-index: 10;
  height: 3.125rem;
  min-height: 3.125rem;
  padding-right: 0.9375rem;
  padding-left: 0.25rem;
  align-items: center;
  overflow: hidden;
  background-color: rgb(9, 15, 31);
}

.menu-btn {
  display: flex;
  z-index: 99;
  width: 2.75rem;
  height: 2.375rem;
  padding: 0 0.75rem;
  align-items: center;
  flex: 0 0 auto;
}

.menu-btn .svg-icon {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
  color: rgb(255, 255, 255);
  transition: 0.3s;
}

.logo {
  /* 600×133 logo at the toolbar height, plus the 1rem gap before the balance.
     It shrinks only when the login buttons need the room. */
  display: flex;
  width: calc(2.25rem * 600 / 133 + 1rem);
  height: 2.25rem;
  padding-right: 1rem;
  align-items: center;
  flex: 0 1 auto;
  min-width: 0;
}

.logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: left center;
}

.header-gap {
  flex: 1 1 0%;
  min-width: 0;
  height: 0;
}

.actions {
  display: flex;
  width: auto;
  height: 1.5rem;
  align-items: center;
  flex: 0 0 auto;
}

.btn {
  display: flex;
  height: 1.5rem;
  padding: 0.375rem 0.25rem;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 0.75rem;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;
  color: rgb(255, 255, 255);
  border-radius: 0.375rem;
  box-shadow: var(--btn-md-shadow);
  transition:
    box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.015s linear,
    color 0.015s linear;
}

.btn-login {
  min-width: 3.370119rem;
  background-image: var(--btn-blue);
}

.btn-register {
  min-width: 4.057131rem;
  margin-left: 0.625rem;
  background-image: var(--btn-green);
}

.search {
  display: flex;
  width: 2rem;
  height: 1.5rem;
  padding-left: 0.5rem;
  align-items: center;
  flex: 0 0 auto;
}

.search .svg-icon {
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.5rem;
  color: rgb(255, 255, 255);
}

.assets-box {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  padding: 0.125rem 0.1875rem 0.125rem 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  text-align: end;
  border: 0.0625rem solid transparent;
  border-radius: 0.375rem;
}

.currency,
.assets-box-number {
  margin: 0;
  font-weight: 700;
  white-space: nowrap;
  color: var(--color-currency);
}

.currency {
  margin-right: 0.25rem;
}

.wallet {
  display: flex;
  width: 2.375rem;
  height: 1.625rem;
  margin-left: 0.375rem;
  padding: 0.25rem 0.625rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background-image: var(--btn-green);
}

.wallet-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #fff;
}
</style>
