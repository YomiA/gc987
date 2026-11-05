/**
 * Fake backend. Everything the page needs is served from here — no network
 * calls leave the app. Shapes mirror what the live page renders, and the
 * numbers/labels are the values read off the DOM during extraction.
 */

export interface Banner {
  id: number
  image: string
}

export interface Promo {
  id: number
  image: string
  span: 'half' | 'full'
}

export interface ProviderTab {
  key: string
  label: string
  /** background-position on the 800% x 500% sprite sheet, or null for the SVG icon */
  spritePosition: string | null
  icon: string | null
  /** Backend category icon. When set, the row shows this image instead of the sprite. */
  image?: string | null
}

export interface Game {
  /** Thumbnail stem; live uses a numeric gameId, clone uses this in the route. */
  id: string
  name: string
  image: string
  /** Filename prefix; also selects the wordmark drawn at the card's bottom. */
  provider: string
}

export interface GameBlock {
  key: string
  icon: string
  title: string
  total: number
  /** 'popular' = 3 columns, 'grid' = 4 columns */
  layout: 'popular' | 'grid'
  games: Game[]
  /** Backend category icon shown beside the section title. */
  image?: string | null
}

export interface TabBarItem {
  key: string
  label: string
  icon: string | null
}

const GAME_IMAGE_BASE = '/images/games'

const banners: Banner[] = [1, 2, 3, 4, 5].map((n) => ({
  id: n,
  image: `/images/banner/bannar${n}.png`,
}))

const promos: Promo[] = [
  { id: 1, image: '/images/promo/bonus50.png', span: 'half' },
  { id: 2, image: '/images/promo/bonus100.png', span: 'half' },
  { id: 3, image: '/images/promo/vip1.png', span: 'full' },
]

/** Sprite offsets read from getComputedStyle on each `i.type-img`. */
const providerTabs: ProviderTab[] = [
  { key: 'POPULAR', label: 'Popular', spritePosition: null, icon: 'hot-POPULAR' },
  { key: 'CP', label: 'CP', spritePosition: '-700% -100%', icon: null },
  { key: 'TADA', label: 'Tada', spritePosition: '-100% 0px', icon: null },
  { key: 'PG', label: 'PG', spritePosition: '-300% 0px', icon: null },
  { key: 'FASTSPIN', label: 'FASTSPIN', spritePosition: '-700% -300%', icon: null },
  { key: 'G759', label: 'G759', spritePosition: '-200% -200%', icon: null },
  { key: 'PANDA', label: 'PANDA', spritePosition: '0px -200%', icon: null },
  { key: 'FACHAI', label: 'FaChai', spritePosition: '-500% -100%', icon: null },
  { key: 'TOPPLAYER', label: 'TOPPLAYER', spritePosition: '-200% -400%', icon: null },
  { key: 'POPOK', label: 'POPOK', spritePosition: '-300% -300%', icon: null },
  { key: 'PLAYNGO', label: 'PLAYNGO', spritePosition: '-300% -400%', icon: null },
  { key: 'CQ9', label: 'CQ9', spritePosition: '0px 0px', icon: null },
  { key: 'PLAYSON', label: 'PLAYSON', spritePosition: '-400% -300%', icon: null },
  { key: 'YELLOWBAT', label: 'YELLOWBAT', spritePosition: '-400% -400%', icon: null },
  { key: 'JDB', label: 'JDB', spritePosition: '-600% 0px', icon: null },
  { key: 'RUBYPLAY', label: 'RUBYPLAY', spritePosition: '-500% -300%', icon: null },
  { key: 'KAGAMING', label: 'KAGAMING', spritePosition: '-500% -400%', icon: null },
  { key: 'SPRIBE', label: 'Spribe', spritePosition: '-100% -100%', icon: null },
  { key: 'EVOLUTION', label: 'Evolution', spritePosition: '0px -100%', icon: null },
  { key: 'PP', label: 'PP', spritePosition: '-200% 0px', icon: null },
  { key: 'INOUT', label: 'inout', spritePosition: '-600% -300%', icon: null },
]

/** The live page derives the card wordmark from the thumbnail's filename prefix. */
const game = (file: string, name: string): Game => ({
  id: file.replace(/\.[^.]+$/, ''),
  name,
  image: `${GAME_IMAGE_BASE}/${file}`,
  provider: file.split('_')[0],
})

const popularGames: Game[] = [
  game('PG_FortuneTiger.jpg', 'Fortune Tiger'),
  game('PG_FortuneSnake.jpg', 'Fortune Snake'),
  game('PG_FortuneRabbit.jpg', 'Fortune Rabbit'),
  game('PG_PinataWins.jpg', 'Piñata Wins'),
  game('PG_FortuneOx.jpg', 'Fortune Ox'),
  game('PG_DoubleFortune.jpg', 'Double Fortune'),
  game('PG_FortuneDragon.jpg', 'Fortune Dragon'),
  game('PG_GaneshaGold.jpg', 'Ganesha Gold'),
  game('POPOK_YoDragon.jpg', 'Yo Dragon'),
  game('G759_RabbitsGrace.jpg', "Rabbit's Grace"),
  game('PG_WildBountyShowdown.jpg', 'Wild Bounty Showdown'),
  game('PG_WildBandito.jpg', 'Wild Bandito'),
]

