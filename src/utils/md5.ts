/** Lowercase hex MD5. The login API expects the password in this form. */
export function md5(input: string): string {
  const bytes = new TextEncoder().encode(input)
  const bitLen = bytes.length * 8
  const paddedBits = bitLen % 512 < 448 ? 448 - (bitLen % 512) : 960 - (bitLen % 512)
  const total = (bitLen + paddedBits + 64) / 8
  const buf = new Uint8Array(total)
  buf.set(bytes)
  buf[bytes.length] = 0x80
  const view = new DataView(buf.buffer)
  view.setUint32(total - 8, bitLen >>> 0, true)
  view.setUint32(total - 4, Math.floor(bitLen / 0x100000000), true)

  let a0 = 0x67452301
  let b0 = 0xefcdab89
  let c0 = 0x98badcfe
  let d0 = 0x10325476

  const shift = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9,
    14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ]
  const sine = Array.from({ length: 64 }, (_, i) =>
    Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000),
  )

  const rotl = (x: number, n: number) => ((x << n) | (x >>> (32 - n))) >>> 0

  for (let offset = 0; offset < buf.length; offset += 64) {
    const word = new Uint32Array(16)
    for (let i = 0; i < 16; i++) word[i] = view.getUint32(offset + i * 4, true)
    let a = a0
    let b = b0
    let c = c0
    let d = d0
    for (let i = 0; i < 64; i++) {
      let f = 0
      let g = 0
      if (i < 16) {
        f = ((b & c) | (~b & d)) >>> 0
        g = i
      } else if (i < 32) {
        f = ((d & b) | (~d & c)) >>> 0
        g = (5 * i + 1) % 16
      } else if (i < 48) {
        f = (b ^ c ^ d) >>> 0
        g = (3 * i + 5) % 16
      } else {
        f = (c ^ (b | ~d)) >>> 0
        g = (7 * i) % 16
      }
      const sum = (a + f + sine[i] + word[g]) >>> 0
      a = d
      d = c
      c = b
      b = (b + rotl(sum, shift[i])) >>> 0
    }
    a0 = (a0 + a) >>> 0
    b0 = (b0 + b) >>> 0
    c0 = (c0 + c) >>> 0
    d0 = (d0 + d) >>> 0
  }

  const hex = (n: number) =>
    [n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  return hex(a0) + hex(b0) + hex(c0) + hex(d0)
}
