<script setup lang="ts">
/**
 * 150×36 `.select-box` on /withdrawSubView Auditoria.
 * Live `ion-popover` paints `ion-backdrop` at --backdrop-opacity 0.32 over
 * the 390 column. Tap the dim to dismiss.
 */
import { onBeforeUnmount, ref, watch } from 'vue'
import SvgIcon from '../base/SvgIcon.vue'

export interface AuditOption {
  key: string
  label: string
}

const props = defineProps<{
  options: AuditOption[]
  modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [key: string] }>()

const field = ref<HTMLElement>()
const open = ref(false)
const leaving = ref(false)
const panelStyle = ref<Record<string, string>>({})
const overlayStyle = ref<Record<string, string>>({})
let leaveTimer: ReturnType<typeof window.setTimeout> | undefined

const label = () => props.options.find((o) => o.key === props.modelValue)?.label ?? ''

function place() {
  const el = field.value
  if (!el) return
  const box = el.getBoundingClientRect()
  const column = (el.closest('.ion-page') ?? document.body).getBoundingClientRect()
  overlayStyle.value = {
    top: `${column.top}px`,
    left: `${column.left}px`,
    width: `${column.width}px`,
    height: `${column.height}px`,
  }
  panelStyle.value = {
    top: `${box.bottom}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

function toggle() {
  if (open.value) {
    close()
    return
  }
  window.clearTimeout(leaveTimer)
  leaving.value = false
  place()
  open.value = true
}

function close() {
  if (!open.value || leaving.value) return
  leaving.value = true
  window.clearTimeout(leaveTimer)
  leaveTimer = window.setTimeout(() => {
    open.value = false
    leaving.value = false
    leaveTimer = undefined
  }, 150)
}

function pick(key: string) {
  if (key !== props.modelValue) emit('update:modelValue', key)
  close()
}

watch(open, (isOpen) => {
  const method = isOpen ? 'addEventListener' : 'removeEventListener'
  window[method]('resize', place)
  document[method]('keydown', onKeydown as EventListener)
})

onBeforeUnmount(() => {
  window.clearTimeout(leaveTimer)
  window.removeEventListener('resize', place)
  document.removeEventListener('keydown', onKeydown as EventListener)
})
</script>

<template>
  <div class="audit-select">
    <div id="click-trigger" ref="field" class="select-box" @click="toggle">
      <div class="box"><p>{{ label() }}</p></div>
      <SvgIcon class="arrow" :class="{ up: open && !leaving }" name="chevron-down" />
    </div>

    <Teleport to="body">
      <div
        v-if="open"
        class="as-overlay"
        :class="{ leaving }"
        :style="overlayStyle"
        @click="close"
      >
        <div class="as-backdrop" />
        <ul class="select-list" :style="panelStyle" @click.stop>
          <li
            v-for="option in props.options"
            :key="option.key"
            :class="{ active: option.key === props.modelValue }"
            @click="pick(option.key)"
          >
            <p>{{ option.label }}</p>
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.audit-select {
  position: relative;
  flex: 0 0 auto;
}

.select-box {
  display: flex;
  width: 150px;
  height: 2.25rem;
  padding: 0.4375rem;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  border: 1px solid rgb(26, 35, 62);
  border-radius: 4px;
  background-color: var(--color-bg-400);
  font-size: 0.875rem;
  line-height: 2.25rem;
  cursor: pointer;
}

.box {
  height: 2.25rem;
  font-size: 0.875rem;
  line-height: 2.25rem;
  color: #fff;
}

.box p {
  display: inline-block;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 0.875rem;
  vertical-align: middle;
}

.arrow {
  width: 1rem;
  height: 1rem;
  color: #fff;
  transition: transform 0.2s;
}

.arrow.up {
  transform: rotate(180deg);
}

.as-overlay {
  position: fixed;
  z-index: 20010;
  pointer-events: auto;
}

.as-backdrop {
  position: absolute;
  inset: 0;
  background-color: #000;
  opacity: 0.32;
  pointer-events: auto;
  animation: as-bd-in 150ms cubic-bezier(0.36, 0.66, 0.04, 1) both;
}

.select-list {
  position: fixed;
  z-index: 1;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  background-color: var(--color-bg-400);
  border-radius: 4px;
  box-shadow:
    0 5px 5px -3px rgba(0, 0, 0, 0.2),
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12);
  transform-origin: 0 0;
  animation:
    as-list-fade 150ms cubic-bezier(0.36, 0.66, 0.04, 1) both,
    as-list-scale 300ms cubic-bezier(0.36, 0.66, 0.04, 1) both;
}

.as-overlay.leaving .as-backdrop {
  animation: as-bd-out 150ms ease both;
}

.as-overlay.leaving .select-list {
  animation: as-list-out 150ms ease both;
}

.select-list li {
  height: 2.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 2.25rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}

.select-list li p {
  display: inline-block;
  margin: 0;
  font-size: 0.75rem;
  font-weight: inherit;
  line-height: 0.75rem;
  vertical-align: middle;
}

.select-list li.active {
  font-weight: 700;
  color: #fff;
  background-color: rgb(25, 30, 45);
}

@keyframes as-bd-in {
  from {
    opacity: 0.01;
  }
  to {
    opacity: 0.32;
  }
}

@keyframes as-bd-out {
  from {
    opacity: 0.32;
  }
  to {
    opacity: 0;
  }
}

@keyframes as-list-fade {
  from {
    opacity: 0.01;
  }
  to {
    opacity: 1;
  }
}

@keyframes as-list-scale {
  from {
    transform: scale(0.8);
  }
  to {
    transform: scale(1);
  }
}

@keyframes as-list-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
