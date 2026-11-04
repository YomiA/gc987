import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  cashOutChannels,
  cashOutWalletPlayer,
  createCashOutOrder,
  withdrawApi,
  withdrawAmounts,
  withdrawBalanceCents,
  withdrawCopy,
  withdrawFeeCents,
  withdrawMaxReais,
  withdrawMinReais,
  mockSetAssetPassword,
  type CashOutChannel,
} from '../api/withdraw'
import { showToast } from '../toast'
import { assetUrl } from '../utils/assetUrl'
import { pickLocaleText } from '../utils/localeText'
import { formatGrouped } from '../utils/money'

function centsOf(value: string | number) {
  const amount = Number(value)
  if (!Number.isFinite(amount) || amount <= 0) return 0
  return Math.round(amount * 100)
}

export const useWithdrawStore = defineStore('withdraw', () => {
  const channels = ref<Array<CashOutChannel & { label: string }>>([])
  const selectedChannel = ref(-1)
  const amounts = ref<number[]>(withdrawAmounts)
  const minReais = ref(withdrawMinReais)
  const maxReais = ref(withdrawMaxReais)
  const balanceCents = ref(withdrawBalanceCents)
  const feeCents = ref(withdrawFeeCents)
  const amountReais = ref('')
  const name = ref('')
  const cpf = ref('')
  const amountError = ref(false)
  const nameError = ref(false)
  const cpfError = ref(false)
  /** True after the typed amount exceeded Conta Saldo and was clamped. */
  const overBalance = ref(false)
  const loaded = ref(false)
  const isAssetPassword = ref(true)
  const fundTipsOpen = ref(false)
  const passwordOpen = ref(false)
  const submitting = ref(false)
  /** Bound payout account. The page has no card list yet, so this stays empty. */
  const bankCardId = ref<number | null>(null)

  const amountNumber = computed(() => {
    const n = Number(amountReais.value)
    return Number.isFinite(n) ? n : NaN
  })

  const amountCents = computed(() => {
    if (!Number.isFinite(amountNumber.value)) return 0
    return Math.round(amountNumber.value * 100)
  })

  const amountOk = computed(() => {
    const n = amountNumber.value
    return Number.isInteger(n) && n >= minReais.value && n <= maxReais.value
  })

  const placeholder = computed(
    () => `${formatGrouped(minReais.value)} - ${formatGrouped(maxReais.value)}`,
  )

  const nameOk = computed(() => name.value.trim().length > 0)
  const cpfOk = computed(() => /^\d{11}$/.test(cpf.value))

  const selectedCents = computed(() => {
    const cents = amountCents.value
    if (!amounts.value.includes(cents)) return null
    if (cents > balanceCents.value) return null
    return cents
  })

  function chipDisabled(cents: number) {
    return cents > balanceCents.value
  }

  function applyChannel(item: CashOutChannel) {
    const chips = (item.cashOutAmtArr || []).map(centsOf).filter((cents) => cents > 0)
    if (chips.length) amounts.value = chips
    if (Number.isFinite(Number(item.minCashOutAmt))) minReais.value = Number(item.minCashOutAmt)
    if (Number.isFinite(Number(item.maxCashOutAmt))) maxReais.value = Number(item.maxCashOutAmt)
  }

  function selectChannel(index: number) {
    const item = channels.value[index]
    if (!item || index === selectedChannel.value) return
    selectedChannel.value = index
    applyChannel(item)
    amountReais.value = ''
    overBalance.value = false
    amountError.value = false
  }

  async function refreshChannels() {
    try {
      const resp = await cashOutChannels()
      const list = (resp.data?.channels || []).map((item) => ({
        ...item,
        icon: assetUrl(item.icon),
        label: pickLocaleText(item.showName),
      }))
      channels.value = list
      if (!list.length) {
        selectedChannel.value = -1
        return
      }
      const index = selectedChannel.value >= 0 && selectedChannel.value < list.length ? selectedChannel.value : 0
      selectedChannel.value = index
      applyChannel(list[index])
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    }
  }

  async function load() {
    const channelsTask = refreshChannels()
    if (!loaded.value) {
      const [am, bal, fee] = await Promise.all([
        withdrawApi.getAmounts(),
        withdrawApi.getBalance(),
        withdrawApi.getFee(),
      ])
      if (!channels.value.length) amounts.value = am
      balanceCents.value = bal
      feeCents.value = fee
      loaded.value = true
    }
    await channelsTask
  }

  function reaisInputFromCents(cents: number) {
    return String(cents / 100)
  }

  function selectAmount(cents: number) {
    if (chipDisabled(cents)) return
    amountReais.value = reaisInputFromCents(cents)
    overBalance.value = false
    amountError.value = false
  }

  function setAmount(raw: string) {
    if (raw === '') {
      amountReais.value = ''
      overBalance.value = false
      if (amountError.value) amountError.value = !amountOk.value
      return
    }
    const n = Number(raw)
    const capReais = balanceCents.value / 100
    if (Number.isFinite(n) && n > capReais) {
      amountReais.value = reaisInputFromCents(balanceCents.value)
      overBalance.value = true
    } else if (overBalance.value && Number.isFinite(n) && n === capReais) {
      amountReais.value = reaisInputFromCents(balanceCents.value)
    } else {
      amountReais.value = raw
      overBalance.value = false
    }
    if (amountError.value) amountError.value = !amountOk.value
  }

  function clearAmount() {
    amountReais.value = ''
    overBalance.value = false
    amountError.value = false
  }

  function setName(raw: string) {
    name.value = raw.slice(0, 128)
    if (nameError.value) nameError.value = !nameOk.value
  }

  function clearName() {
    name.value = ''
    nameError.value = false
  }

  function setCpf(raw: string) {
    cpf.value = raw.replace(/\D/g, '').slice(0, 11)
    if (cpfError.value) cpfError.value = !cpfOk.value
  }

  function clearCpf() {
    cpf.value = ''
    cpfError.value = false
  }

  function requestCashOut() {
    if (submitting.value) return
    amountError.value = !amountOk.value
    nameError.value = !nameOk.value
    cpfError.value = !cpfOk.value
    if (amountError.value || nameError.value || cpfError.value) return
    const channel = channels.value[selectedChannel.value]
    if (channel?.id == null) {
      showToast(withdrawCopy.channelMissing, 'error')
      return
    }
    passwordOpen.value = true
  }

  function closePassword() {
    if (submitting.value) return
    passwordOpen.value = false
  }

  async function submitCashOut(cashOutPwd: string) {
    if (submitting.value || cashOutPwd.length !== 6) return
    const channel = channels.value[selectedChannel.value]
    if (channel?.id == null || !amountOk.value) return
    const body = {
      channelId: Number(channel.id),
      walletType: cashOutWalletPlayer,
      amt: amountNumber.value,
      cashOutPwd,
      ...(bankCardId.value != null ? { bankCardId: bankCardId.value } : {}),
    }
    submitting.value = true
    try {
      await createCashOutOrder(body)
      showToast(withdrawCopy.passwordSuccess, 'success')
      passwordOpen.value = false
      clearAmount()
    } catch (error) {
      showToast(error instanceof Error ? error.message : String(error), 'error')
    } finally {
      submitting.value = false
    }
  }

  function closeFundTips() {
    fundTipsOpen.value = false
  }

  function markAssetPasswordSet() {
    mockSetAssetPassword()
    isAssetPassword.value = true
    fundTipsOpen.value = false
  }

  function resetErrors() {
    amountError.value = false
    nameError.value = false
    cpfError.value = false
  }

  return {
    channels,
    selectedChannel,
    amounts,
    placeholder,
    balanceCents,
    feeCents,
    amountReais,
    name,
    cpf,
    amountError,
    nameError,
    cpfError,
    overBalance,
    loaded,
    isAssetPassword,
    fundTipsOpen,
    passwordOpen,
    submitting,
    amountNumber,
    amountCents,
    selectedCents,
    chipDisabled,
    load,
    selectChannel,
    selectAmount,
    setAmount,
    clearAmount,
    setName,
    clearName,
    setCpf,
    clearCpf,
    requestCashOut,
    closePassword,
    submitCashOut,
    closeFundTips,
    markAssetPasswordSet,
    resetErrors,
  }
})
