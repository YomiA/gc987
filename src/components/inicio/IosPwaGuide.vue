<script setup lang="ts">
/**
 * Live `IosPwaGuideModal` (ion-modal #ios-pwa-guide).
 * Shown when an iPhone taps the top download bar.
 */
const emit = defineEmits<{ close: [] }>()

const host = location.host
</script>

<template>
  <div class="guide" @click="emit('close')">
    <div class="sheet" @click.stop>
      <div class="head">
        <p class="title">{{ tr('Instale o aplicativo') }}</p>
        <button class="close" type="button" :aria-label="tr('Fechar')" @click="emit('close')">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6.2 5.2a1 1 0 0 0 0 1.4L10.6 11 6.2 15.4a1 1 0 0 0 0 1.4l.4.4a1 1 0 0 0 1.4 0L12.4 12.8 16.8 17.2a1 1 0 0 0 1.4 0l.4-.4a1 1 0 0 0 0-1.4L14.2 11 18.6 6.6a1 1 0 0 0 0-1.4l-.4-.4a1 1 0 0 0-1.4 0L12.4 9.2 8 4.8a1 1 0 0 0-1.4 0l-.4.4Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div class="card">
        <img class="app-icon" src="/images/brand/ICON.png" alt="" />
        <div class="app-copy">
          <p class="app-name">gc987.com</p>
          <p class="app-host">{{ host }}</p>
        </div>
      </div>

      <div class="step step-sm">
        <p class="index">1.</p>
        <div class="step-copy">
          <p>{{ tr('Toque em') }}</p>
          <img class="glyph mx" src="/images/ios-pwa/share.svg" alt="" />
          <p>{{ tr('ou') }}</p>
          <img class="glyph ml" src="/images/ios-pwa/more.svg" alt="" />
          <img class="glyph mx" src="/images/ios-pwa/right.svg" alt="" />
          <img class="glyph mr" src="/images/ios-pwa/share.svg" alt="" />
          <p>{{ tr('na barra do navegador') }}</p>
        </div>
      </div>

      <div class="step spaced">
        <p class="index">2.</p>
        <div class="step-copy">
          <p>{{ tr('Role e selecione') }}</p>
          <p class="add-box">{{ tr('Adicionar à Tela de Início') }}</p>
        </div>
      </div>

      <div class="step">
        <p class="index">3.</p>
        <div class="step-copy">
          <p>{{ tr('Role e selecione') }}</p>
          <img class="home-icon" src="/images/brand/ICON.png" alt="" />
          <p>{{ tr('na tela inicial') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guide {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20008;
  justify-content: center;
  align-items: flex-end;
  background-color: rgba(0, 0, 0, 0.32);
}

/* Ionic ion-modal enter/leave: sheet rises from the bottom, backdrop fades. */
.guide.ios-guide-enter-active,
.guide.ios-guide-leave-active {
  transition: background-color 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.guide.ios-guide-enter-from,
.guide.ios-guide-leave-to {
  background-color: rgba(0, 0, 0, 0);
}

.sheet {
  width: 24.375rem;
  padding: 1.75rem 1.25rem 2rem;
  border-radius: 1.25rem 1.25rem 0 0;
  background-color: #fff;
  color: #000;
  transform: translate3d(0, 0, 0);
}

.guide.ios-guide-enter-active .sheet,
.guide.ios-guide-leave-active .sheet {
  transition: transform 500ms cubic-bezier(0.32, 0.72, 0, 1);
}

.guide.ios-guide-enter-from .sheet,
.guide.ios-guide-leave-to .sheet {
  transform: translate3d(0, 100%, 0);
}

@media (prefers-reduced-motion: reduce) {
  .guide.ios-guide-enter-active,
  .guide.ios-guide-leave-active,
  .guide.ios-guide-enter-active .sheet,
  .guide.ios-guide-leave-active .sheet {
    transition-duration: 1ms;
  }
}

.head {
  display: flex;
  align-items: center;
}

.title {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5rem;
}

.close {
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  flex: 0 0 auto;
  color: #000;
}

.close svg {
  width: 1.5rem;
  height: 1.5rem;
}

.card {
  display: flex;
  align-items: center;
  margin: 2rem 0;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.app-icon {
  width: 2.75rem;
  height: 2.75rem;
  margin-right: 0.5rem;
  border-radius: 0.625rem;
  object-fit: cover;
}

.app-copy {
  margin-left: 0.625rem;
}

.app-name {
  margin-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
}

.app-host {
  font-size: 0.75rem;
  line-height: 1rem;
}

.step {
  display: flex;
  align-items: flex-start;
}

.step-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.spaced {
  margin: 2rem 0;
}

.index {
  margin-right: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
}

.step-copy {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.glyph {
  width: 1.25rem;
  height: 1.25rem;
  flex: 0 0 auto;
}

.mx {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}

.ml {
  margin-left: 0.25rem;
}

.mr {
  margin-right: 0.25rem;
}

.add-box {
  margin-left: 0.5rem;
  padding: 0 0.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
}

.home-icon {
  width: 1.5rem;
  height: 1.5rem;
  margin: 0 0.5rem;
  border-radius: 0.375rem;
  object-fit: cover;
}
</style>