const pgGames: Game[] = [
  game('PG_FortuneTiger.jpg', 'Fortune Tiger'),
  game('PG_FortuneSnake.jpg', 'Fortune Snake'),
  game('PG_FortuneRabbit.jpg', 'Fortune Rabbit'),
  game('PG_PinataWins.jpg', 'Piñata Wins'),
  game('PG_FortuneOx.jpg', 'Fortune Ox'),
  game('PG_DoubleFortune.jpg', 'Double Fortune'),
  game('PG_FortuneDragon.jpg', 'Fortune Dragon'),
  game('PG_GaneshaGold.jpg', 'Ganesha Gold'),
  game('PG_WildBountyShowdown.jpg', 'Wild Bounty Showdown'),
  game('PG_WildBandito.jpg', 'Wild Bandito'),
  game('PG_MrTreasuresFortune.jpg', "Mr Treasure's Fortune"),
  game('PG_MidasFortune.jpg', 'Midas Fortune'),
]

const tadaGames: Game[] = [
  game('TADAJILI_FortuneGaruda500.jpg', 'Fortune Garuda 500'),
  game('TADAJILI_LuckyJaguar500.jpg', 'Lucky Jaguar 500'),
  game('TADAJILI_GoldMineExpress.jpg', 'Gold Mine Express'),
  game('TADAJILI_LuckyTamarin.jpg', 'Lucky Tamarin'),
  game('TADAJILI_FortuneGems500.jpg', 'Fortune Gems 500'),
  game('TADAJILI_FortuneHookBoom.jpg', 'Fortune Hook Boom'),
  game('TADAJILI_FortuneGems3.jpg', 'Fortune Gems 3'),
  game('TADAJILI_FortuneGems2.jpg', 'Fortune Gems 2'),
  game('TADAJILI_3LightningBlitz.jpg', '3 Lightning Blitz'),
  game('TADAJILI_LeprechaunsGoldStreak.jpg', "Leprechaun's Gold Streak"),
  game('TADAJILI_MoneyComing.jpg', 'Money Coming'),
  game('TADAJILI_LuckyTiger.jpg', 'Lucky Tiger'),
]

const cpGames: Game[] = [
  game('CP_MagicScroll.jpg', 'Magic Scroll'),
  game('CP_Sharpshooter.jpg', 'Sharpshooter'),
  game('CP_SunshineCoast.jpg', 'Sunshine Coast'),
  game('CP_LuckyWheel.jpg', 'Lucky Wheel'),
  game('CP_HalloweenMeow.jpg', 'Halloween Meow'),
  game('CP_FortunePanda.jpg', 'Fortune Panda'),
  game('CP_CrazyHalloween.jpg', 'Crazy Halloween'),
  game('CP_LuckyCat.jpg', 'Lucky Cat'),
  game('CP_BeachFun.jpg', 'Beach Fun'),
  game('CP_LuckyPanda.jpg', 'Lucky Panda'),
  game('CP_FreedomDay.jpg', 'Freedom Day'),
  game('CP_GlacierTreasure.jpg', 'Glacier Treasure'),
]

const spribeGames: Game[] = [
  game('Spribe_aviator.jpg', 'Aviator'),
  game('Spribe_mines.jpg', 'Mines'),
  game('Spribe_goal.jpg', 'Goal'),
  game('Spribe_balloon.jpg', 'Balloon'),
  game('Spribe_hotline.jpg', 'HotLine'),
  game('Spribe_plinko.jpg', 'Plinko'),
  game('Spribe_miniroulette.jpg', 'Mini Roulette'),
  game('Spribe_dice.jpg', 'Dice'),
  game('Spribe_keno.jpg', 'Keno'),
  game('Spribe_hilo.jpg', 'HiLo'),
]

const ppGames: Game[] = [
  game('PP_CaishensCashPots.jpg', "Caishen's Cash Pots"),
  game('PP_TutsTreasureTower.jpg', "Tut's Treasure Tower"),
  game('PP_LuckyTigerGold.jpg', 'Lucky Tiger Gold'),
  game('PP_LuckyOx.jpg', 'Lucky Ox'),
  game('PP_ResurrectingRiches.jpg', 'Resurrecting Riches'),
  game('PP_SuperGummyStrike.jpg', 'Super Gummy Strike'),
  game('PP_GatesofOlympusSuperScatter.jpg', 'Gates of Olympus Super Scatter'),
  game('PP_FuryofAnubis.jpg', 'Fury of Anubis'),
  game('PP_LuckyFortuneTree.jpg', 'Lucky Fortune Tree'),
  game('PP_JokersJewels.jpg', "Joker's Jewels"),
  game('PP_DragonPotsMegaways.jpg', 'Dragon Pots Megaways'),
  game('PP_TriplePotDiamond.jpg', 'Triple Pot Diamond'),
]

