import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  entrarApi,
  entrarAmounts,
  entrarChannel,
  entrarMaxReais,
  entrarMinReais,
  type EntrarChannel,
  type PixOrder,
} from '../api/entrar'

export const useEntrarStore = defineStore('entrar', () => {
  const channel = ref<EntrarChannel>(entrarChannel)
  const amounts = ref<number[]>(entrarAmounts)
  /** Reais typed into the ion-input, empty until a chip or keystroke. */
  const amountReais = ref('')
  const order = ref<PixOrder | null>(null)
  const submitting = ref(false)
  const loaded = ref(false)

  const amountNumber = computed(() => {
    const n = Number(amountReais.value)
    return Number.isFinite(n) ? n : NaN
  })

  const amountCents = computed(() => {
    if (!Number.isFinite(amountNumber.value)) return 0
    return Math.round(amountNumber.value * 100)
  })

  const canSubmit = computed(() => {
    const n = amountNumber.value
    return n >= entrarMinReais && n <= entrarMaxReais
  })

  const selectedCents = computed(() => {
    const cents = amountCents.value
    return amounts.value.includes(cents) ? cents : null
  })

  async function load() {
    if (loaded.value) return
    const [ch, am] = await Promise.all([entrarApi.getChannel(), entrarApi.getAmounts()])
    channel.value = ch
    amounts.value = am
    loaded.value = true
  }

  function selectAmount(cents: number) {
    amountReais.value = String(cents / 100)
  }

  function setAmount(raw: string) {
    amountReais.value = raw
  }

  function clearAmount() {
    amountReais.value = ''
  }

  async function submit() {
    if (!canSubmit.value || submitting.value) return
    submitting.value = true
    try {
      order.value = await entrarApi.createOrder(amountCents.value)
    } finally {
      submitting.value = false
    }
  }

  function finish() {
    order.value = null
  }

  return {
    channel,
    amounts,
    amountReais,
    order,
    submitting,
    loaded,
    amountNumber,
    amountCents,
    canSubmit,
    selectedCents,
    load,
    selectAmount,
    setAmount,
    clearAmount,
    submit,
    finish,
  }
})
