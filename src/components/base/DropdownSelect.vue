<script setup lang="ts">
/**
 * The pill-and-panel select of the live pages (first seen as the "Hoje" date
 * filter on /main/promo -> Histórico).
 *
 * On the original this is a bordered div plus an `ion-popover mode="md"`
 * teleported to the body, so all the numbers below come off that pair at
 * 390x844x3:
 *
 *   trigger  border 1px rgba(255,255,255,.4) closed / #fff open, radius 10px,
 *            padding 4px 4px 4px 8px, caret 16px with transform .1s linear
 *   panel    --width = the row it sits in (360px), placed at the row's left and
 *            the trigger's bottom (15px / 86px), --background #101629,
 *            --border-radius 4px, md elevation shadow, --backdrop-opacity 0
 *            (invisible but still dismisses on tap)
 *   options  4 per row at 25%, ion-col padding 5px, p is h-9 px-1 rounded-md
 *            with 1px #2a324e when off and the blue gradient when on
 *
 * Both animations are Ionic's md popover ones, read off the Web Animations
 * calls it makes: enter runs 300ms cubic-bezier(.36,.66,.04,1) with the content
 * scaling 0.8 -> 1 from its top-left corner while the wrapper fades in over
 * 150ms; leave only fades, 150ms ease.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'

export interface DropdownOption {
  key: string
  label: string
}

const props = withDefaults(
  defineProps<{
    options: DropdownOption[]
    modelValue: string
    /** Options per panel row. The live date filter lays out four ion-cols. */
    columns?: number
    /**
     * Element whose box the panel spans. The live popover takes the width and
     * left edge of the filter row rather than of the pill, which is what this
     * defaults to.
     */
    anchor?: HTMLElement | null
  }>(),
  { columns: 4, anchor: null },
)

const emit = defineEmits<{ 'update:modelValue': [key: string] }>()

const trigger = ref<HTMLElement>()
const open = ref(false)
const panelStyle = ref<Record<string, string>>({})

const triggerLabel = computed(
  () => props.options.find((o) => o.key === props.modelValue)?.label ?? '',
)

const colStyle = computed(() => {
  const basis = `${100 / props.columns}%`
  return { flex: `0 0 ${basis}`, width: basis, maxWidth: basis }
})

function place() {
  const el = trigger.value
  if (!el) return
  const box = el.getBoundingClientRect()
  const row = (props.anchor ?? el.parentElement ?? el).getBoundingClientRect()
  panelStyle.value = {
    top: `${box.bottom}px`,
    left: `${row.left}px`,
    width: `${row.width}px`,
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
  <div ref="trigger" class="ds-trigger" :class="{ open }" @click="toggle">
    <div class="ds-label">{{ triggerLabel }}</div>
    <!-- ionicons caret-down, flipped while the panel is up. -->
    <svg class="ds-caret" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"
        fill="currentColor"
      />
    </svg>

    <!-- Nested exactly like the live ion-popover, which is declared inside the
         pill and teleported out of it, so this component keeps a single root
         and a caller's class still lands on the trigger. -->
    <Teleport to="body">
      <Transition name="ds" :duration="{ enter: 300, leave: 150 }">
        <div v-if="open" class="ds-overlay">
          <div class="ds-backdrop" @click="open = false" />
          <div class="ds-panel" :style="panelStyle">
            <div class="ds-row">
              <div v-for="option in options" :key="option.key" class="ds-col" :style="colStyle">
                <p
                  class="ds-option"
                  :class="{ on: option.key === modelValue }"
                  @click="pick(option.key)"
                >
                  {{ option.label }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.ds-trigger {
  display: flex;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.4);
  /* px: a `rounded-[10px]` literal on the live pill, not a rem step. */
  border-radius: 10px;
}

.ds-trigger.open {
  border-color: #fff;
}

.ds-label {
  display: flex;
  margin-right: 0.5rem;
  align-items: center;
  color: #fff;
}

.ds-caret {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: rgba(255, 255, 255, 0.4);
  transition: transform 0.1s linear;
}

.ds-trigger.open .ds-caret {
  transform: rotate(180deg);
}

/* The popover host: full-viewport and click-catching, with the invisible
   backdrop under the panel. */
.ds-overlay {
  position: fixed;
  inset: 0;
  /* Ionic's overlay stack, where the live popover lands. */
  z-index: 20047;
}

.ds-backdrop {
  position: absolute;
  inset: 0;
  /* --backdrop-opacity is 0 here, so this only exists to dismiss on tap. */
  background-color: #000;
  opacity: 0;
}

/* .popover-content, positioned from the trigger/row boxes at open time. */
.ds-panel {
  position: absolute;
  overflow: auto;
  background-color: var(--color-bg-400);
  /* px: Ionic's md --border-radius and elevation-8 shadow. */
  border-radius: 4px;
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  transform-origin: 0 0;
}

/* ion-row.px-3.py-1.5.text-xs.text-center */
.ds-row {
  display: flex;
  padding: 0.375rem 0.75rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  line-height: 1rem;
  text-align: center;
}

.ds-col {
  padding: 0.3125rem;
}

.ds-option {
  display: flex;
  height: 2.25rem;
  padding: 0 0.25rem;
  justify-content: center;
  align-items: center;
  /* --color-border-input-basic on the live page. */
  border: 1px solid rgb(42, 50, 78);
  border-radius: 0.375rem;
  color: rgba(255, 255, 255, 0.4);
}

.ds-option.on {
  /* The checked option drops the border rather than hiding it, so its gradient
     spans the full 36px box exactly as on the live page. */
  border-width: 0;
  color: #fff;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
}

.ds-enter-from .ds-panel {
  opacity: 0.01;
  transform: scale(0.8);
}

.ds-enter-active .ds-panel {
  transition:
    opacity 150ms cubic-bezier(0.36, 0.66, 0.04, 1),
    transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
}

.ds-leave-active .ds-panel {
  transition: opacity 150ms ease;
}

.ds-leave-to .ds-panel {
  opacity: 0;
}
</style>
