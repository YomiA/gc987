/**
 * Site clock from /loadLayout `timeZone` ("UTC-3", "UTC+8", "UTC+5:30").
 * An empty or unreadable value keeps the computer's local clock.
 * The string sent to the backend is that clock's wall time, not UTC.
 */
import { ref } from 'vue'

export const siteTimeZone = ref('')

export function setSiteTimeZone(value?: string | null) {
  siteTimeZone.value = String(value ?? '').trim()
}

/** Minutes east of UTC, or null when the site did not name a zone. */
export function siteOffsetMinutes(): number | null {
  const raw = siteTimeZone.value.replace(/\s+/g, '').toUpperCase()
  if (!raw) return null
  if (raw === 'UTC' || raw === 'GMT' || raw === 'Z') return 0
  const match = raw.match(/^(?:UTC|GMT)([+-])(\d{1,2})(?::(\d{2}))?$/)
  if (!match) return null
  const hours = Number(match[2])
  const minutes = Number(match[3] || 0)
  if (hours > 14 || minutes > 59) return null
  const sign = match[1] === '-' ? -1 : 1
  return sign * (hours * 60 + minutes)
}

export interface WallClock {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
}

/** Wall clock in the site zone. UTC getters read the shifted instant. */
export function wallClock(date = new Date()): WallClock {
  const offset = siteOffsetMinutes()
  if (offset == null) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hours: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
    }
  }
  const shifted = new Date(date.getTime() + offset * 60_000)
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hours: shifted.getUTCHours(),
    minutes: shifted.getUTCMinutes(),
    seconds: shifted.getUTCSeconds(),
  }
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function shiftDay(dayOffset: number, date = new Date()) {
  const clock = wallClock(date)
  return new Date(Date.UTC(clock.year, clock.month - 1, clock.day + dayOffset))
}

/** `YYYY-MM-DD` of a day in the site zone. 0 is today there. */
export function zoneDate(dayOffset = 0, date = new Date()) {
  const shifted = shiftDay(dayOffset, date)
  return `${shifted.getUTCFullYear()}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
}

/** Inclusive `YYYY-MM-DD HH:mm:ss` bounds for one site-zone day. */
export function zoneDayRange(dayOffset = 0, date = new Date()) {
  const day = zoneDate(dayOffset, date)
  return {
    start: `${day} 00:00:00`,
    end: `${day} 23:59:59`,
  }
}

/**
 * Backend times arrive as `2026-11-04T05:45:43`.
 * Show `2026-11-04 05:45:43`. A value that is already spaced stays as it is.
 */
export function formatDateTime(value?: string | number | null): string {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2}):(\d{2})/)
  if (!match) return raw
  return `${match[1]}-${match[2]}-${match[3]} ${match[4]}:${match[5]}:${match[6]}`
}
