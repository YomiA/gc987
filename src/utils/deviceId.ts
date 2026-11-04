import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { md5 } from './md5'

const DEVICE_KEY = 'device_id'

/** Same device id as the other sites: a cached 16-digit fingerprint, with a local fallback. */
export async function getDeviceId(): Promise<string> {
  try {
    const cached = localStorage.getItem(DEVICE_KEY)
    if (cached) return cached
  } catch {
    /* storage can be blocked */
  }
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    const vid = result?.visitorId || ''
    if (vid) {
      const numeric = visitorIdToNumeric(vid)
      try {
        localStorage.setItem(DEVICE_KEY, numeric)
      } catch {
        /* ignore */
      }
      return numeric
    }
  } catch {
    /* fingerprint can fail in locked-down browsers */
  }
  const id = `${Date.now()}${Math.floor(Math.random() * 1e6)
    .toString()
    .padStart(6, '0')}`
  try {
    localStorage.setItem(DEVICE_KEY, id)
  } catch {
    /* ignore */
  }
  return id
}

function visitorIdToNumeric(vid: string): string {
  const hex = md5(vid || '')
  const digits = hex.replace(/[^0-9]/g, '')
  if (digits.length >= 16) return digits.slice(0, 16)
  if (digits.length >= 8) return digits.padEnd(16, '0')
  let out = ''
  for (let i = 0; i < vid.length && out.length < 16; i++) out += String(vid.charCodeAt(i) % 10)
  if (!out) out = String(Date.now())
  return out.slice(0, 16).padEnd(16, '0')
}
