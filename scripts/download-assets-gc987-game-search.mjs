// Tab icons for /game/search/:provider (captured from gc987.com/icons/sort/*_on.png).
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const UA =
  'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'

const targets = [
  ['https://gc987.com/icons/sort/SEARCH_on.png', 'images/search/SEARCH_on.png'],
  ['https://gc987.com/icons/sort/POPULAR_on.png', 'images/search/POPULAR_on.png'],
  ['https://gc987.com/icons/sort/RECENT_on.png', 'images/search/RECENT_on.png'],
  ['https://gc987.com/icons/sort/FAVORITE_on.png', 'images/search/FAVORITE_on.png'],
]

const destDir = path.join(ROOT, 'public', 'images', 'search')
await mkdir(destDir, { recursive: true })

for (const [url, dest] of targets) {
  const out = path.join(ROOT, 'public', dest)
  if (existsSync(out)) {
    console.log('skip', dest)
    continue
  }
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  await writeFile(out, Buffer.from(await res.arrayBuffer()))
  console.log('wrote', dest, res.headers.get('content-length'))
}
