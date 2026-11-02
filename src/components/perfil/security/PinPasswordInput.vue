<script setup lang="ts">
/**
 * Live PasswordInput (`hi`): 6× 44px cells, hidden numeric input over the
 * row, dot when filled, 1px blink cursor on the next empty cell.
 */
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  autofocus?: boolean
}>()

const emit = defineEmits<{
  input: [value: string]
}>()

const native = ref<HTMLInputElement | null>(null)
const value = ref('')
const caret = ref(-1)

const cells = computed(() => {
  const next: (string | null)[] = Array(6).fill(null)
  value.value.split('').forEach((ch, i) => {
    next[i] = ch
  })
  return next
})

function sync(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 6)
  value.value = digits
  caret.value = digits.length
  emit('input', digits)
}

function onFocus() {
  caret.value = value.value.length
}

function onBlur() {
  caret.value = -1
}

onMounted(() => {
  if (!props.autofocus) return
  window.setTimeout(() => native.value?.focus(), 500)
})
</script>

<template>
  <div class="grid-password">
    <div
      v-for="(ch, i) in cells"
      :key="i"
      class="grid-item"
      :class="{ 'grid-item-focus': caret === i }"
    >
      <div v-if="ch !== null" class="dot" />
      <div v-else-if="caret === i" class="cursor" />
    </div>
    <input
      ref="native"
      class="hidden-input"
      type="text"
      inputmode="numeric"
      maxlength="6"
      autocomplete="one-time-code"
      :value="value"
      @input="sync(($event.target as HTMLInputElement).value)"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>

<style scoped>
.grid-password {
  display: flex;
  position: relative;
  width: 100%;
  justify-content: space-between;
  padding: 0;
  border: 1px solid transparent;
}

.hidden-input {
  position: absolute;
  inset: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
  caret-color: transparent;
  -webkit-text-fill-color: transparent;
  color: transparent;
  background: transparent;
  border: 0;
  outline: none;
}

.grid-item {
  display: flex;
  position: relative;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  background-color: #1a223a;
  border-radius: 4px;
  box-sizing: border-box;
}

.grid-item-focus {
  border: 1px solid #0167ca;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: var(--color-text-100);
  border-radius: 50%;
}

.cursor {
  position: absolute;
  width: 1px;
  height: 1rem;
  background-color: var(--color-text-100);
  animation: pin-blink 1s ease infinite;
}

@keyframes pin-blink {
  0% {
    opacity: 1;
  }
  49% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}
</style>
