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
const saira = `
/* Saira 500 — live ion-label.tip on /game/search empty (blue-default). */
/* vietnamese */
@font-face {
  font-family: 'Saira';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url('/fonts/saira-vietnamese-500.woff2') format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}

/* latin-ext */
@font-face {
  font-family: 'Saira';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url('/fonts/saira-latin-ext-500.woff2') format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}

/* latin */
@font-face {
  font-family: 'Saira';
  font-style: normal;
  font-weight: 500;
  font-stretch: 100%;
  font-display: swap;
  src: url('/fonts/saira-latin-500.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`
await writeFile('src/styles/fonts.css', head + blocks.join('\n\n') + '\n' + saira)
console.log(`src/styles/fonts.css: ${list.length} Roboto + 3 Saira @font-face rules`)
