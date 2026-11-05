<script setup lang="ts">
/**
 * Live body widget `.box.xuanfu.touming` (combined-r2 refresh btn).
 * Pointer down drops `.touming` (opacity 1). Pointer leave + 6s restores it.
 * Open flies a 60px reload chip; pointer down outside unchecks and retracts.
 */
import { onBeforeUnmount, ref } from 'vue'

const TOGGLE_ID = 'gc987-side-fab'
const FADE_MS = 6000

const hostRef = ref<HTMLElement | null>(null)
const faded = ref(true)
const opened = ref(false)
const flyFromLeft = ref(true)

let fadeTimer: ReturnType<typeof setTimeout> | undefined
let closeTimer: ReturnType<typeof setTimeout> | undefined
let outsideBound = false

function reload() {
  window.location.reload()
}

function clearFadeTimer() {
  if (fadeTimer !== undefined) {
    clearTimeout(fadeTimer)
    fadeTimer = undefined
  }
}

function clearCloseTimer() {
  if (closeTimer !== undefined) {
    clearTimeout(closeTimer)
    closeTimer = undefined
  }
}

function makeSolid() {
  clearFadeTimer()
  faded.value = false
}

function scheduleFade() {
  clearFadeTimer()
  fadeTimer = setTimeout(() => {
    faded.value = true
    fadeTimer = undefined
  }, FADE_MS)
}

function collapse() {
  opened.value = false
}

function hideRefreshButton(e: Event) {
  const target = e.target
  if (!(target instanceof Node) || hostRef.value?.contains(target)) return
  collapse()
}

function bindOutsideClose() {
  if (outsideBound) return
  document.addEventListener('pointerdown', hideRefreshButton)
  document.addEventListener('touchstart', hideRefreshButton)
  outsideBound = true
}

function unbindOutsideClose() {
  if (!outsideBound) return
  document.removeEventListener('pointerdown', hideRefreshButton)
  document.removeEventListener('touchstart', hideRefreshButton)
  outsideBound = false
}

function onHostPointerDown() {
  makeSolid()
}

function onHostPointerEnter() {
  clearFadeTimer()
}

function onHostPointerLeave() {
  scheduleFade()
}

function onHostClick() {
  clearCloseTimer()
  bindOutsideClose()
  closeTimer = setTimeout(() => {
    collapse()
    unbindOutsideClose()
    closeTimer = undefined
  }, FADE_MS)
}

function onBoxButtonClick(e: MouseEvent) {
  flyFromLeft.value = e.clientX <= document.documentElement.clientWidth / 2
}

onBeforeUnmount(() => {
  clearFadeTimer()
  clearCloseTimer()
  unbindOutsideClose()
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="hostRef"
      class="side-fab"
      :class="{ touming: faded, 'is-open': opened, 'from-left': flyFromLeft }"
      @pointerdown="onHostPointerDown"
      @pointerenter="onHostPointerEnter"
      @pointerleave="onHostPointerLeave"
      @click="onHostClick"
    >
      <input
        :id="TOGGLE_ID"
        v-model="opened"
        class="box-button"
        type="checkbox"
        @click="onBoxButtonClick"
      />
      <label class="circular" :for="TOGGLE_ID"></label>
      <label class="fork" :for="TOGGLE_ID"></label>
      <ul>
        <li class="box-item">
          <a href="#" :aria-label="tr('Reload')" @click.prevent="reload">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path
                fill="#ccc"
                d="M27.1 14.313V5.396L24.158 8.34c-2.33-2.325-5.033-3.503-8.11-3.503C9.902 4.837 4.901 9.847 4.899 16c.001 6.152 5.003 11.158 11.15 11.16 4.276 0 9.369-2.227 10.836-8.478l.028-.122h-3.23l-.022.068c-1.078 3.242-4.138 5.421-7.613 5.421a8 8 0 0 1-5.691-2.359A7.993 7.993 0 0 1 8 16.001c0-4.438 3.611-8.049 8.05-8.049 2.069 0 3.638.58 5.924 2.573l-3.792 3.789H27.1z"
              />
            </svg>
          </a>
        </li>
      </ul>
    </div>
  </Teleport>
</template>

<style scoped>
.side-fab {
  --item-translateX: -100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20010;
  width: 0;
  height: 0;
  overflow: visible;
  opacity: 1;
}

.side-fab.touming {
  opacity: 0.2;
}

.box-button,
.circular,
.fork,
.box-item {
  position: absolute;
  top: 200px;
  right: -20px;
}

.box-button {
  display: block;
  width: 30px;
  height: 30px;
  margin: 0;
  z-index: 2;
  cursor: pointer;
  opacity: 0;
}

.circular {
  display: block;
  width: 30px;
  height: 30px;
  z-index: 1;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.2);
  transform-origin: 50% 50%;
  transition: 0.5s;
}

.is-open .circular {
  width: 0;
  height: 0;
  border: 0;
  box-shadow: none;
}

.is-open .fork {
  display: block;
  width: 30px;
  height: 30px;
  z-index: 1;
  margin: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.2);
  transform: rotate(360deg);
  transition: 0.5s;
}

.is-open .fork::before,
.is-open .fork::after {
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1;
  width: 30px;
  height: 3px;
  border-radius: 2.5px;
  transition: 0.5s;
}

.is-open .fork::before {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.is-open .fork::after {
  transform: translate(-50%, -50%) rotate(45deg);
}

.side-fab ul {
  margin: 0;
  padding: 0;
}

.box-item {
  display: block;
  width: 60px;
  height: 60px;
  list-style: none;
  opacity: 0;
  transform: rotate(90deg);
  transition: 0.5s;
}

.box-item:nth-child(1) a {
  transform: rotate(0deg);
}

.box-item a {
  display: flex;
  width: inherit;
  height: inherit;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.65);
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  pointer-events: none;
  transition: 0.2s;
}

.is-open .box-item {
  opacity: 1;
}

.is-open.from-left .box-item:nth-child(1) {
  transform: rotate(135deg) translateX(var(--item-translateX));
}

.is-open:not(.from-left) .box-item:nth-child(1) {
  transform: rotate(45deg) translateX(var(--item-translateX));
}

.is-open .box-item a {
  pointer-events: auto;
}
</style>
