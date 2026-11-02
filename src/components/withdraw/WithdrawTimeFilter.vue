<script setup lang="ts">
/**
 * Time pill + ion-popover on /withdrawSubView Registro de Saques.
 * Same chip grid as /user/report, but the pill is 32px / 4px radius and the
 * panel is inset 12px like a live md popover.
 */
import { onBeforeUnmount, ref, watch } from 'vue'

export interface TimeOption {
  key: string
  label: string
}

const props = defineProps<{
  options: TimeOption[]
  modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [key: string] }>()

const trigger = ref<HTMLElement>()
const open = ref(false)
const panelStyle = ref<Record<string, string>>({})

function place() {
  const el = trigger.value
  if (!el) return
  const box = el.getBoundingClientRect()
  const column = (el.closest('.ion-page') ?? document.body).getBoundingClientRect()
  panelStyle.value = {
    top: `${box.bottom + 40}px`,
    left: `${column.left + 12}px`,
    width: `${column.width - 24}px`,
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') open.value = false
}

function toggle() {
  if (open.value) {
    open.value = false
    return
  }
  place()
  open.value = true
}

function pick(key: string) {
  if (key !== props.modelValue) emit('update:modelValue', key)
  open.value = false
}

watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  window[method]('resize', place)
  document[method]('keydown', onKeydown as EventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', place)
  document.removeEventListener('keydown', onKeydown as EventListener)
})
</script>

<template>
  <div
    id="time-popover-button"
    ref="trigger"
    class="time-filter"
    :class="{ open }"
    @click="toggle"
  >
    <div class="time">
      {{ props.options.find((option) => option.key === props.modelValue)?.label ?? '' }}
    </div>
    <svg class="caret" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"
        fill="currentColor"
      />
    </svg>

    <Teleport to="body">
      <Transition name="tf" :duration="{ enter: 300, leave: 150 }">
        <div v-if="open" class="tf-overlay">
          <div class="tf-backdrop" @click="open = false" />
          <div class="tf-panel" :style="panelStyle">
            <div class="tf-row">
              <div v-for="option in props.options" :key="option.key" class="tf-col">
                <div
                  class="tf-option"
                  :class="{ on: option.key === props.modelValue }"
                  @click="pick(option.key)"
                >
                  {{ option.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.time-filter {
  display: flex;
  height: 2rem;
  padding: 0 0.25rem 0 0.5rem;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(109, 120, 141);
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
  box-sizing: border-box;
}

.time {
  margin-right: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 2rem;
}

.caret {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: rgb(135, 146, 175);
  transition: transform 0.1s linear;
}

.time-filter.open .caret {
  transform: rotate(180deg);
}

.tf-overlay {
  position: fixed;
  inset: 0;
  z-index: 20010;
}

.tf-backdrop {
  position: absolute;
  inset: 0;
  background-color: #000;
  opacity: 0;
}

.tf-panel {
  position: absolute;
  overflow-y: auto;
  background-color: var(--color-bar-bg);
  border-radius: 4px;
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  /* Live md popover grows from the right edge (right → left). */
  transform-origin: 100% 0;
}

.tf-row {
  display: flex;
  padding: 6px 10px;
  flex-wrap: wrap;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-align: center;
  background-color: var(--color-bg-400);
}

/* Live ion-col is 25% but `.item` is a fixed 90px, so the fourth chip wraps. */
.tf-col {
  flex: 0 0 25%;
  width: 25%;
  max-width: 25%;
  padding: 5px;
  margin: 0 10px 0 0;
  box-sizing: border-box;
}

.tf-option {
  width: 90px;
  height: 2.5rem;
  padding: 0 0.25rem;
  border: 1px solid rgb(26, 35, 62);
  border-radius: 0.375rem;
  color: rgb(109, 120, 141);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 2.5rem;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  box-sizing: border-box;
}

.tf-option.on {
  border-width: 0;
  color: #fff;
  font-weight: 700;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
}

.tf-enter-from .tf-panel {
  opacity: 0.01;
  transform: scale(0.8);
}

.tf-enter-active .tf-panel {
  transition:
    opacity 150ms cubic-bezier(0.36, 0.66, 0.04, 1),
    transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
}

.tf-leave-active .tf-panel {
  transition: opacity 150ms ease;
}

.tf-leave-to .tf-panel {
  opacity: 0;
}
</style>
