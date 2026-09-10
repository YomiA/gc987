/**
 * The date presets of the live record filters, in the order the popover lists
 * them. Shared because every history-style page on the original opens the same
 * four options.
 */
export interface DateRange {
  key: string
  label: string
  /** Days back the range covers; 0 is today, 1 is yesterday only. */
  days: number
}

export const dateRanges: DateRange[] = [
  { key: 'today', label: 'Hoje', days: 0 },
  { key: 'yesterday', label: 'Ontem', days: 1 },
  { key: 'last7', label: 'Últimos 7 Dias', days: 7 },
  { key: 'last30', label: 'Últimos 30 Dias', days: 30 },
]
