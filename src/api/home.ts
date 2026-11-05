import { request } from './http'

export interface LayoutBanner {
  picPath: string
  mediaType: number
  routePath: string
}

export interface LayoutShortcut {
  iconType: number
  showImg: string
  routePath: string
}

export interface ProductType {
  typeBasisId: number
  typeCode: string
  topIcon: string
  subIcon: string
  bgImg: string
  /**
   * 1 hot, 2 recent, 3 custom products, 4 custom vendor, 5 vendor list.
   * Types 1 and 2 are system rows: they stay in the list and only their order changes.
   */
  type: number
  showType: number
  isShowInTop: number
  /** Product ids for every type except 4. */
  typeProductIdList?: Array<number | string>
}

export interface LayoutData {
  /** Site clock, such as "UTC-3". Absent means the computer's local zone. */
  timeZone?: string
  layoutConfig?: { devModeEnabled?: number }
  productTypeList?: ProductType[]
  bannerList?: LayoutBanner[]
  popUpBannerList?: LayoutBanner[]
  adverBannerList?: LayoutBanner[]
  rightShortcutIconList?: LayoutShortcut[]
  leftShortcutIconList?: LayoutShortcut[]
  bottomShortcutIconList?: LayoutShortcut[]
}

export interface ProductPlatform {
  id: number
  platformName: string
}

export interface HomeProduct {
  id: number
  platformId: number
  category: number
  /** Backend sends a JSON string such as {"en-US":"..."}. */
  productName: string
}

export interface ProductData {
  productTypes?: ProductType[]
  productPlatforms?: ProductPlatform[]
  products?: HomeProduct[]
}

interface Envelope<T> {
  code?: number
  data?: T
}

function post<T>(path: string) {
  return request<Envelope<T>>(path, { method: 'POST', body: {} })
}

/** Banners, ads, and the rest of the home chrome. No login required. */
export function loadLayout() {
  return post<LayoutData>('/loadLayout')
}

/** Game catalog. No login required. */
export function loadProduct() {
  return post<ProductData>('/loadProduct')
}

/** Recent products. Login required. */
export function productHistoryRecord() {
  return post<unknown>('/productHistoryRecord')
}

/** Wallet balance. Login required. A 401 must not clear the session. */
export function walletBalance() {
  return request<Envelope<unknown>>('/walletBalance', {
    method: 'POST',
    body: {},
    keepSession: true,
  })
}

/** Collected product ids. Login required. Called when the home page opens. */
export function productCollectRecord() {
  return post<unknown>('/productCollectRecord')
}

function productIdBody(productId: number | string) {
  const text = String(productId)
  const value = /^\d{1,15}$/.test(text) ? Number(text) : productId
  return { productId: value }
}

/** Opens a game. `data` is the game link. */
export function enterProduct(productId: number | string) {
  return request<Envelope<string | { url?: string; link?: string }>>('/enterProduct', {
    method: 'POST',
    body: productIdBody(productId),
  })
}

/** The link returned by /enterProduct. A plain string, or `{ url | link }`. */
export function gameLinkOf(data: unknown): string {
  if (typeof data === 'string') return data.trim()
  if (data && typeof data === 'object') {
    const raw = data as { url?: unknown; link?: unknown }
    if (typeof raw.url === 'string' && raw.url.trim()) return raw.url.trim()
    if (typeof raw.link === 'string' && raw.link.trim()) return raw.link.trim()
  }
  return ''
}

/** Leaves the game opened by /enterProduct. No body. */
export function logoutTransfer() {
  return request<Envelope<unknown>>('/logoutTransfer', {
    method: 'POST',
    body: {},
  })
}

/** Collect one product. First click on the star. */
export function collectProduct(productId: number | string) {
  return request<Envelope<unknown>>('/collectProduct', {
    method: 'POST',
    body: productIdBody(productId),
  })
}

/** Remove one product from favorites. Second click on the same star. */
export function cancelCollectProduct(productId: number | string) {
  return request<Envelope<unknown>>('/cancelCollectProduct', {
    method: 'POST',
    body: productIdBody(productId),
  })
}

/** Pull product ids out of the collect-record payload. */
export function collectIdsOf(data: unknown): string[] {
  const source = unwrapCollectList(data)
  const seen = new Set<string>()
  const ids: string[] = []
  for (const item of source) {
    const raw =
      item && typeof item === 'object'
        ? ((item as { productId?: unknown; id?: unknown }).productId ??
          (item as { id?: unknown }).id)
        : item
    if (raw == null || raw === '') continue
    const id = String(raw)
    if (seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

function unwrapCollectList(data: unknown): unknown[] {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  const record = data as Record<string, unknown>
  for (const key of ['list', 'records', 'ids', 'productIds', 'productIdList']) {
    if (Array.isArray(record[key])) return record[key]
  }
  return []
}
