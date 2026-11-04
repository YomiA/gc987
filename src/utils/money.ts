import { i18n, normalizeLocale, type AppLocale } from '../i18n'

/** Thousands and decimal marks for the language the UI is showing. */
const MARK: Record<AppLocale, { group: string; decimal: string }> = {
  'zh-CN': { group: ',', decimal: '.' },
  en: { group: ',', decimal: '.' },
  'pt-BR': { group: '.', decimal: ',' },
}

function marks() {
  return MARK[normalizeLocale(i18n.global.locale.value)] ?? MARK['pt-BR']
}

function groupDigits(whole: string, separator: string) {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

/**
 * Money from cents. 100000 cents is 1000, so Chinese and English print
 * "1,000.00" and Portuguese prints "1.000,00".
 */
export function formatAmount(cents: number): string {
  const { group, decimal } = marks()
  const value = Number.isFinite(cents) ? Math.round(cents) : 0
  const negative = value < 0
  const digits = Math.abs(value).toString().padStart(3, '0')
  const whole = groupDigits(digits.slice(0, -2), group)
  return `${negative ? '-' : ''}${whole}${decimal}${digits.slice(-2)}`
}

/** Whole amounts, such as the deposit range 10 - 50,000. */
export function formatGrouped(value: number): string {
  const { group } = marks()
  const rounded = Number.isFinite(value) ? Math.round(value) : 0
  const negative = rounded < 0
  return `${negative ? '-' : ''}${groupDigits(String(Math.abs(rounded)), group)}`
}
