import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Local security-center state. Bind-email is mock-only and never posts
 * to gc987.com; an empty email is the live "Desvincular" row.
 */
export const useSecurityStore = defineStore('security', () => {
  const email = ref('')
  const assetPasswordSet = ref(false)

  function bindEmail(value: string) {
    email.value = value.replace(/\s/g, '')
  }

  function setAssetPassword() {
    assetPasswordSet.value = true
  }

  return { email, assetPasswordSet, bindEmail, setAssetPassword }
})
