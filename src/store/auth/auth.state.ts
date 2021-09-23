import { configs, getCookie } from '@/libs/cookies'
import { AuthState } from './auth.interface'

const getUserAddress = getCookie(configs.USER_ADDRESS)
const getUserInfo = getCookie(configs.USER_INFO, true)

export const initialState: AuthState = {
  address: getUserAddress || null,
  user: getUserInfo || null
}
