<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SvgIcon from '../base/SvgIcon.vue'

defineEmits<{ menu: []; login: []; register: []; search: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="header-bar">
    <button class="menu-btn" type="button" aria-label="Menu" @click="$emit('menu')">
      <SvgIcon name="menu" />
    </button>

    <div class="logo">
      <img src="/images/brand/LOGO.png" alt="" />
    </div>

    <div class="actions">
      <button class="btn btn-login" type="button" @click="$emit('login')">{{ t('login.enter') }}</button>
      <button class="btn btn-register" type="button" @click="$emit('register')">{{ t('login.register') }}</button>
    </div>

    <button class="search" type="button" aria-label="Buscar" @click="$emit('search')">
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
  width: 10.38525rem;
  height: 2.25rem;
  padding-right: 1rem;
  flex: 0 0 auto;
}

.logo img {
  width: 9.38525rem;
  height: 2.25rem;
  object-fit: contain;
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
</style>
