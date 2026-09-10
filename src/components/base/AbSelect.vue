<script setup lang="ts">
/**
 * The live site's `ab-select` — a filled 120-wide field whose options drop
 * straight under it, one per row. It is a different widget from the bordered
 * pill in DropdownSelect.vue (the /main/promo date filter): here the panel has
 * no background of its own, so only the md elevation shadow and the 0.32
 * backdrop separate it from the page, and just the selected row is tinted.
 *
 * Numbers off the live pair at 390x844x3 (Convidar -> Comissão):
 *
 *   field    min-height 1.7625rem, min-width 7.5rem, padding 0 .75rem,
 *            background --color-bg-300, radius .375rem, label 14px/1.4
 *   caret    16px --ep-color-text-placeholder, rotate(180deg) while open,
 *            transition transform .2s
 *   panel    --width = the field, placed at its bottom-left, --border-radius 4,
 *            md elevation shadow, --background transparent, --max-height 90%
 *   options  2.25rem each, 12px/150% bold; selected rgb(59,65,77) on
 *            --color-primary-800, the rest --color-text-gray-300
 *
 * The enter/leave pair is Ionic's md popover animation, the same one measured
 * for DropdownSelect: the content scales 0.8 -> 1 out of its top-left corner
 * over 300ms while opacity runs 150ms, and leaving only fades.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'

export interface AbSelectOption {
  key: string
  label: string
}

const props = defineProps<{
  options: AbSelectOption[]
  modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [key: string] }>()

const field = ref<HTMLElement>()
const open = ref(false)
const panelStyle = ref<Record<string, string>>({})

/** Ionic keeps md popovers 12px away from the viewport edges. */
const EDGE = 12

const label = computed(() => props.options.find((o) => o.key === props.modelValue)?.label ?? '')

function place() {
  const el = field.value
  if (!el) return
  const box = el.getBoundingClientRect()
  panelStyle.value = {
    top: `${box.bottom}px`,
    left: `${Math.min(box.left, window.innerWidth - box.width - EDGE)}px`,
    width: `${box.width}px`,
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
  <div class="ab-select">
    <div ref="field" class="ab-field" @click="toggle">
      <span class="ab-label">{{ label }}</span>
      <SvgIcon class="ab-caret" :class="{ up: open }" name="chevron-down" />
    </div>

    <!-- The live ion-popover is declared inside the field and teleported out,
         which keeps this component single-rooted. -->
    <Teleport to="body">
      <Transition name="ab" :duration="{ enter: 300, leave: 150 }">
        <div v-if="open" class="ab-overlay">
          <div class="ab-backdrop" @click="open = false" />
          <div class="ab-panel" :style="panelStyle">
            <p
              v-for="option in options"
              :key="option.key"
              class="ab-option"
              :class="{ on: option.key === modelValue }"
              @click="pick(option.key)"
            >
              {{ option.label }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ab-select {
  position: relative;
}

.ab-field {
  display: flex;
  min-width: 7.5rem;
  min-height: 1.7625rem;
  padding: 0 0.75rem;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(9, 15, 31);
  border-radius: 0.375rem;
  transition: 0.2s;
}

.ab-label {
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.4;
  color: rgb(155, 167, 190);
  text-align: left;
}

.ab-caret {
  width: 1rem;
  height: 1rem;
  color: rgb(168, 171, 178);
  transition: transform 0.2s;
}

.ab-caret.up {
  transform: rotate(180deg);
}

/* The popover host: full-viewport, with the dimming backdrop under the panel. */
.ab-overlay {
  position: fixed;
  inset: 0;
  /* Ionic's overlay stack, where the live popover lands. */
  z-index: 20068;
}

.ab-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgb(0, 0, 0);
  opacity: 0.32;
}

/* .popover-content — no background of its own on the live page. */
.ab-panel {
  position: absolute;
  max-height: 90%;
  overflow: auto;
  /* px: Ionic's md --border-radius and elevation-8 shadow. */
  border-radius: 4px;
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  transform-origin: 0 0;
}

.ab-option {
  display: flex;
  height: 2.25rem;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 150%;
  color: rgb(155, 167, 190);
  text-align: center;
  transition: 0.2s;
}

.ab-option.on {
  background-color: rgb(59, 65, 77);
  color: rgb(22, 128, 220);
}

.ab-enter-from .ab-panel {
  opacity: 0.01;
  transform: scale(0.8);
}

.ab-enter-active .ab-panel {
  transition:
    opacity 150ms cubic-bezier(0.36, 0.66, 0.04, 1),
    transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
}

.ab-enter-from .ab-backdrop {
  opacity: 0;
}

.ab-enter-active .ab-backdrop,
.ab-leave-active .ab-backdrop {
  transition: opacity 150ms linear;
}

.ab-leave-active .ab-panel {
  transition: opacity 150ms ease;
}

.ab-leave-to .ab-panel,
.ab-leave-to .ab-backdrop {
  opacity: 0;
}
</style>
