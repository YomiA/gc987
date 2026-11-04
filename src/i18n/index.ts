import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'
import en from '../locales/en.json'
import ptBR from '../locales/pt-BR.json'

export const STORAGE_KEY = 'app-locale'
const SUPPORTED = ['zh-CN', 'en', 'pt-BR'] as const
export type AppLocale = (typeof SUPPORTED)[number]

export function normalizeLocale(value: string): AppLocale {
  const low = value.toLowerCase()
  if (low.startsWith('zh')) return 'zh-CN'
  if (low.startsWith('en')) return 'en'
  if (low.startsWith('pt')) return 'pt-BR'
  return 'pt-BR'
}

function savedLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || ''
    if (saved) return normalizeLocale(saved)
  } catch {
    /* ignore */
  }
  return 'pt-BR'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: savedLocale(),
  fallbackLocale: 'pt-BR',
  messages: {
    'zh-CN': zhCN,
    en,
    'pt-BR': ptBR,
  },
})

/** Header values agreed with the API: en-US, pt-BR, zh-CN. */
const ACCEPT_LANGUAGE: Record<AppLocale, string> = {
  'zh-CN': 'zh-CN',
  en: 'en-US',
  'pt-BR': 'pt-BR',
}

export function acceptLanguage(): string {
  const locale = normalizeLocale(
    (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) ||
      i18n.global.locale.value ||
      'pt-BR',
  )
  return ACCEPT_LANGUAGE[locale]
}

export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    /* ignore */
  }
  document.documentElement.lang = locale
}

document.documentElement.lang = savedLocale()
