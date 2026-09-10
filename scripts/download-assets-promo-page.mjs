// Downloads the /main/promo event banners into public/images/promo-page/.
// Source URLs and order were read off the live page's card list at 390x844x3;
// every banner is a 660x220 PNG rendered into a 360x120 box.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const OUT_DIR = resolve(import.meta.dirname, '../public/images/promo-page')

/** [localName, sourceUrl] in the live DOM order of the Eventos list. */
const ASSETS = [
  ['weekly-compensation.png', 'https://upload-us.f-1-g-h.com/s3/1765558377758/13.png'],
  ['loss-rebate.png', 'https://upload-us.f-1-g-h.com/s3/1765558055054/11.png'],
  ['invite-friend.png', 'https://upload-us.f-1-g-h.com/s3/1765467021238/2.png'],
  ['vip-bonus.png', 'https://upload-us.f-1-g-h.com/s3/1765467191583/3.png'],
  ['daily-checkin.png', 'https://upload-us.f-1-g-h.com/s3/1767170480010/check.png'],
  ['member-day.png', 'https://upload-us.f-1-g-h.com/s3/1767170515818/menber.png'],
  ['friend-help.png', 'https://upload-us.f-1-g-h.com/s3/1765468654699/4.png'],
  ['tuesday-recharge.png', 'https://upload-us.f-1-g-h.com/s3/1767170643803/week.png'],
  ['lucky-test.png', 'https://upload-us.f-1-g-h.com/s3/1767170617701/deposit.png'],
  ['random-bonus.png', 'https://upload-us.f-1-g-h.com/s3/1765467120479/8.png'],
  ['bet-cashback.png', 'https://upload-us.f-1-g-h.com/s3/1765978911895/10.png'],
  ['whatsapp-channel.png', 'https://upload-us.f-1-g-h.com/s3/1765979999527/16.png'],
  ['mystery-bonus.png', 'https://upload-us.f-1-g-h.com/s3/1765557734727/9.png'],
  ['telegram-channel.png', 'https://upload-us.f-1-g-h.com/s3/1765558809882/15.png'],
]

const CONCURRENCY = 4

async function fetchOne([name, url]) {
  const res = await fetch(url, {
    headers: { referer: 'https://gc987.com/', 'user-agent': 'Mozilla/5.0' },
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  const target = resolve(OUT_DIR, name)
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
