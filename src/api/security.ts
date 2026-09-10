/**
 * Mock data for /security (Perfil -> Centro de Segurança).
 *
 * Copy and row states are the values on https://gc987.com/security at
 * 390x844x3. Account / phone reuse the fake perfil identifiers so nothing
 * that identifies a signed-in live account is stored here. Email is unbound
 * (`Desvincular`); login password is set; asset password is not.
 */

export interface SecurityRow {
  key: string
  icon: string
  label: string
  /** Right-hand status. Empty string still occupies the value slot. */
  value: string
  /** `item-lines-inset` hairline under the row. Last row of a card is none. */
  lined: boolean
  /** Ionic `detail` chevron — only the two password rows have it. */
  detail: boolean
  /** First-page verify route. Only the password rows navigate. */
  to?: string
}

export const securityCopy = {
  title: 'Centro de Segurança',
}

export const securityVerifyCopy = {
  title: 'Validação',
  loginHeading: 'Verificar senha de login',
  loginTip: 'Você pode definir uma nova senha após verificar sua senha de login',
  placeholder: 'Senha de Login',
  error: '6-16 caracteres',
  confirm: 'Confirmar',
}

export function securityGroups(account: string): SecurityRow[][] {
  return [
    [
      { key: 'conta', icon: 'security-account', label: 'Conta', value: account, lined: true, detail: false },
      { key: 'telefone', icon: 'security-phone', label: 'Telefone', value: account, lined: true, detail: false },
      { key: 'email', icon: 'security-email', label: 'E-mail', value: 'Desvincular', lined: false, detail: false },
    ],
    [
      {
        key: 'login',
        icon: 'security-login',
        label: 'Senha de Login',
        value: 'Já definido',
        lined: true,
        detail: true,
        to: '/security/verify/password',
      },
      {
        key: 'asset',
        icon: 'security-asset',
        label: 'Senha de Ativos',
        value: 'não configurado',
        lined: false,
        detail: true,
        to: '/security/verify/asset',
      },
    ],
  ]
}
