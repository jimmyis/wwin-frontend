import { configs, setCookie } from '@/libs/cookies'
import { AuthState, AuthActionTypes, AuthActionInterface } from './auth.interface'
import { initialState } from './auth.state'

export default function AuthReducer(state = initialState, { type, payload }: AuthActionInterface): AuthState {
  switch (type) {
    case AuthActionTypes.SET_AUTH:
      state.address = payload
      break

    case AuthActionTypes.SET_USER:
      state.user = { ...state.user, ...payload }
      setCookie(configs.USER_INFO, state.user || {})
      break
  }

  return state
}
