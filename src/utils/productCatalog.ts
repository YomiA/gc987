import type { Game, GameBlock, ProviderTab } from '../api/mock'
import type { HomeProduct, ProductPlatform, ProductType } from '../api/home'
import { assetUrl } from './assetUrl'
import { pickLocaleText } from './localeText'

const BLANK =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

function idKey(value: unknown) {
  return String(value ?? '')
}

/** Product names arrive as {"en-US":"..."} or a locale object. */
function productTitle(raw: unknown): string {
  if (raw && typeof raw === 'object') return pickLocaleText(raw as Record<string, string>)
  const text = String(raw ?? '').trim()
  if (!text.startsWith('{')) return pickLocaleText(text, text)
  try {
    const parsed = JSON.parse(text) as Record<string, string>
    const normalized: Record<string, string> = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (value == null || value === '') continue
      normalized[key.replace(/-/g, '')] = String(value)
    }
    return pickLocaleText(normalized, text)
  } catch {
    return text
  }
}

function productImage(product: HomeProduct): string {
  const extra = product as HomeProduct & Record<string, unknown>
  for (const key of ['picPath', 'productImg', 'img', 'icon', 'image']) {
    const value = extra[key]
    if (typeof value === 'string' && value.trim()) return assetUrl(value)
  }
  return BLANK
}

function listedIds(type: ProductType): string[] {
  const raw = type.typeProductIdList
  if (!Array.isArray(raw)) return []
  return raw.map(idKey).filter(Boolean)
}

/**
 * type 4: typeBasisId matches a productPlatforms id, then products with that platformId.
 * every other type: products whose id is in typeProductIdList, in that list's order.
 */
export function productsForType(
  type: ProductType,
  products: HomeProduct[],
  platforms: ProductPlatform[],
): HomeProduct[] {
  if (Number(type.type) === 4) {
    const basis = idKey(type.typeBasisId)
    const platform = platforms.find((item) => idKey(item.id) === basis)
    const platformId = platform ? idKey(platform.id) : basis
    return products.filter((item) => idKey(item.platformId) === platformId)
  }
  const wanted = listedIds(type)
  if (!wanted.length) return []
  const byId = new Map(products.map((item) => [idKey(item.id), item]))
  const found: HomeProduct[] = []
  for (const id of wanted) {
    const product = byId.get(id)
    if (product) found.push(product)
  }
  return found
}

function toGame(product: HomeProduct, platforms: ProductPlatform[]): Game {
  const platform = platforms.find((item) => idKey(item.id) === idKey(product.platformId))
  return {
    id: idKey(product.id),
    name: productTitle(product.productName),
    image: productImage(product),
    provider: platform?.platformName || '',
  }
}

/** One tab and one game section per product type, in the order the API returned. */
export function buildProviderCatalog(
  types: ProductType[],
  products: HomeProduct[],
  platforms: ProductPlatform[],
): { tabs: ProviderTab[]; blocks: GameBlock[] } {
  const tabs: ProviderTab[] = []
  const blocks: GameBlock[] = []
  types.forEach((type, index) => {
    if (type.isShowInTop === 0) return
    const key = `${type.type}-${type.typeBasisId}-${index}`
    const platform = platforms.find((item) => idKey(item.id) === idKey(type.typeBasisId))
    const label = type.typeCode || platform?.platformName || ''
    const image = assetUrl(type.topIcon) || null
    tabs.push({
      key,
      label,
      spritePosition: null,
      icon: null,
      image,
    })
    const games = productsForType(type, products, platforms).map((item) => toGame(item, platforms))
    blocks.push({
      key,
      icon: Number(type.type) === 1 ? 'provider-POPULAR' : 'provider-PG',
      title: label,
      total: games.length,
      layout: Number(type.type) === 1 ? 'popular' : 'grid',
      games,
      image,
    })
  })
  return { tabs, blocks }
}
