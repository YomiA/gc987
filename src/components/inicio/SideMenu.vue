<script setup lang="ts">
import SvgIcon from '../base/SvgIcon.vue'
import type { ProviderTab } from '../../api/mock'

defineProps<{
  open: boolean
  tabs: ProviderTab[]
  active: string
}>()

const emit = defineEmits<{
  close: []
  select: [key: string]
}>()
</script>

<template>
  <div
    class="menu-root"
    :class="{ open }"
    :aria-hidden="open ? 'false' : 'true'"
  >
    <div class="backdrop" @click="emit('close')" />
    <aside class="panel" role="dialog" aria-label="Menu">
      <div class="menu-header">
        <button class="menu-btn" type="button" aria-label="Fechar" @click="emit('close')">
          <SvgIcon class="menu-icon" name="menu" />
        </button>
        <img class="logo" src="/images/brand/LOGO.png" alt="" />
      </div>

      <div class="menu-body">
        <div class="list-shell">
          <div class="list-scroll">
            <div class="game-platform">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                class="platform-item"
                :class="{ on: tab.key === active }"
                @click="emit('select', tab.key)"
              >
                <span class="icon-wrap">
                  <SvgIcon v-if="tab.icon" class="icon-svg" :name="tab.icon" />
                  <i
                    v-else
                    class="icon-sprite"
                    :style="{ backgroundPosition: tab.spritePosition ?? undefined }"
                  />
                </span>
                <span class="item-label">{{ tab.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <button class="records" type="button">Recordes de Apostas</button>
        <div class="grid-gap" />

        <div class="support-wrap">
          <div class="support">
            <span class="support-line" />
            <div class="support-copy">
              <p class="support-title">Suporte</p>
              <p class="support-sub">24/7</p>
            </div>
            <span class="support-icon">
              <SvgIcon name="support-menu" />
            </span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.menu-root {
  position: absolute;
  inset: 0;
  z-index: 200;
  pointer-events: none;
}

.menu-root.open {
  pointer-events: auto;
}

.backdrop {
  position: absolute;
  inset: 0;
  background-color: rgb(0, 0, 0);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* The live page stacks two scrims behind the drawer: the ion-menu host paints
   rgba(0, 0, 0, 0.7) and its ion-backdrop adds another 0.25 black on top.
   0.775 is the same composite in one layer. */
.menu-root.open .backdrop {
  opacity: 0.775;
}

.panel {
  display: flex;
  position: absolute;
  top: 2.75rem;
  left: 0;
  width: 13.75rem;
  max-width: 13.75rem;
  height: calc(100% - 2.75rem);
  flex-direction: column;
  overflow: hidden;
  background-color: transparent;
  border-radius: 0 1.25rem 1.25rem 0;
  box-shadow: rgba(0, 0, 0, 0.18) 0.25rem 0 1rem 0;
  backdrop-filter: blur(0.25rem);
  transform: translate3d(-100%, 0, 0);
  transition: transform 0.3s ease;
}

.menu-root.open .panel {
  transform: translate3d(0, 0, 0);
}

.menu-header {
  display: flex;
  height: 3.125rem;
  min-height: 3.125rem;
  align-items: center;
  background-color: #141b24cc;
}

.menu-btn {
  display: flex;
  z-index: 99;
  width: 2.75rem;
  height: 1.25rem;
  margin-left: 0.25rem;
  padding: 0 0.75rem;
  align-items: center;
}

.menu-icon {
  width: 1.25rem;
  height: 1.25rem;
  font-size: 1.25rem;
  color: rgb(255, 255, 255);
  transform: scale(-1, -1);
  transition: 0.3s;
}

.logo {
  width: 10.75rem;
  height: 2.25rem;
  padding-right: 1rem;
  object-fit: contain;
}

.menu-body {
  flex: 1 1 auto;
  min-height: 0;
  padding-left: 0.3125rem;
  overflow: hidden;
  background-color: rgba(20, 27, 36, 0.8);
}

.list-shell {
  width: 11.5625rem;
  height: 19.625rem;
  margin: 0 1.25rem 0 0.625rem;
  padding: 0.4375rem 0.3125rem 0.4375rem 0;
  background-color: rgba(0, 0, 0, 0.28);
  border-radius: 0.375rem;
}

/* Deliberately no `scrollbar-width`/`scrollbar-color`: setting either makes
   Chrome fall back to the standard scrollbar and ignore the ::-webkit rules
   below, which is not what the live page renders. */
.list-scroll {
  width: 11.25rem;
  height: 18.75rem;
  padding-bottom: 0.3125rem;
  padding-left: 0.3125rem;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.list-scroll::-webkit-scrollbar {
  width: 0.125rem;
  background: rgb(33, 35, 42);
}

.list-scroll::-webkit-scrollbar-thumb {
  background-color: rgb(33, 114, 174);
  border-radius: 0.0625rem;
}

/* The solid block is only as wide as the rows; the shell's translucent black
   stays visible in the 5px/7px gutters either side. */
.game-platform {
  width: 10.5rem;
  background-color: rgb(9, 15, 31);
}

.platform-item {
  display: flex;
  width: 10.5rem;
  height: 2.875rem;
  padding: 0.5625rem 0.625rem;
  align-items: center;
  gap: 0.5rem;
}

.icon-wrap {
  width: 1.75rem;
  height: 1.75rem;
  overflow: hidden;
  background-image: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.06));
  border-radius: 0.1875rem;
}

.icon-svg,
.icon-sprite {
  display: block;
  width: 1.75rem;
  height: 1.75rem;
  font-size: 1.75rem;
}

.icon-sprite {
  background-image: url('/images/bg/platform-sprite.png');
  background-size: 800% 500%;
}

.item-label {
  max-width: 6.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.3125rem;
  color: rgb(255, 255, 255);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.grid-gap {
  width: 13.4375rem;
  height: 0.625rem;
  padding: 0.3125rem;
}

.records {
  display: flex;
  width: 11.5625rem;
  height: 2.5rem;
  margin: 0.9375rem 1.25rem 0.625rem 0.625rem;
  padding: 0 1.375rem;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.09375rem;
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: rgb(28, 36, 50);
  border-radius: 0.375rem;
}

.support-wrap {
  padding: 0.625rem;
}

.support {
  display: flex;
  position: relative;
  width: 11.5625rem;
  height: 2.8125rem;
  margin-bottom: 0.625rem;
  padding-left: 1rem;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(90deg, rgb(17, 49, 110), rgb(28, 36, 50) 40%, rgb(28, 36, 50));
  border-radius: 0.375rem;
}

.support-line {
  position: absolute;
  top: 0.5313rem;
  left: 0;
  width: 0.125rem;
  height: 1.75rem;
  background-image: linear-gradient(rgb(16, 97, 255), rgb(0, 55, 161));
}

.support-copy {
  display: flex;
  flex-direction: column;
}

.support-title {
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
  color: rgb(255, 255, 255);
}

.support-sub {
  font-size: 0.625rem;
  font-weight: 400;
  line-height: 0.9375rem;
  color: rgb(120, 120, 120);
}

.support-icon {
  display: flex;
  width: 1.625rem;
  height: 1.625rem;
  margin-right: 0.625rem;
  align-items: center;
  justify-content: center;
  color: rgb(255, 255, 255);
  background-image: linear-gradient(0deg, rgb(1, 103, 202) -13.77%, rgb(56, 168, 250) 102.34%);
  border-radius: 9999px;
}

.support-icon :deep(.svg-icon) {
  width: 1.625rem;
  height: 1.625rem;
}
</style>
