import { Role } from '@/types/constants'

export type AuthAction = AuthActionTypes
export enum AuthActionTypes {
  SET_AUTH = 'SET_AUTH_AUTHENTICATED',
  SET_USER = 'SET_AUTH_USER_PROFILE'
}

export interface AuthActionInterface {
  type: AuthAction
  payload: any
}

export interface AuthState {
  address: string | null
  user: User | null
}

export interface User {
  uid: string
  role: Role
  avatar: string
  cover: string
  username: string
  name: string
  email?: string
  bio: string
  facebook?: string
  instagram?: string
  twitter?: string
  telegram?: string
}
