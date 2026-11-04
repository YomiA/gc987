import { request } from './http'
import { getEndpointIfGranted } from '../composables/usePushNotification'
import { getDeviceId } from '../utils/deviceId'
import { readInviteCode } from '../utils/inviteCode'
import { detectLoginChanel } from '../utils/loginChanel'
import { md5 } from '../utils/md5'

export interface LoginData {
  token: string
  refreshToken: string
  userId: number
}

export interface LoginResponse {
  code: number
  msg?: string
  message?: string
  data?: Partial<LoginData>
}

/** Password is MD5. `loginChanel` is 0 web, 1 app, 2 PWA. */
export function login(account: string, password: string) {
  return request<LoginResponse>('/login', {
    method: 'POST',
    auth: false,
    body: {
      account,
      password: md5(password),
      loginChanel: detectLoginChanel(),
    },
  })
}

/** 1 email, 2 phone, 3 account. Same split as abc.com. */
function accountTypeOf(account: string): 1 | 2 | 3 {
  const value = account.trim()
  if (value.includes('@')) return 1
  if (/^\d+$/.test(value)) return 2
  return 3
}

/**
 * Password stays plaintext, same as the other sites.
 * The dial code is fixed at +55. `regChannel` matches login: 0 web, 1 app, 2 PWA.
 * `endpoint` is sent only when push is already allowed.
 */
export async function register(phone: string, password: string) {
  const inviteCode = readInviteCode()
  const regChannel = detectLoginChanel()
  const regDeviceId = await getDeviceId()
  const endpoint = await getEndpointIfGranted()
  const accountType = accountTypeOf(phone)
  return request<LoginResponse>('/register', {
    method: 'POST',
    auth: false,
    body: {
      accountType,
      account: phone,
      password,
      regDeviceId,
      ...(inviteCode ? { inviteCode } : {}),
      ...(accountType === 1 ? { email: phone } : {}),
      ...(accountType === 2 ? { phone } : {}),
      areaCode: '+55',
      regChannel,
      ...(endpoint ? { endpoint } : {}),
    },
  })
}
