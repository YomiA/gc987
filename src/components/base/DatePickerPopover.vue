<script setup lang="ts">
/**
 * The calendar the live site opens from a date field — an `ion-popover`
 * holding an `ion-datetime` in `date` presentation with Cancelar/Feito
 * buttons. Both the popover and the datetime run with
 * `--background: transparent`, so the page shows through the panel and only
 * the 0.32 backdrop and the md box-shadow separate it from the content.
 *
 * Picking a day only moves the highlight; the value is committed on "Feito".
 * Days outside `min`/`max` are dimmed and inert, which also disables the
 * month arrow pointing at them.
 */
import { computed, ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'
import { i18n } from '../../i18n'
import { wallClock } from '../../utils/timeZone'

const props = defineProps<{
  open: boolean
  /** YYYY-MM-DD */
  modelValue: string
  /** Latest selectable day, YYYY-MM-DD. Defaults to today. */
  max?: string
  /** Earliest selectable day, YYYY-MM-DD. Unbounded when absent. */
  min?: string
  /** The field the panel hangs off; the live popover is event-positioned. */
  anchor?: DOMRect | null
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'update:modelValue': [string]
}>()

const PANEL_WIDTH = 250
/** Ionic clamps md popovers 12px away from the viewport edges. */
const EDGE = 12

const intlLocale = computed(() => {
  const locale = i18n.global.locale.value
  return locale === 'en' ? 'en-US' : locale
})

const weekdays = computed(() => {
  const fmt = new Intl.DateTimeFormat(intlLocale.value, { weekday: 'short' })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + i)))
})

function parse(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  return { y, m: m - 1, d }
}

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

const today = computed(() => {
  const clock = wallClock()
  return { y: clock.year, m: clock.month - 1, d: clock.day }
})
const maxDate = computed(() => (props.max ? parse(props.max) : today.value))
const minDate = computed(() => (props.min ? parse(props.min) : null))

/** Sortable YYYYMMDD-ish stamp, so day and month limits compare as numbers. */
const stamp = ({ y, m, d }: { y: number; m: number; d: number }) => y * 10000 + m * 100 + d

const picked = ref(parse(props.modelValue))
const view = ref({ y: picked.value.y, m: picked.value.m })

watch(
  () => [props.open, props.modelValue] as const,
  ([open]) => {
    if (!open) return
    picked.value = parse(props.modelValue)
    view.value = { y: picked.value.y, m: picked.value.m }
  },
)

const monthLabel = computed(() =>
  new Intl.DateTimeFormat(intlLocale.value, { month: 'long', year: 'numeric' }).format(
    new Date(view.value.y, view.value.m, 1),
  ),
)

/** Leading blanks plus every day of the shown month. */
const cells = computed(() => {
  const first = new Date(view.value.y, view.value.m, 1)
  const days = new Date(view.value.y, view.value.m + 1, 0).getDate()
  const blanks = Array.from({ length: first.getDay() }, () => null)
  const maxStamp = stamp(maxDate.value)
  const minStamp = minDate.value ? stamp(minDate.value) : -Infinity
  return [
    ...blanks,
    ...Array.from({ length: days }, (_, i) => {
      const d = i + 1
      const own = stamp({ y: view.value.y, m: view.value.m, d })
      return { d, disabled: own > maxStamp || own < minStamp }
    }),
  ]
})

const canGoNext = computed(
  () => view.value.y * 100 + view.value.m < maxDate.value.y * 100 + maxDate.value.m,
)

const canGoPrev = computed(() => {
  const min = minDate.value
  return !min || view.value.y * 100 + view.value.m > min.y * 100 + min.m
})

const isPicked = (d: number) =>
  picked.value.y === view.value.y && picked.value.m === view.value.m && picked.value.d === d

/** Ionic tints the current day even when `max` has made it unselectable. */
const isToday = (d: number) =>
  view.value.y === today.value.y && view.value.m === today.value.m && d === today.value.d

const panelStyle = computed(() => {
  const rect = props.anchor
  if (!rect) return {}
  const rem = PANEL_WIDTH / 16
  const left = Math.min(
    Math.max(rect.left + rect.width / 2 - PANEL_WIDTH / 2, EDGE),
    window.innerWidth - PANEL_WIDTH - EDGE,
  )
  return { top: `${rect.bottom}px`, left: `${left}px`, width: `${rem}rem` }
})

function shift(step: number) {
  if (step > 0 ? !canGoNext.value : !canGoPrev.value) return
  const m = view.value.m + step
  view.value = { y: view.value.y + Math.floor(m / 12), m: ((m % 12) + 12) % 12 }
}

function close() {
  emit('update:open', false)
}

