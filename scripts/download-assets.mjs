// Downloads every asset the live /main/inicio page loads, into public/.
// Source list comes from docs/research/assets.json (captured via Chrome DevTools MCP).
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const targets = []
const add = (url, dest) => targets.push({ url, dest: path.join(ROOT, 'public', dest) })

// --- brand / chrome -------------------------------------------------------
add('https://upload-us.f-1-g-h.com/s3/app-icon/8777920/ICON.png', 'images/brand/ICON.png')
add('https://upload-us.f-1-g-h.com/s3/1765285716375/LOGO.png', 'images/brand/LOGO.png')
add('https://gc987.com/images/pwa-prize.png', 'images/brand/pwa-prize.png')
add('https://gc987.com/icons/heart.png', 'images/brand/heart.png')

// --- carousel -------------------------------------------------------------
for (const n of [1, 2, 3, 4, 5]) {
  const ids = {
    1: '1765352446234',
    2: '1765352463116',
    3: '1765352475038',
    4: '1765352500763',
    5: '1765352486610',
  }
  add(`https://upload-us.f-1-g-h.com/s3/${ids[n]}/bannar${n}.png`, `images/banner/bannar${n}.png`)
}

// --- promo grid -----------------------------------------------------------
add('https://upload-us.f-1-g-h.com/s3/1765349369903/bonus50.png', 'images/promo/bonus50.png')
add('https://upload-us.f-1-g-h.com/s3/1765349398302/bonus100.png', 'images/promo/bonus100.png')
add('https://upload-us.f-1-g-h.com/s3/1765349346944/vip1.png', 'images/promo/vip1.png')

// --- section / layout backgrounds ----------------------------------------
add('https://gc987.com/images/headerTextBg.png', 'images/bg/headerTextBg.png')
add('https://gc987.com/images/appInstallBg.png', 'images/bg/appInstallBg.png')
add('https://gc987.com/assets/platform1-r2-4bf-MObW.png', 'images/bg/platform-sprite.png')

// --- tab bar --------------------------------------------------------------
add('https://gc987.com/first/svg/tabbar/bg-blue-dark.svg', 'images/tabbar/bg-blue-dark.svg')
add('https://gc987.com/first/svg/tabbar/deposit-blue-dark.svg', 'images/tabbar/deposit-blue-dark.svg')
add('https://gc987.com/first/svg/tabbar/deposit-blue-dark-on.png', 'images/tabbar/deposit-on.png')
add('https://gc987.com/icons/tabbar/inicio-fx.png', 'images/tabbar/inicio-fx.png')
add('https://gc987.com/icons/tabbar/promo-fx.png', 'images/tabbar/promo-fx.png')
add('https://gc987.com/icons/tabbar/withdraw-fx.png', 'images/tabbar/withdraw-fx.png')
add('https://gc987.com/icons/tabbar/perfil-fx.png', 'images/tabbar/perfil-fx.png')

