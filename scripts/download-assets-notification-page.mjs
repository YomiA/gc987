// Downloads the /notification (Centro de Mensagens) icons into
// public/images/notification/. Source URLs were read off the live page at
// 390x844x3 while signed in.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const OUT_DIR = resolve(import.meta.dirname, '../public/images/notification')

/** [localName, sourceUrl] */
const ASSETS = [
  ['customer-service.png', 'https://gc987.com/icons/customer_service.png'],
  ['telegram-support.png', 'https://upload-us.f-1-g-h.com/s3/1765292678754/TG.png'],
  ['telegram-channel.png', 'https://upload-us.f-1-g-h.com/s3/1765292690192/TG.png'],
  ['whatsapp-channel.png', 'https://upload-us.f-1-g-h.com/s3/1765292498428/wa2.png'],
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
