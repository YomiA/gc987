import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Which bind page the password check just unlocked. A refresh clears it,
 * so the bind form cannot be opened on its own.
 */
export type SecurityBindTarget = '' | 'phone' | 'email'

export const useSecurityStore = defineStore('security', () => {
  const email = ref('')
  const phone = ref('')
  const assetPasswordSet = ref(false)
  const bindTarget = ref<SecurityBindTarget>('')

  function allowBind(target: Exclude<SecurityBindTarget, ''>) {
    bindTarget.value = target
  }

  function bindEmail(value: string) {
    email.value = value.replace(/\s/g, '')
    bindTarget.value = ''
  }

  function bindPhone(value: string) {
    phone.value = value
    bindTarget.value = ''
  }

  function setAssetPassword() {
    assetPasswordSet.value = true
  }

  return {
    email,
    phone,
    assetPasswordSet,
    bindTarget,
    allowBind,
    bindEmail,
    bindPhone,
    setAssetPassword,
  }
})
