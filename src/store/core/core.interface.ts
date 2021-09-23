import { DialogOptions, ModalOptions } from '@/types'

export type CoreAction = CoreActionTypes
export enum CoreActionTypes {
  SET_LANG = 'SET_CORE_LANGUAGE',
  SET_LOADER = 'SET_CORE_LOADER',
  SET_THEME = 'SET_CORE_THEME',
  SET_DIALOG = 'SET_CORE_DIALOG',
  SET_MODALS = 'SET_CORE_MODALS'
}

export interface CoreActionInterface {
  type: CoreAction
  payload: any
}

export interface CoreState {
  company: string
  appVersion: string
  lang: string
  theme: Theme
  loader: Loader
  dialog: Dialog
  modals: Modals
}

export type Theme = 'default' | 'light' | 'dark'

export interface Loader {
  visible: boolean
  text: string
}

export interface Dialog extends DialogOptions {
  visible: boolean
}

export interface Modals extends ModalOptions {
  visible: boolean
}
