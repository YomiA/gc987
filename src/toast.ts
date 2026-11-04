import { reactive } from 'vue'

export type ToastKind = '' | 'error' | 'success' | 'warning'

export const toastState = reactive({
  open: false,
  message: '',
  kind: '' as ToastKind,
})

let timer = 0

/** Middle toast, 2s, same timing as the original `ion-toast`. */
export function showToast(message: string, kind: ToastKind = 'error') {
  toastState.message = message
  toastState.kind = kind
  toastState.open = true
  window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    toastState.open = false
  }, 2000)
}
