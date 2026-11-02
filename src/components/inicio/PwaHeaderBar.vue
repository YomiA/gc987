<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'
import { usePwaInstall } from '../../composables/usePwaInstall'

const emit = defineEmits<{ close: [] }>()
const { promptInstall } = usePwaInstall()
</script>

<template>
  <div class="pwa-bar">
    <img class="app-icon" src="/images/brand/ICON.png" alt="" />
    <div class="copy">
      <p class="headline">Baixe Nosso APP, Ganhe Super Prêmios!</p>
      <img class="prize" src="/images/brand/pwa-prize.png" alt="" />
    </div>
    <div class="install">
      <button type="button" @click="promptInstall">Instalar</button>
    </div>
    <button class="close" type="button" aria-label="Fechar" @click="emit('close')">
      <SvgIcon name="close" />
    </button>
  </div>
</template>

<style scoped>
.pwa-bar {
  display: flex;
  position: relative;
  z-index: 10;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 0.25rem;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(255, 255, 255);
  background-image: var(--pwa-bar-bg);
}

.app-icon {
  width: 2.25rem;
  height: 2.25rem;
  margin-left: 0.75rem;
  margin-right: 0.5rem;
  object-fit: cover;
  flex: 0 0 auto;
}

.copy {
  display: flex;
  align-items: center;
  width: 13.75rem;
  height: 2rem;
  flex: 1 1 0%;
}

.headline {
  width: 9.5019375rem;
  height: 2rem;
  flex: 0 0 auto;
}

.prize {
  width: 4.24805rem;
  height: 2rem;
  object-fit: contain;
  flex: 0 0 auto;
}

.install {
  width: 4rem;
  min-width: 4rem;
  height: 1.625rem;
  margin-left: 0.25rem;
  padding: 0.3125rem;
  text-align: center;
  background-image: var(--btn-blue);
  border-radius: 0.375rem;
  flex: 0 0 auto;
}

.install button {
  display: inline-block;
  width: 3.375rem;
  height: 0.75rem;
  line-height: 0.75rem;
}

.close {
  display: flex;
  z-index: 99;
  width: 1.125rem;
  height: 2.375rem;
  margin: 0 0.625rem;
  align-items: center;
  flex: 0 0 auto;
}

.close .svg-icon {
  width: 1.125rem;
  height: 1.125rem;
  font-size: 1.125rem;
  color: rgb(255, 255, 255);
}
</style>
