// Downloads the /spread "Rede de Agentes" avatars into public/images/spread/.
// Source URLs were read off the live diagram's `.people` background-image at
// 390x844x3; every avatar renders into a 48x48 circle with
// `background-size: 100% 100%`. B3 reuses manB1 and C3 reuses womanC1 on the
// live page, so only five files exist.
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const OUT_DIR = resolve(import.meta.dirname, '../public/images/spread')

/** [localName, sourceUrl] in the live DOM order. */
const ASSETS = [
  ['manA.png', 'https://gc987.com/icons/spread/manA.png'],
  ['manB1.png', 'https://gc987.com/icons/spread/manB1.png'],
  ['manB2.png', 'https://gc987.com/icons/spread/manB2.png'],
  ['womanC1.png', 'https://gc987.com/icons/spread/womanC1.png'],
  ['womanC2.png', 'https://gc987.com/icons/spread/womanC2.png'],
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