// --- game covers ----------------------------------------------------------
const games = [
  'PG_FortuneTiger',
  'PG_FortuneSnake',
  'PG_FortuneRabbit',
  'PG_PinataWins',
  'PG_FortuneOx',
  'PG_DoubleFortune',
  'PG_FortuneDragon',
  'PG_GaneshaGold',
  'POPOK_YoDragon',
  'G759_RabbitsGrace',
  'PG_WildBountyShowdown',
  'PG_WildBandito',
  'PG_MrTreasuresFortune',
  'PG_MidasFortune',
  'TADAJILI_FortuneGaruda500',
  'TADAJILI_LuckyJaguar500',
  'TADAJILI_GoldMineExpress',
  'TADAJILI_LuckyTamarin',
  'TADAJILI_FortuneGems500',
  'TADAJILI_FortuneHookBoom',
  'TADAJILI_FortuneGems3',
  'TADAJILI_FortuneGems2',
  'TADAJILI_3LightningBlitz',
  'TADAJILI_LeprechaunsGoldStreak',
  'TADAJILI_MoneyComing',
  'TADAJILI_LuckyTiger',
  'CP_MagicScroll',
  'CP_Sharpshooter',
  'CP_SunshineCoast',
  'CP_LuckyWheel',
  'CP_HalloweenMeow',
  'CP_FortunePanda',
  'CP_CrazyHalloween',
  'CP_LuckyCat',
  'CP_BeachFun',
  'CP_LuckyPanda',
  'CP_FreedomDay',
  'CP_GlacierTreasure',
  'Spribe_aviator',
  'Spribe_mines',
  'Spribe_goal',
  'Spribe_balloon',
  'Spribe_hotline',
  'Spribe_plinko',
  'Spribe_miniroulette',
  'Spribe_dice',
  'Spribe_keno',
  'Spribe_hilo',
  'PP_CaishensCashPots',
  'PP_TutsTreasureTower',
  'PP_LuckyTigerGold',
  'PP_LuckyOx',
  'PP_ResurrectingRiches',
  'PP_SuperGummyStrike',
  'PP_GatesofOlympusSuperScatter',
  'PP_FuryofAnubis',
  'PP_LuckyFortuneTree',
  'PP_JokersJewels',
  'PP_DragonPotsMegaways',
  'PP_TriplePotDiamond',
]
for (const g of games) {
  add(`https://game-logo.6-q-r-s.com/prod/style2/en/${g}.jpg`, `images/games/${g}.jpg`)
}

async function fetchBuf(url, referer = 'https://gc987.com/') {
  const res = await fetch(url, {
    headers: { 'user-agent': UA, referer, accept: '*/*' },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return Buffer.from(await res.arrayBuffer())
}

async function run(items, label) {
  let ok = 0
  const failed = []
  for (let i = 0; i < items.length; i += 4) {
    const batch = items.slice(i, i + 4)
    await Promise.all(
      batch.map(async (t) => {
        if (existsSync(t.dest)) {
          ok++
          return
        }
        try {
          const buf = await fetchBuf(t.url)
          await mkdir(path.dirname(t.dest), { recursive: true })
          await writeFile(t.dest, buf)
          ok++
        } catch (e) {
          failed.push(`${t.url} -> ${e.message}`)
        }
      }),
    )
  }
  console.log(`${label}: ${ok}/${items.length} ok`)
  if (failed.length) console.log('  FAILED:\n   ' + failed.join('\n   '))
  return failed
}

// --- fonts ----------------------------------------------------------------
// The live page only ever resolves one family: Roboto (loaded weights 400/500/700/900).
async function fonts() {
  const css = await (
    await fetch(
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap',
      { headers: { 'user-agent': UA } },
    )
  ).text()
  await mkdir(path.join(ROOT, 'public/fonts'), { recursive: true })
  const blocks = [...css.matchAll(/\/\*\s*([a-z0-9\-\[\]]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/gi)]
  const out = []
  for (const [, subset, body] of blocks) {
    const weight = /font-weight:\s*([\d\s]+);/.exec(body)?.[1].trim()
    const url = /url\((https:\/\/[^)]+\.woff2)\)/.exec(body)?.[1]
    const range = /unicode-range:\s*([^;]+);/.exec(body)?.[1].trim()
    if (!url || !weight) continue
    const file = `roboto-${subset}-${weight}.woff2`
    const dest = path.join(ROOT, 'public/fonts', file)
    if (!existsSync(dest)) {
      await writeFile(dest, await fetchBuf(url, 'https://fonts.googleapis.com/'))
    }
    out.push({ file, weight, subset, range })
  }
  await writeFile(
    path.join(ROOT, 'docs/research/fonts.json'),
    JSON.stringify(out, null, 2),
  )
  console.log(`fonts: ${out.length} woff2 files`)
  return out
}

const f1 = await run(targets, 'assets')
await fonts()
if (f1.length) process.exitCode = 1
