// Downloads the artwork used by the Rebate / VIP / record panels of
// /main/promo.
//
// Provider logos and their order come from activity.activityDetail
// (activityId 3847, type Rebate) -> rebateList[gameType=ELECTRONIC]; they land
// in src/assets because they are `currentColor` SVGs that have to be inlined to
// come out white, like the ion-icon on the live page.
// The crowns are the ion-img sources of the VIP level table, which picks a file
// per level pair (V0/V1 -> vip0~10, V2/V3 -> vip11~20, ... V18+ -> vip91~100).
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')

/** [localPath relative to the repo root, sourceUrl] */
const ASSETS = [
  // Rebate: platform logos, in live list order.
  [
    'src/assets/promo/providers/fastspin.svg',
    'https://upload-us.f-1-g-h.com/s3/1763716723338/fast-spin.svg',
  ],
  ['src/assets/promo/providers/pg.svg', 'https://upload-us.f-1-g-h.com/s3/1749108667965/PG.svg'],
  [
    'src/assets/promo/providers/inout.svg',
    'https://upload-us.f-1-g-h.com/s3/1762156822663/inout.svg',
  ],
  [
    'src/assets/promo/providers/rubyplay.svg',
    'https://upload-us.f-1-g-h.com/s3/1758777605266/Rubyplay.svg',
  ],
  [
    'src/assets/promo/providers/playson.svg',
    'https://upload-us.f-1-g-h.com/s3/1756098272932/playson.svg',
  ],
  [
    'src/assets/promo/providers/popok.svg',
    'https://upload-us.f-1-g-h.com/s3/1750833862013/Game_popk.svg',
  ],
  [
    'src/assets/promo/providers/fachai.svg',
    'https://upload-us.x-y-2-z.com/s3/1746524689722/Fachai.svg',
  ],
  ['src/assets/promo/providers/g759.svg', 'https://upload-us.x-y-2-z.com/s3/1747906208323/759.svg'],
  ['src/assets/promo/providers/cp.svg', 'https://upload-us.bcbd123.com/1740658752321/cp.svg'],
  ['src/assets/promo/providers/pp.svg', 'https://upload-us.bcbd123.com/1737540643116/PPlogo_2.svg'],
  [
    'src/assets/promo/providers/spribe.svg',
    'https://upload-us.bcbd123.com/1721214273694/Spribe.svg',
  ],
  ['src/assets/promo/providers/jdb.svg', 'https://upload-us.bcbd123.com/1721214234733/JDB.svg'],
  ['src/assets/promo/providers/cq9.svg', 'https://upload-us.bcbd123.com/1721214190596/cq9.svg'],
  ['src/assets/promo/providers/tada.svg', 'https://upload-us.bcbd123.com/1721214178671/tada.svg'],
  // Rebate: the checked category tile ("Slot" = ELECTRONIC).
  ['public/images/promo-page/sort-electronic-on.png', 'https://gc987.com/icons/sort/ELECTRONIC_on.png'],
  // VIP: crowns.
  ['public/images/promo-page/vip/vip0-10.png', 'https://gc987.com/icons/perfil/vip0~10.png'],
  ['public/images/promo-page/vip/vip11-20.png', 'https://gc987.com/icons/perfil/vip11~20.png'],
  ['public/images/promo-page/vip/vip21-30.png', 'https://gc987.com/icons/perfil/vip21~30.png'],
  ['public/images/promo-page/vip/vip31-40.png', 'https://gc987.com/icons/perfil/vip31~40.png'],
  ['public/images/promo-page/vip/vip41-50.png', 'https://gc987.com/icons/perfil/vip41~50.png'],
  ['public/images/promo-page/vip/vip51-60.png', 'https://gc987.com/icons/perfil/vip51~60.png'],
  ['public/images/promo-page/vip/vip61-70.png', 'https://gc987.com/icons/perfil/vip61~70.png'],
  ['public/images/promo-page/vip/vip71-80.png', 'https://gc987.com/icons/perfil/vip71~80.png'],
  ['public/images/promo-page/vip/vip81-90.png', 'https://gc987.com/icons/perfil/vip81~90.png'],
  ['public/images/promo-page/vip/vip91-100.png', 'https://gc987.com/icons/perfil/vip91~100.png'],
  // Histórico / Pendente: empty state.
  ['public/images/promo-page/no-record.png', 'https://gc987.com/icons/No_record.png'],
]

const CONCURRENCY = 4

async function fetchOne([name, url]) {
  const res = await fetch(url, {
    headers: { referer: 'https://gc987.com/', 'user-agent': 'Mozilla/5.0' },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const target = resolve(ROOT, name)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, buf)
  return `${name} ${buf.length}`
}

const queue = [...ASSETS]
const done = []
const failed = []

await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const item = queue.shift()
      try {
        done.push(await fetchOne(item))
      } catch (err) {
        failed.push(`${item[0]}: ${err.message}`)
      }
    }
  }),
)

console.log(`ok ${done.length}/${ASSETS.length}`)
done.sort().forEach((l) => console.log('  ' + l))
if (failed.length) {
  console.log('FAILED:')
  failed.forEach((l) => console.log('  ' + l))
  process.exitCode = 1
}
