import type { LayoutBanner } from '../api/home'

/** Popups already shown since this page load. A refresh clears it. */
const shown = new Set<string>()

function keyOf(item: LayoutBanner, index: number) {
  return String(item.id ?? `${index}:${item.picPath}`)
}

/**
 * The popUpBannerList entries the homepage should open now.
 * Without `popUpRule` an entry shows once per page load.
 * `popUpPosition` other than 0 belongs to another page.
 * `popUpTimes` 2 shows on every homepage visit.
 */
export function pickHomePopups(list: LayoutBanner[] | undefined): LayoutBanner[] {
  const items = (list ?? [])
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.picPath)
    .sort((a, b) => (a.item.sort ?? 0) - (b.item.sort ?? 0))
  return items
    .filter(({ item, index }) => {
      const rule = item.popUpRule
      if (rule && Number(rule.popUpPosition ?? 0) !== 0) return false
      if (rule && Number(rule.popUpTimes ?? 1) === 2) return true
      return !shown.has(keyOf(item, index))
    })
    .map(({ item, index }) => {
      shown.add(keyOf(item, index))
      return item
    })
}

export function isClosablePopup(item: LayoutBanner | undefined) {
  return Number(item?.popUpRule?.closeRule ?? 1) !== 2
}
