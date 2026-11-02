import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  withdrawApi,
  withdrawAmounts,
  withdrawBalanceCents,
  withdrawFeeCents,
  withdrawMaxReais,
  withdrawMinReais,
  mockSetAssetPassword,
} from '../api/withdraw'

export const useWithdrawStore = defineStore('withdraw', () => {
  const amounts = ref<number[]>(withdrawAmounts)
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
    return Number.isInteger(n) && n >= withdrawMinReais && n <= withdrawMaxReais
  })

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

  async function load() {
    if (loaded.value) return
    const [am, bal, fee] = await Promise.all([
      withdrawApi.getAmounts(),
      withdrawApi.getBalance(),
      withdrawApi.getFee(),
    ])
    amounts.value = am
    balanceCents.value = bal
    feeCents.value = fee
    loaded.value = true
  }

  async function loadAssets() {
    const assets = await withdrawApi.getAssets()
    isAssetPassword.value = assets.passwordSwitch === 'ON' ? assets.isAssetPassword : true
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

  async function submit(): Promise<'tips' | 'invalid' | 'ok'> {
    await loadAssets()
    if (!isAssetPassword.value) {
      fundTipsOpen.value = true
      return 'tips'
    }
    amountError.value = !amountOk.value
    nameError.value = !nameOk.value
    cpfError.value = !cpfOk.value
    if (amountError.value || nameError.value || cpfError.value) return 'invalid'
    return 'ok'
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
    amounts,
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
    amountNumber,
    amountCents,
    selectedCents,
    chipDisabled,
    load,
    selectAmount,
    setAmount,
    clearAmount,
    setName,
    clearName,
    setCpf,
    clearCpf,
    submit,
    closeFundTips,
    markAssetPasswordSet,
    resetErrors,
  }
})
