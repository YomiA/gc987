// Emits src/styles/fonts.css from the woff2 files captured off fonts.gstatic.com.
import { readFile, writeFile } from 'node:fs/promises'

const list = JSON.parse(await readFile('docs/research/fonts.json', 'utf8'))
const order = ['latin', 'latin-ext', 'vietnamese', 'greek', 'greek-ext', 'cyrillic', 'cyrillic-ext', 'math', 'symbols']
list.sort((a, b) => a.weight - b.weight || order.indexOf(a.subset) - order.indexOf(b.subset))

const head = `/* Roboto, captured from the live page's fonts.gstatic.com requests.
   The site declares one family only:
   -apple-system, BlinkMacSystemFont, "Helvetica Neue", Roboto, sans-serif
   On non-Apple platforms that resolves to this webfont, which is what the
   reference screenshots were taken with. Loaded weights: 400/500/700/900. */
`
const blocks = list.map(
  (f) => `/* ${f.subset} */
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: ${f.weight};
  font-display: swap;
  src: url('/fonts/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`,
)
await writeFile('src/styles/fonts.css', head + blocks.join('\n\n') + '\n')
console.log(`src/styles/fonts.css: ${list.length} @font-face rules`)
