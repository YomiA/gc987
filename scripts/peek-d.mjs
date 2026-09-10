import fs from 'node:fs'
let j = JSON.parse(fs.readFileSync('C:/Users/29790/AppData/Local/Temp/gcx-d.json', 'utf8'))
const o = typeof j === 'string' ? JSON.parse(j) : j
fs.writeFileSync('docs/research/extract-d.json', JSON.stringify(o, null, 1))
console.log('providerLogos:', Object.keys(o.providerLogos))
console.log('platIcons:', Object.keys(o.platIcons))
console.log('=== BOX HTML ===')
console.log(o.boxInfo.html)
const clean = (s) =>
  Object.fromEntries(
    Object.entries(s).filter(
      ([, v]) =>
        v &&
        !['none', '0px', 'auto', 'static', 'rgba(0, 0, 0, 0)', 'visible', 'normal', '1'].includes(v),
    ),
  )
console.log('=== BOX STYLE ===', JSON.stringify(clean(o.boxInfo.s), null, 1), JSON.stringify(o.boxInfo.rect))
for (const k of o.boxInfo.kids) {
  console.log(' ', k.tag, '|', k.cls, '|', JSON.stringify(k.rect), JSON.stringify(clean(k.s)))
}
for (const [k, v] of Object.entries(o.providerLogos)) {
  fs.writeFileSync(`docs/research/svg/provider-${k}.svg`, v)
}
for (const [k, v] of Object.entries(o.platIcons)) {
  fs.writeFileSync(`docs/research/svg/plat-${k}.svg`, v)
}
console.log('wrote', Object.keys(o.providerLogos).length, 'provider +', Object.keys(o.platIcons).length, 'plat svgs')
