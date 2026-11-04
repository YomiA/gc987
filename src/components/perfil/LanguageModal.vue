<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale, type AppLocale } from '../../i18n'

defineEmits<{ close: [] }>()

const { t, locale } = useI18n()

const choices: { code: AppLocale; label: string }[] = [
  { code: 'pt-BR', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '中文' },
]

function choose(code: AppLocale) {
  setLocale(code)
}
</script>

<template>
  <div class="overlay" @click="$emit('close')">
    <div class="panel" role="dialog" :aria-label="t('perfil.langTitle')" @click.stop>
      <div class="title">{{ t('perfil.langTitle') }}</div>
      <button
        v-for="item in choices"
        :key="item.code"
        type="button"
        class="choice"
        :class="{ on: locale === item.code }"
        @click="choose(item.code)"
      >
        <span>{{ item.label }}</span>
        <span v-if="locale === item.code" class="mark" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  display: flex;
  position: absolute;
  inset: 0;
  z-index: 20018;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}

.panel {
  width: 21.625rem;
  padding: 1.0625rem 0.875rem 0.5rem;
  border-radius: 0.625rem;
  background-color: #2d323d;
}

.title {
  margin: 0 0 0.75rem;
  font-size: 1.125rem;
  font-weight: 700;
  line-height: 1.6875rem;
  color: var(--color-text-100);
  text-align: center;
}

.choice {
  display: flex;
  width: 100%;
  height: 2.75rem;
  margin: 0 0 0.5rem;
  padding: 0 0.75rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--color-text-100);
  background: transparent;
  border: 0;
  border-radius: 0.375rem;
}

.choice.on {
  background: rgba(255, 255, 255, 0.08);
}

.mark {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--more-link);
}
</style>
