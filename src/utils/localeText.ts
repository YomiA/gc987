import { i18n, type AppLocale } from '../i18n'

/** Backend multilingual field, e.g. activityName: { zhCN, enUS, ptBR }. */
export type LocaleText =
  | string
  | Record<string, string | null | undefined>
  | null
  | undefined

const FIELD: Record<AppLocale, 'zhCN' | 'enUS' | 'ptBR'> = {
  'zh-CN': 'zhCN',
  en: 'enUS',
  'pt-BR': 'ptBR',
}

/** Backend key for the language the UI is showing. */
export function localeFieldKey(): 'zhCN' | 'enUS' | 'ptBR' {
  return FIELD[i18n.global.locale.value] ?? 'ptBR'
}

/**
 * Pick the string that matches the current UI language.
 * A plain string is returned as-is. An empty current language falls through
 * to Portuguese, then Chinese, then English, then the first filled value.
 */
export function pickLocaleText(value: LocaleText, fallback = ''): string {
  if (value == null || value === '') return fallback
  if (typeof value === 'string') return value

  const current = localeFieldKey()
  const order = [current, 'ptBR', 'zhCN', 'enUS']
  for (const key of order) {
    const text = value[key]
    if (text) return String(text)
  }
  const first = Object.values(value).find((text) => !!text)
  return first ? String(first) : fallback
}
