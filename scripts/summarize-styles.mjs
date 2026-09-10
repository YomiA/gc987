// Condenses the raw computed-style dumps into readable per-section specs.
// Drops values inherited unchanged from the parent and Tailwind-preflight noise.
import { readFile, writeFile } from 'node:fs/promises'

const INHERITED = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'color',
  'letterSpacing',
  'textAlign',
  'textTransform',
  'whiteSpace',
  'visibility',
  'writingMode',
]
const ALWAYS_DROP = new Set([
  'transformOrigin',
  'webkitTextFillColor',
  'pointerEvents',
  'borderStyle',
  'borderColor',
])

function fmt(node, parentStyles, depth, out) {
  const s = { ...(node.s || {}) }
  for (const p of ALWAYS_DROP) {
    if (p === 'borderStyle' || p === 'borderColor') {
      const hasBorder = ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].some(
        (w) => s[w] && s[w] !== '0px',
      )
      if (!hasBorder) delete s[p]
    } else {
      delete s[p]
    }
  }
  if (s.transition === 'all') delete s.transition
  if (s.transform === 'matrix(1, 0, 0, 1, 0, 0)') delete s.transform
  for (const p of INHERITED) {
    if (s[p] !== undefined && parentStyles[p] === s[p]) delete s[p]
  }
  const pad = '  '.repeat(depth)
  const head = `${pad}${node.t}${node.c ? '.' + node.c.split(' ').join('.') : ''}${
    node.box ? `  @${node.box}` : ''
  }${node.src ? `  src=${node.src}` : ''}${node.viewBox ? `  viewBox="${node.viewBox}"` : ''}${
    node.note ? `  (${node.note})` : ''
  }${node.repeated ? '  [2nd of repeated]' : ''}`
  out.push(head)
  if (node.txt) out.push(`${pad}  TEXT: "${node.txt}"`)
  const entries = Object.entries(s)
  if (entries.length) {
    out.push(`${pad}  ${entries.map(([k, v]) => `${k}: ${v}`).join('; ')}`)
  }
  const merged = { ...parentStyles, ...(node.s || {}) }
  for (const k of node.k || []) fmt(k, merged, depth + 1, out)
}

const [, , src, dest] = process.argv
let j = JSON.parse(await readFile(src, 'utf8'))
if (typeof j === 'string') j = JSON.parse(j)
const out = []
for (const [name, node] of Object.entries(j)) {
  out.push('', '='.repeat(70), `## ${name}`, '='.repeat(70))
  fmt(node, {}, 0, out)
}
await writeFile(dest, out.join('\n'))
console.log(`${dest}: ${out.length} lines`)
