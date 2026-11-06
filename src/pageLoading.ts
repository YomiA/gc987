import { computed, ref } from 'vue'

const pending = ref(0)
/** Covers the first paint, before the open page starts its requests. */
const hold = ref(true)

export function beginPageLoading() {
  pending.value += 1
}

export function endPageLoading() {
  pending.value = Math.max(0, pending.value - 1)
  if (pending.value === 0) hold.value = false
}

/** Drop the first-paint cover when this page never calls the API. */
export function releasePageLoading() {
  if (pending.value === 0) hold.value = false
}

export const pageLoading = computed(() => hold.value || pending.value > 0)
