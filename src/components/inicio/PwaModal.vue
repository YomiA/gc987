<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'
import { isAppleMobile, usePwaInstall } from '../../composables/usePwaInstall'

const emit = defineEmits<{ close: [] }>()
const { promptInstall } = usePwaInstall()

async function onInstall() {
  const accepted = await promptInstall()
  if (accepted) emit('close')
}

/**
 * Live CompulsoryModal: `os !== "iOSH5"` gates `.tip-box`. Apple phones
 * (iPhone/iPad) therefore never get the Android install steps.
 */
const isAppleDevice = isAppleMobile()

const androidSteps = [
  'Clique no botão acima para baixar o arquivo de instalação',
  'para Android',
  'Permita a instalação de aplicativos de fontes desconhecidas nas configurações do seu dispositivo.',
  'Conclua a instalação.',
]
</script>

<template>
  <div class="modal">
    <div class="modal-wrap">
      <div class="content">
        <div class="header" />
        <div class="close-row">
          <button class="close" type="button" :aria-label="tr('Fechar')" @click="emit('close')">
            <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="30" height="30" rx="10" fill="#909090" fill-opacity="0.3" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="white"
                d="M14.435 12.835a1 1 0 0 0 1.414 0l4.986-4.986a1 1 0 0 1 1.414 0l.186.186a1 1 0 0 1 0 1.414l-4.986 4.986a1 1 0 0 0 0 1.414l4.986 4.986a1 1 0 0 1 0 1.414l-.186.186a1 1 0 0 1-1.414 0l-4.986-4.986a1 1 0 0 0-1.414 0l-4.986 4.986a1 1 0 0 1-1.414 0l-.186-.186a1 1 0 0 1 0-1.414l4.986-4.986a1 1 0 0 0 0-1.414L7.849 9.449a1 1 0 0 1 0-1.414l.186-.186a1 1 0 0 1 1.414 0l4.986 4.986Z"
              />
            </svg>
          </button>
        </div>

        <div class="body">
          <p class="title">{{ tr('Descobrir uma nova versão') }}</p>
          <div class="desc-wrap">
            <p class="desc">
              {{ tr('Baixe o aplicativo para a sua área de trabalho para uma experiência mais fluida') }}
            </p>
          </div>

          <div class="logo-row">
            <img class="logo" src="/images/brand/ICON.png" alt="" />
            <p class="domain">gc987.com</p>
          </div>

          <div class="action-row">
            <div class="install-btn" @click="onInstall">
              <SvgIcon class="install-icon" name="pwa-download" />
              <span class="install-label">{{ tr('Instalar') }}</span>
            </div>
            <div class="service-btn">
              <SvgIcon class="service-icon" name="pwa-service" />
            </div>
          </div>

          <div v-if="!isAppleDevice" class="tip-box">
            <p class="tip-title">{{ tr('Instalação de um aplicativo Android:') }}</p>
            <div v-for="(step, i) in androidSteps" :key="i" class="tip-step">
              <p class="tip-index">{{ tr(i + 1) }}.</p>
              <span>{{ tr(step) }}</span>
            </div>
            <div class="warn">
              <div class="warn-head">
                <SvgIcon class="warn-icon" name="pwa-tip" />
                <p class="warn-title">{{ tr('Aviso Amigável:') }}</p>
              </div>
              <p class="warn-body">
                {{ tr('Este aplicativo passou na certificação de segurança do Google Play, portanto, fique à vontade para instalá-lo.') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20008;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
}

.modal-wrap {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-end;
}

.content {
  position: relative;
  width: 24.375rem;
  background-color: rgb(255, 255, 255);
  border-radius: 1.25rem 1.25rem 0 0;
}

.header {
  width: 24.375rem;
  height: 8.4375rem;
  background-image: url('/images/bg/bg-forced-popup-BR.png');
  background-size: 100% auto;
}

.close-row {
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3.125rem;
  padding: 0.625rem;
  justify-content: flex-end;
  align-items: center;
}

.close {
  width: 1.875rem;
  height: 1.875rem;
  font-size: 1.875rem;
}

.close svg {
  width: 1.875rem;
  height: 1.875rem;
}

.body {
  display: flex;
  width: 24.375rem;
  padding: 0.25rem 1.5rem 1.75rem;
  flex-direction: column;
  align-items: center;
  color: rgb(0, 0, 0);
}

.title {
  height: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
}

.desc-wrap {
  width: 21.375rem;
  height: 2rem;
}

.desc {
  width: 21.375rem;
  height: 2rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

.logo-row {
  display: flex;
  width: 21.375rem;
  height: 3.4375rem;
  margin: 0.75rem 0;
  padding: 0.3125rem 0.5rem;
  align-items: center;
  background-color: rgb(245, 245, 245);
  border-radius: 0.3125rem;
}

.logo {
  width: 2.8125rem;
  height: 2.8125rem;
  margin-right: 0.5rem;
  object-fit: contain;
}

.domain {
  font-size: 1rem;
  line-height: 1.5rem;
}

.action-row {
  display: flex;
  width: 21.375rem;
  align-items: center;
}

.install-btn {
  display: flex;
  height: 2.8125rem;
  /* Live ion-button uses 4px 2px / 26px, not rem — rem would drift on desktop. */
  margin: 4px 2px;
  padding: 0 26px;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  flex: 1 1 0%;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 0.875rem;
  text-align: center;
  color: rgb(255, 255, 255);
  background-image: linear-gradient(rgb(114, 203, 69) 0%, rgb(51, 118, 17) 100%);
  border-radius: 999px;
  box-shadow: var(--btn-md-shadow);
}

.install-icon {
  width: 1.25rem;
  height: 1.181rem;
  font-size: 1.181rem;
  /* Ionic start-slot: ±0.3em of the icon font-size (18.9px at 390). */
  margin: 0 0.3em 0 -0.3em;
  flex: 0 0 auto;
  color: rgb(255, 255, 255);
}

.install-label {
  display: flex;
  height: 100%;
  flex: 1 1 0%;
  align-items: center;
  justify-content: center;
  min-width: 0;
  line-height: 0.875rem;
}

.service-btn {
  width: 2.75rem;
  height: 2.8125rem;
  margin-left: 0.625rem;
  padding: 0.5rem;
  background-color: rgb(245, 245, 245);
  border-radius: 9999px;
}

.service-icon {
  width: 1.75rem;
  height: 1.75rem;
}

.tip-box {
  width: 21.375rem;
  color: rgb(0, 0, 0);
}

.tip-title {
  margin: 0.625rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
}

.tip-step {
  display: flex;
  width: 100%;
  font-size: 0.75rem;
  line-height: 1rem;
}

.tip-index {
  margin-right: 0.375rem;
}

.warn {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.3125rem 0.625rem;
  background-color: rgb(245, 245, 245);
  border-radius: 0.3125rem;
}

.warn-head {
  display: flex;
  align-items: center;
}

.warn-icon {
  width: 0.8125rem;
  height: 0.8125rem;
  color: rgb(0, 0, 0);
}

.warn-title {
  margin-left: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.21875rem;
}

.warn-body {
  font-size: 0.625rem;
  line-height: 0.78125rem;
}
</style>
