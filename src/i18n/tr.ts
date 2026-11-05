import { i18n } from './index'
import { PHRASES } from './phrases'

/**
 * Translate a Portuguese UI string for the active locale.
 * pt-BR keeps the original. Unknown text (game titles, brands, amounts, ids)
 * is returned unchanged, so templates can wrap every label.
 */
export function tr(value: unknown): string {
  const raw = value == null ? '' : String(value)
  const key = raw.replace(/\s+/g, ' ').trim()
  if (!key) return raw
  const locale = i18n.global.locale.value
  if (locale === 'pt-BR') return raw
  const hit = PHRASES[key] ?? pattern(key)
  if (!hit) return raw
  return locale === 'zh-CN' ? hit[1] : hit[0]
}

function pattern(key: string): readonly [string, string] | undefined {
  const rules: Array<[RegExp, (n: string) => readonly [string, string]]> = [
    [/^Apostas válidas (.+)$/, (n) => [`Valid bets ${n}`, `有效投注 ${n}`]],
    [/^Desempenho total (.+)$/, (n) => [`Total performance ${n}`, `总业绩 ${n}`]],
    [/^Desempenho direto (.+)$/, (n) => [`Direct performance ${n}`, `直属业绩 ${n}`]],
    [/^Outro desempenho (.+)$/, (n) => [`Other performance ${n}`, `其他业绩 ${n}`]],
  ]
  for (const [re, build] of rules) {
    const match = re.exec(key)
    if (match) return build(match[1])
  }
  return undefined
}

declare module 'vue' {
  interface ComponentCustomProperties {
    tr: (value: unknown) => string
  }
}
