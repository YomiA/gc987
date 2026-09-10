<script setup lang="ts">
/**
 * The filter pill + popover of /user/report.
 *
 * It is the same idea as src/components/base/DropdownSelect.vue (the /main/promo
 * date filter) but a different component on the live site, and almost every
 * number differs: the panel spans the whole column instead of the filter row,
 * its options are 2.5rem tall on a #101629 row, and the borders/caret use
 * `--color-text-gray-200` rather than white at 40%. DropdownSelect teleports its
 * panel to the body, so those values cannot be overridden from a parent either;
 * hence a page-local component instead of restyling the shared one.
 *
 * Values come off the live pill/`ion-popover` pair at 390x844x3 — see
 * docs/research/gc987-com/user-report/REPORT_PAGE.spec.md.
 */
import { onBeforeUnmount, ref, watch } from 'vue'
import type { ReportOption } from '../../api/report'

const props = defineProps<{
  options: ReportOption[]
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
  // The live popover hard-sets `--width: 390px` and lands at x=0, i.e. it spans
  // the app column rather than the pill or the filter row.
  const column = (el.closest('.ion-page') ?? document.body).getBoundingClientRect()
  panelStyle.value = {
    top: `${box.bottom}px`,
    left: `${column.left}px`,
    width: `${column.width}px`,
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
  <div ref="trigger" class="rs-trigger" :class="{ open }" @click="toggle">
    <div class="rs-label">
      {{ props.options.find((option) => option.key === props.modelValue)?.label ?? '' }}
    </div>

    <!-- ionicons caret-down, flipped by the `on` class while the panel is up. -->
    <svg class="rs-caret" viewBox="0 0 512 512" aria-hidden="true">
      <path
        d="M98 190.06l139.78 163.12a24 24 0 0036.44 0L414 190.06c13.34-15.57 2.28-39.62-18.22-39.62h-279.6c-20.5 0-31.56 24.05-18.18 39.62z"
        fill="currentColor"
      />
    </svg>

    <!-- Nested like the live ion-popover, which is declared inside the pill and
         teleported out of it, so this component keeps a single root element. -->
    <Teleport to="body">
      <Transition name="rs" :duration="{ enter: 300, leave: 150 }">
        <div v-if="open" class="rs-overlay">
          <div class="rs-backdrop" @click="open = false" />
          <div class="rs-panel" :style="panelStyle">
            <div class="rs-row">
              <div v-for="option in props.options" :key="option.key" class="rs-col">
                <p
                  class="rs-option"
                  :class="{ on: option.key === props.modelValue }"
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
/* div.filter: flex row, p-1 pl-2, .0625rem border, rounded-[10px]. */
.rs-trigger {
  display: flex;
  padding: 0.25rem 0.25rem 0.25rem 0.5rem;
  justify-content: space-between;
  align-items: center;
  border: 0.0625rem solid rgb(109, 120, 141);
  /* px: a `rounded-[10px]` literal on the live pill, not a rem step. */
  border-radius: 10px;
  color: #fff;
}

.rs-trigger.open {
  border-color: rgb(255, 255, 255);
}

/* .typeName */
.rs-label {
  display: flex;
  margin-right: 0.5rem;
  align-items: center;
  white-space: nowrap;
}

/* ion-icon.report-select-icon */
.rs-caret {
  width: 1rem;
  height: 1rem;
  flex: 0 0 auto;
  color: rgb(109, 120, 141);
  transition: transform 0.1s linear;
}

.rs-trigger.open .rs-caret {
  transform: rotate(180deg);
}

.rs-overlay {
  position: fixed;
  inset: 0;
  /* Ionic's overlay stack, where the live popover lands. */
  z-index: 20047;
}

.rs-backdrop {
  position: absolute;
  inset: 0;
  /* --backdrop-opacity is 0 here, so this only exists to dismiss on tap. */
  background-color: #000;
  opacity: 0;
}

/* .popover-content, positioned from the pill and column boxes at open time. */
.rs-panel {
  position: absolute;
  overflow-y: auto;
  background-color: var(--color-bar-bg);
  /* px: Ionic's md --border-radius and elevation-8 shadow. */
  border-radius: 4px;
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  transform-origin: 0 0;
}

/* ion-row: fills the panel, so only its 4px corners show the panel behind it. */
.rs-row {
  display: flex;
  padding: 0.375rem 0.625rem;
  flex-wrap: wrap;
  font-size: 0.75rem;
  line-height: 1.125rem;
  text-align: center;
  background-color: var(--color-bg-400);
}

/* ion-col.select-col */
.rs-col {
  flex: 0 0 25%;
  width: 25%;
  max-width: 25%;
  padding: 0 0.3125rem 0.3125rem 0;
  line-height: 0.75rem;
}

/* The row's last column drops its gutter so the option reaches the content
   edge; the live rule is a :nth-child(4), :nth-child(4n) pair. */
.rs-col:nth-child(4n) {
  padding: 0 0 0.3125rem;
}

.rs-option {
  display: flex;
  height: 2.5rem;
  padding: 0 0.25rem;
  justify-content: center;
  align-items: center;
  border: 0.0625rem solid rgb(109, 120, 141);
  border-radius: 0.375rem;
  color: rgb(109, 120, 141);
}

.rs-option.on {
  /* The checked option drops the border rather than hiding it, so its gradient
     spans the full 40px box exactly as on the live page. */
  border-width: 0;
  color: #fff;
  background-image: linear-gradient(0deg, rgb(1, 103, 202) 0%, rgb(56, 168, 250) 100%);
}

.rs-enter-from .rs-panel {
  opacity: 0.01;
  transform: scale(0.8);
}

.rs-enter-active .rs-panel {
  transition:
    opacity 150ms cubic-bezier(0.36, 0.66, 0.04, 1),
    transform 300ms cubic-bezier(0.36, 0.66, 0.04, 1);
}

.rs-leave-active .rs-panel {
  transition: opacity 150ms ease;
}

.rs-leave-to .rs-panel {
  opacity: 0;
}
</style>
