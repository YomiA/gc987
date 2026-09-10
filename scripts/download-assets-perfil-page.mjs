// Downloads the /main/perfil icons into public/images/perfil/.
// Source URLs were read off the live page's ion-img shadow roots at
// 390x844x3; every list icon renders into a 30x30 box, the crown into 54x54
// (VIP card) / 35x35 (id row), and the avatar into 76x76.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const OUT_DIR = resolve(import.meta.dirname, '../public/images/perfil')

/** [localName, sourceUrl] in the live DOM order. */
const ASSETS = [
  ['avatar-male-1.jpg', 'https://upload-us.f-1-g-h.com/avatar/male_1.jpg'],
  ['vip-crown.png', 'https://gc987.com/icons/perfil/vip0~10.png'],
  ['detail.png', 'https://gc987.com/icons/perfil/detail.png'],
  ['convidar.png', 'https://gc987.com/icons/perfil/convidar.png'],
  ['resgate.svg', 'https://gc987.com/icons/perfil/resgate.svg'],
  ['customer.png', 'https://gc987.com/icons/perfil/customer.png'],
  ['security.png', 'https://gc987.com/icons/perfil/security.png'],
  ['logout.png', 'https://gc987.com/icons/perfil/logout.png'],
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
