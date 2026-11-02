/**
 * Mock data for /security (Perfil -> Centro de Segurança).
 *
 * Copy and row states are the values on https://gc987.com/security at
 * 390x844x3. Account / phone reuse the fake perfil identifiers so nothing
 * that identifies a signed-in live account is stored here. Email starts
 * unbound (`Desvincular`); login password is set; asset password is not.
 */

export interface SecurityRow {
  key: string
  icon: string
  label: string
  /** Right-hand status. Empty string still occupies the value slot. */
  value: string
  /** `item-lines-inset` hairline under the row. Last row of a card is none. */
  lined: boolean
  /** Ionic `detail` chevron — phone, email, and both password rows have it. */
  detail: boolean
  /** First-page verify route. Bound phone has a chevron but does not navigate. */
  to?: string
}

export type SecurityVerifyVariant = 'password' | 'asset' | 'email'

export const securityCopy = {
  title: 'Centro de Segurança',
}

export const securityVerifyCopy = {
  title: 'Validação',
  loginHeading: 'Verificar senha de login',
  loginTip: 'Você pode definir uma nova senha após verificar sua senha de login',
  /** Live concatenates verifyPasswordBind + label.email with no space. */
  emailTip: 'Verificar senha de login para vincularE-mail',
  placeholder: 'Senha de Login',
  error: '6-16 caracteres',
  confirm: 'Confirmar',
}

export const securityBindCopy = {
  /** Live ion-title textContent at 390x844x3. */
  title: 'ValidaçãoNovoE-mail',
  heading: 'Confirmar novo endereço de email',
  placeholder: 'E-mail',
  error: 'E-mail inválido',
  confirm: 'Confirmar',
  success: 'Ligação bem-sucedida',
  tooLong: 'Por favor, insira no máximo 64 caracteres',
}

export const securityConfirmCopy = {
  title: 'Alterar Senha',
  heading: 'Confirmar nova senha',
  password: 'Senha',
  confirmPassword: 'Confirmar senha',
  confirm: 'Confirmar',
  mismatch: 'As senhas inseridas duas vezes não correspondem',
  success: 'Modificação bem-sucedida',
}

export const securityConfirmAssetCopy = {
  /** Live `$t('label.asset')`. */
  title: 'Saque Senha',
  /** Live `$t('main.set') + $t('label.assetsPassword')` with no space. */
  heading: 'ConfigurarSenha de Ativos',
  /** Live `$t('main.enter') + $t('viewsAssets.newAssetPassword')` with no space. */
  enter: 'EntrarNova senha de financiamento',
  /** Live `$t('main.confirm') + $t('viewsAssets.newAssetPassword')` with no space. */
  confirm: 'ConfirmarNova senha de financiamento',
  mismatch: 'As senhas inseridas duas vezes não correspondem',
  success: 'Configurado com sucesso',
}

/**
 * Live `Qd()` on `/security/confirm/password`. The painted fields have
 * no maxlength; submit still requires 6–16 with no whitespace.
 */
export function isValidConfirmPassword(value: string): boolean {
  return value.length >= 6 && value.length <= 16 && !/\s/.test(value)
}

/**
 * Live `Gb()` used by the security email field (`isSecurity` path).
 * Empty is not invalid; 1+ chars that fail this show "E-mail inválido".
 */
export function isValidSecurityEmail(value: string): boolean {
  const compact = value.replace(/\s/g, '')
  if (compact.length < 6 || compact.length > 64) return false
  const parts = compact.split('@')
  if (parts.length !== 2) return false
  const [local, domain] = parts
  return (
    /^[a-zA-Z0-9._\-+]+$/.test(local) &&
    /^[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/.test(domain) &&
    !local.startsWith('.') &&
    !local.endsWith('.') &&
    !local.includes('..')
  )
}

export function securityGroups(account: string, email = '', assetSet = false): SecurityRow[][] {
  const emailBound = Boolean(email)
  return [
    [
      { key: 'conta', icon: 'security-account', label: 'Conta', value: account, lined: true, detail: false },
      { key: 'telefone', icon: 'security-phone', label: 'Telefone', value: account, lined: true, detail: true },
      {
        key: 'email',
        icon: 'security-email',
        label: 'E-mail',
        value: emailBound ? email : 'Desvincular',
        lined: false,
        detail: true,
        to: emailBound ? undefined : '/security/verify/email',
      },
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
        value: assetSet ? 'Já definido' : 'não configurado',
        lined: false,
        detail: true,
        to: '/security/verify/asset',
      },
    ],
  ]
}
