<script setup lang="ts">
/**
 * Logout confirm on /main/perfil (Sair row).
 */
import { useI18n } from 'vue-i18n'

defineEmits<{
  cancel: []
  sair: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="overlay" @click="$emit('cancel')">
    <div class="logout-modal" @click.stop>
      <div class="logout-modal-title">{{ t('perfil.logoutTitle') }}</div>
      <div class="logout-modal-message">{{ t('perfil.logoutMessage') }}</div>
      <div class="logout-modal-btn">
        <button type="button" class="logout-modal-btn-left" @click="$emit('cancel')">
          {{ t('perfil.logoutCancel') }}
        </button>
        <button type="button" class="logout-modal-btn-right" @click="$emit('sair')">
          {{ t('perfil.sair') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ion-modal.show-modal: 390×844, flex center, z-index 20018,
   background rgba(0,0,0,.8). Backdrop opacity is 0 — the dim is the host. */
.overlay {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20018;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}

/* .logout-modal: min-height 10rem, padding 17px 14px 14px, radius 10,
   background #2d323d. Width is fit-content from the two 151px buttons. */
.logout-modal {
  min-width: 21.625rem;
  min-height: 10rem;
  padding: 1.0625rem 0.875rem 0.875rem;
  border-radius: 0.625rem;
  background-color: #2d323d;
}

/* 18px/27px/700 white, margin-bottom 1.7188rem. */
.logout-modal-title {
  width: 100%;
  margin: 0 0 1.7188rem;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.6875rem;
  color: var(--color-text-100);
  text-align: center;
}

/* 14px/21px/400 rgba(255,255,255,.4), margin-bottom 2.0313rem. */
.logout-modal-message {
  width: 100%;
  margin: 0 0 2.0313rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.logout-modal-btn {
  display: flex;
  align-items: center;
}

/* ion-button: 14px/700, height 49, min-width 151, radius 6, md shadow.
   Ionic default margin 4px 2px; left adds margin-right 10px. */
.logout-modal-btn-left,
.logout-modal-btn-right {
  display: flex;
  min-width: 9.4375rem;
  height: 3.0625rem;
  padding: 0;
  flex: 1 1 0%;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 0.875rem;
  color: var(--color-text-100);
  border-radius: 0.375rem;
  box-shadow: var(--btn-md-shadow);
}

.logout-modal-btn-left {
  margin: 0.25rem 0.625rem 0.25rem 0.125rem;
  background-image: linear-gradient(0deg, #0167ca 0%, #38a8fa 100%);
  border: 0;
}

.logout-modal-btn-right {
  margin: 0.25rem 0.125rem;
  background-color: #2d323d;
  border: 1px solid #0167ca;
}
</style>
