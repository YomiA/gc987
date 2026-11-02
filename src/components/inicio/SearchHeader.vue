<script setup lang="ts">
/**
 * Search page chrome: ios toolbar (back + Pesquisar) plus the md searchbar
 * row. Live `show-clear-button="never"`: the right ion-icon stays a submit
 * control. Click runs search; while the request is in flight the icon swaps
 * to ion-spinner name="bubbles" (28×28, right 1.25rem).
 */
import SvgIcon from '../base/SvgIcon.vue'

withDefaults(
  defineProps<{
    modelValue: string
    loading?: boolean
    title?: string
    placeholder?: string
    /** Category search uses white 0.6 placeholder, not the muted search page. */
    lightPlaceholder?: boolean
  }>(),
  {
    title: 'Pesquisar',
    placeholder: 'Buscar juegos',
    lightPlaceholder: false,
  },
)
const emit = defineEmits<{
  back: []
  search: []
  'update:modelValue': [value: string]
}>()

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <header class="search-header" :class="{ 'placeholder-light': lightPlaceholder }">
    <div class="toolbar">
      <button type="button" class="back" aria-label="Voltar" @click="emit('back')">
        <SvgIcon class="back-icon" name="report-back" />
      </button>
        <h1 class="toolbar-title"><span class="title-text">{{ title }}</span></h1>
    </div>

    <div class="search-toolbar">
      <div class="searchbar" role="search">
        <input
          class="search-input"
          type="search"
          name="game-search"
          aria-label="search text"
          :placeholder="placeholder"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          :value="modelValue"
          @input="onInput"
          @keydown.enter.prevent="emit('search')"
        />
        <span v-if="loading" class="search-spinner" aria-hidden="true">
          <i v-for="n in 9" :key="n" class="bubble" :style="{ '--i': n - 1 }" />
        </span>
        <button
          v-else
          type="button"
          class="search-btn"
          aria-label="search"
          @click="emit('search')"
        >
          <SvgIcon class="search-icon" name="searchbar-search" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.search-header {
  position: relative;
  z-index: 10;
  flex: 0 0 auto;
  background-color: var(--color-bar-bg);
}

/* ion-toolbar.ios: --background #101629, --min-height 3.125rem,
   --padding-start/end 4px, box-shadow rgba(0,0,0,0.1) 0 4px 28.4px. */
.toolbar {
  display: flex;
  position: relative;
  height: 3.125rem;
  min-height: 3.125rem;
  padding: 0 0.25rem;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg-400);
  box-shadow: rgba(0, 0, 0, 0.1) 0 0.25rem 1.775rem 0;
}

.back {
  display: flex;
  width: 2.375rem;
  height: 1.375rem;
  padding: 0.1875rem 0.25rem 0.1875rem 0.125rem;
  margin: 0.25rem 0.125rem;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
}

.back-icon {
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem;
  color: var(--color-text-100);
}

.toolbar-title {
  display: flex;
  position: absolute;
  inset: 0;
  padding: 0 5.625rem;
  align-items: center;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.875rem;
  color: var(--color-text-100);
  text-align: center;
  pointer-events: none;
}

.title-text {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* Second ion-toolbar.toolbar-search: 3.5rem, margin-top 6px, transparent. */
.search-toolbar {
  height: 3.5rem;
  margin-top: 0.375rem;
}

/* ion-searchbar: 8px transparent border. 12px sides sits between live 8px
   and the 16px inset that read too wide against the 10px tab track. */
.searchbar {
  display: flex;
  position: relative;
  height: 3.5rem;
  padding: 0.5rem 0.75rem;
  align-items: center;
}

.search-input {
  display: block;
  width: 100%;
  height: 2.5rem;
  min-height: 2.5rem;
  padding: 0.375rem 2.25rem 0.375rem 0.75rem;
  overflow: clip;
  font-family: Roboto, 'Helvetica Neue', sans-serif;
  font-size: 0.825rem;
  font-weight: 400;
  line-height: 0;
  color: var(--color-text-100);
  caret-color: rgb(17, 111, 205);
  background-color: var(--color-bg-400);
  border-radius: 0.3125rem;
  box-shadow:
    var(--divider) 0 0 0 1px,
    rgba(0, 0, 0, 0.14) 0 2px 2px 0,
    rgba(0, 0, 0, 0.2) 0 3px 1px -2px,
    rgba(0, 0, 0, 0.12) 0 1px 5px 0;
  outline: none;
  -webkit-font-smoothing: antialiased;
}

.search-input::placeholder {
  color: rgb(109, 120, 142);
  font-family: inherit;
  opacity: 0.6;
}

.placeholder-light .search-input::placeholder {
  color: rgb(255, 255, 255);
}

.search-input::-webkit-search-decoration,
.search-input::-webkit-search-cancel-button {
  appearance: none;
}

/* Live #searchbar ion-icon: absolute, z-index 10, right 1.25rem, font-size 1.25rem. */
.search-btn {
  display: flex;
  position: absolute;
  top: 1.125rem;
  right: 2rem;
  z-index: 10;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  align-items: center;
  justify-content: center;
  color: var(--color-text-100);
  background: transparent;
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: inherit;
}

/* Live #searchbar ion-spinner: 1.75rem, right 1.25rem, name="bubbles". */
.search-spinner {
  display: block;
  position: absolute;
  top: 0.875rem;
  right: 2rem;
  z-index: 10;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-primary-800);
  pointer-events: none;
}

.bubble {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0.25rem;
  height: 0.25rem;
  margin: -0.125rem;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0;
  transform: rotate(calc(var(--i) * 40deg)) translate(0.5625rem);
  animation: spinner-bubbles 1s linear infinite;
  animation-delay: calc(var(--i) * 1s / 9 - 1s);
}

@keyframes spinner-bubbles {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