const gameBlocks: GameBlock[] = [
  {
    key: 'POPULAR',
    icon: 'provider-POPULAR',
    title: 'Popular',
    total: 100,
    layout: 'popular',
    games: popularGames,
  },
  { key: 'PG', icon: 'provider-PG', title: 'Slot', total: 157, layout: 'grid', games: pgGames },
  { key: 'TADA', icon: 'provider-TADA', title: 'Slot', total: 162, layout: 'grid', games: tadaGames },
  {
    key: 'SPRIBE',
    icon: 'provider-SPRIBE',
    title: 'Slot',
    total: 10,
    layout: 'grid',
    games: spribeGames,
  },
  { key: 'PP', icon: 'provider-PP', title: 'Slot', total: 452, layout: 'grid', games: ppGames },
  { key: 'CP', icon: 'provider-CP', title: 'Slot', total: 42, layout: 'grid', games: cpGames },
]

const tabBarItems: TabBarItem[] = [
  { key: 'inicio', label: 'Inicio', icon: '/images/tabbar/inicio-fx.png' },
  { key: 'promo', label: 'Promoção', icon: '/images/tabbar/promo-fx.png' },
  { key: 'deposito', label: 'Depósito', icon: null },
  { key: 'saque', label: 'Saque', icon: '/images/tabbar/withdraw-fx.png' },
  { key: 'perfil', label: 'Perfil', icon: '/images/tabbar/perfil-fx.png' },
]

const marqueeNotices: string[] = [
  'Torne-se um agente GC987 e ganhe reembolsos generosos com facilidade!',
  'Não perca! Visite GC987.com para mais BÔNUS incríveis! Cadastre-se agora e ganhe seu prêmio!',
  'Convide seus amigos e tenha a chance de ganhar até 1 milhão por mês!',
]

/** Live `/game/category/:gameType` title = `$t('sort.' + gameType)`. */
export const gameTypeTitles: Record<string, string> = {
  ELECTRONIC: 'Slot',
  FISH: 'Pesca',
  VIDEO: 'Cassino',
  CHESS: 'Cartas',
  SPORT: 'Esporte',
}

/**
 * Left rail on `/game/category/ELECTRONIC/:platformId`. Order is the live
 * `custom-segment` (ALL + brands). `0` is Ionic's "all platforms" id.
 */
const CATEGORY_RAIL_KEYS = [
  'PG',
  'TADA',
  'CQ9',
  'JDB',
  'SPRIBE',
  'PP',
  'CP',
  'G759',
  'FACHAI',
  'POPOK',
  'PLAYSON',
  'RUBYPLAY',
  'INOUT',
  'FASTSPIN',
  'PANDA',
  'TOPPLAYER',
  'PLAYNGO',
  'YELLOWBAT',
  'KAGAMING',
] as const

export interface CategoryPlatform {
  key: string
  label: string
  spritePosition: string | null
}

export const categoryPlatforms: CategoryPlatform[] = [
  { key: '0', label: 'TodosSlot', spritePosition: null },
  ...CATEGORY_RAIL_KEYS.map((key) => {
    const tab = providerTabs.find((item) => item.key === key)
    return {
      key,
      label: tab?.label ?? key,
      spritePosition: tab?.spritePosition ?? null,
    }
  }),
]

export function uniqueCatalog(blocks: GameBlock[]): Game[] {
  const seen = new Set<string>()
  const out: Game[] = []
  for (const block of blocks) {
    for (const game of block.games) {
      if (seen.has(game.id)) continue
      seen.add(game.id)
      out.push(game)
    }
  }
  return out
}

export function gameMatchesPlatform(game: Game, platformId: string): boolean {
  const id = platformId.toUpperCase()
  if (id === '0' || id === 'ALL') return true
  const provider = game.provider.toUpperCase()
  if (id === 'TADA') return provider.startsWith('TADA')
  return provider === id
}

/**
 * Footer game types. Live `homeGames` (non-SPORTS), each with its own
 * `platformList` in the order the page renders. Clicking a type swaps the
 * right-hand list; it does not open a route.
 */
export interface ClassificationGenre {
  label: string
  brands: string[]
}

const genres: ClassificationGenre[] = [
  {
    label: 'Slot',
    brands: [
      'PG',
      'Tada',
      'KAGAMING',
      'YELLOWBAT',
      'PLAYNGO',
      'TOPPLAYER',
      'PANDA',
      'FASTSPIN',
      'inout',
      'RUBYPLAY',
      'PLAYSON',
      'POPOK',
      'FaChai',
      'G759',
      'CP',
      'PP',
      'Spribe',
      'JDB',
      'CQ9',
    ],
  },
  { label: 'Pesca', brands: ['Tada'] },
  { label: 'Cassino', brands: ['Evolution'] },
  { label: 'Cartas', brands: ['Tada'] },
]

const settle = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), 0))

export const api = {
  getBanners: () => settle(banners),
  getPromos: () => settle(promos),
  getProviderTabs: () => settle(providerTabs),
  getGameBlocks: () => settle(gameBlocks),
  getTabBarItems: () => settle(tabBarItems),
  getMarqueeNotices: () => settle(marqueeNotices),
  getClassification: () => settle({ genres }),
}
