<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="modal">
    <div class="modal-wrap">
      <div class="content">
        <div class="header" />
        <div class="close-row">
          <button class="close" type="button" aria-label="Fechar" @click="emit('close')">
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
          <p class="title">Descobrir uma nova versão</p>
          <div class="desc-wrap">
            <p class="desc">
              Baixe o aplicativo para a sua área de trabalho para uma experiência mais fluida
            </p>
          </div>

          <div class="logo-row">
            <img class="logo" src="/images/brand/ICON.png" alt="" />
            <p class="domain">gc987.com</p>
          </div>

          <div class="action-row">
            <div class="install-btn">
              <span class="install-label">Instalar</span>
            </div>
            <div class="service-btn">
              <SvgIcon class="service-icon" name="support" />
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
  height: 22.6875rem;
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
  height: 14.25rem;
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
  height: 3.3125rem;
  align-items: center;
}

.install-btn {
  display: flex;
  height: 2.8125rem;
  margin: 0.25rem 0.125rem;
  padding: 0 1.625rem;
  justify-content: center;
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
  font-size: 1.75rem;
  color: rgb(0, 0, 0);
}
</style>