function confirm() {
  emit('update:modelValue', iso(picked.value.y, picked.value.m, picked.value.d))
  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dp">
      <div v-if="open" class="dp-root">
        <div class="dp-backdrop" @click="close" />

        <div class="dp-panel" :style="panelStyle">
          <div class="dp-header">
            <div class="dp-title-row">
              <button type="button" class="dp-title">
                <span class="dp-title-inner">
                  {{ tr(monthLabel) }}
                  <SvgIcon class="dp-caret" name="chevron-forward" />
                </span>
              </button>

              <div class="dp-nav">
                <button
                  type="button"
                  class="dp-nav-btn"
                  :class="{ off: !canGoPrev }"
                  @click="shift(-1)"
                >
                  <SvgIcon class="dp-chevron" name="chevron-back" />
                </button>
                <button
                  type="button"
                  class="dp-nav-btn"
                  :class="{ off: !canGoNext }"
                  @click="shift(1)"
                >
                  <SvgIcon class="dp-chevron" name="chevron-forward" />
                </button>
              </div>
            </div>

            <div class="dp-week">
              <span v-for="label in weekdays" :key="label">{{ tr(label) }}</span>
            </div>
          </div>

          <div class="dp-grid">
            <template v-for="(cell, index) in cells" :key="index">
              <span v-if="!cell" class="dp-blank" />
              <button
                v-else
                type="button"
                class="dp-day"
                :class="{ on: isPicked(cell.d), today: isToday(cell.d), off: cell.disabled }"
                :disabled="cell.disabled"
                @click="picked = { y: view.y, m: view.m, d: cell.d }"
              >
                {{ tr(cell.d) }}
              </button>
            </template>
          </div>

          <div class="dp-footer">
            <button type="button" class="dp-action" @click="close">{{ tr('Cancelar') }}</button>
            <button type="button" class="dp-action" @click="confirm">{{ tr('Feito') }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dp-root {
  position: fixed;
  inset: 0;
  z-index: 20000;
}

.dp-backdrop {
  position: absolute;
  inset: 0;
  background-color: rgb(0, 0, 0);
  opacity: 0.32;
}

/* --background is transparent on the live popover; only the shadow reads. */
.dp-panel {
  position: absolute;
  border-radius: 0.25rem;
  box-shadow:
    0 0.3125rem 0.3125rem -0.1875rem rgba(0, 0, 0, 0.2),
    0 0.5rem 0.625rem 0.0625rem rgba(0, 0, 0, 0.14),
    0 0.1875rem 0.875rem 0.125rem rgba(0, 0, 0, 0.12);
  color: var(--color-text-100);
}

/* The toggle hugs the top of the 56-tall row while the arrows sit at its
   bottom, which is how the live header staggers them. */
.dp-title-row {
  display: flex;
  height: 3.5rem;
  justify-content: space-between;
}

/* button.calendar-month-year-toggle: an inline-block that keeps its natural
   54 height at the top of the 56 row, so the arrows can sit lower than it. */
.dp-title {
  display: inline-block;
  flex: 1;
  min-width: 0;
  min-height: 2.75rem;
  padding: 0 1rem;
  align-self: flex-start;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: normal;
  color: rgb(22, 128, 220);
  text-align: start;
}

/* span#toggle-wrapper, whose 8 end margin is what keeps the caret clear of the
   button's padding when a long month name wraps to a second line. */
.dp-title-inner {
  display: inline-flex;
  margin: 0.625rem 0.5rem 0.625rem 0;
  align-items: center;
}

/* The live ion-icon pads its glyph 4 on the leading side, letterboxing it to
   14x14 inside an 18-wide box. */
.dp-caret {
  width: 1.125rem;
  height: 0.875rem;
  padding-left: 0.25rem;
}

.dp-nav {
  display: flex;
  width: 6rem;
  height: 3.5rem;
  align-items: flex-end;
}

.dp-nav-btn {
  display: flex;
  width: 3rem;
  height: 3rem;
  justify-content: center;
  align-items: center;
  color: rgb(22, 128, 220);
}

.dp-nav-btn.off {
  opacity: 0.5;
}

.dp-chevron {
  width: 1.5rem;
  height: 1.575rem;
}

.dp-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.5rem;
  color: rgb(179, 179, 179);
  text-align: center;
  text-transform: uppercase;
}

.dp-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 2.56875rem;
  padding: 0.5rem;
  justify-items: center;
  align-items: center;
}

.dp-day {
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 10rem;
  font-size: 0.875rem;
  color: var(--color-text-100);
}

.dp-day.today {
  color: rgb(22, 128, 220);
}

.dp-day.on {
  background-color: rgb(22, 128, 220);
  font-weight: 600;
  color: var(--color-text-100);
}

.dp-day.off {
  opacity: 0.4;
}

/* div.datetime-buttons, which is what draws the hairline over the actions.
   px: the live border is 0.5px, not a rem step. */
.dp-footer {
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  border-top: 0.5px solid rgb(51, 51, 51);
}

.dp-action {
  height: 2rem;
  margin: 0 0.125rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.0525rem;
  color: rgb(22, 128, 220);
  text-transform: uppercase;
}

/* Ionic fades the backdrop and the panel together. */
.dp-enter-active,
.dp-leave-active {
  transition: opacity 0.15s linear;
}

.dp-enter-from,
.dp-leave-to {
  opacity: 0;
}
</style>
