import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { paymentChannels, createPaymentOrder, type PaymentChannel } from '../api/deposit'
import {
  entrarAmounts,
  entrarChannel,
  entrarMaxReais,
  entrarMinReais,
  type EntrarChannel,
  type PixOrder,
} from '../api/entrar'
import { showToast } from '../toast'
import { i18n } from '../i18n'
import { assetUrl } from '../utils/assetUrl'
import { pickLocaleText } from '../utils/localeText'
import { formatGrouped } from '../utils/money'

function centsOf(value: string | number) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return 0
  return Math.round(amount * 100)
}

export const useEntrarStore = defineStore('entrar', () => {
  const channel = ref<EntrarChannel>(entrarChannel)
  const amounts = ref<number[]>(entrarAmounts)
  const minReais = ref(entrarMinReais)
  const maxReais = ref(entrarMaxReais)
  /** Reais typed into the ion-input, empty until a chip or keystroke. */
  const amountReais = ref('')
  const order = ref<PixOrder | null>(null)
  const submitting = ref(false)
  const needsRealName = ref(false)
  const realNameOpen = ref(false)
  const payName = ref('')
  const payId = ref('')
  const payUrl = ref('')
  const channelId = ref<number | null>(null)

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
    return n >= minReais.value && n <= maxReais.value
  })

  const selectedCents = computed(() => {
    const cents = amountCents.value
    return amounts.value.includes(cents) ? cents : null
  })

  const placeholder = computed(
    () => `${formatGrouped(minReais.value)} - ${formatGrouped(maxReais.value)}`,
  )

  function applyChannel(item: PaymentChannel) {
    channel.value = {
      key: String(item.id),
      label: pickLocaleText(item.showName, item.showName),
      reco: true,
      icon: assetUrl(item.icon),
    }
    const chips = (item.payAmtArr || []).map(centsOf).filter((cents) => cents > 0)
    if (chips.length) amounts.value = chips
    if (Number.isFinite(Number(item.minPayAmt))) minReais.value = Number(item.minPayAmt)
    if (Number.isFinite(Number(item.maxPayAmt))) maxReais.value = Number(item.maxPayAmt)
    needsRealName.value = Number(item.realNamePayStatus) === 1
    channelId.value = Number(item.id)
  }

  /** Fresh channel list every time the deposit page opens. */
  async function load() {
    try {
      const resp = await paymentChannels()
      const list = resp.data?.channels || []
      if (list[0]) applyChannel(list[0])
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    }
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

  const identityReady = computed(() => payName.value.trim().length > 0 && payId.value.trim().length > 0)

  async function placeOrder() {
    if (submitting.value || channelId.value == null || !canSubmit.value) return false
    const body: {
      amount: number
      channelId: number
      payerIdNo?: string
      payerName?: string
    } = {
      amount: amountNumber.value,
      channelId: channelId.value,
    }
    if (needsRealName.value) {
      body.payerName = payName.value.trim()
      body.payerIdNo = payId.value.trim()
    }
    submitting.value = true
    try {
      const resp = await createPaymentOrder(body)
      const url = typeof resp.data === 'string' ? resp.data.trim() : ''
      if (!url) {
        showToast(String(i18n.global.t('login.requestFailed')), 'error')
        return false
      }
      payUrl.value = url
      return true
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
      return false
    } finally {
      submitting.value = false
    }
  }

  async function submit() {
    if (!canSubmit.value || submitting.value) return
    if (needsRealName.value && !identityReady.value) {
      realNameOpen.value = true
      return
    }
    await placeOrder()
  }

  function closeRealName() {
    if (submitting.value) return
    realNameOpen.value = false
  }

  async function confirmIdentity(name: string, idNo: string) {
    payName.value = name.trim()
    payId.value = idNo.trim()
    const ok = await placeOrder()
    if (ok) realNameOpen.value = false
  }

  function clearPay() {
    payUrl.value = ''
  }

  function finish() {
    order.value = null
    payUrl.value = ''
  }

  return {
    channel,
    amounts,
    amountReais,
    placeholder,
    order,
    submitting,
    realNameOpen,
    payUrl,
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
    closeRealName,
    confirmIdentity,
    clearPay,
  }
})
