import { AuthActionInterface, AuthActionTypes } from './auth.interface'

export default {
  setAuthenticated(payload: string): AuthActionInterface {
    return {
      type: AuthActionTypes.SET_AUTH,
      payload
    }
  },

  setUserProfile(payload: any): AuthActionInterface {
    return {
      type: AuthActionTypes.SET_USER,
      payload
    }
  }
}
