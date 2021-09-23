import { StoreTypes } from '@/store'

export default {
  getCompony({ core: { company } }: StoreTypes) {
    return company
  },

  getAppVersion({ core: { appVersion } }: StoreTypes) {
    return appVersion
  },

  getLanguage({ core: { lang } }: StoreTypes) {
    return lang
  },

  getLoader({ core: { loader } }: StoreTypes) {
    return loader
  },

  getTheme({ core: { theme } }: StoreTypes) {
    return theme
  },

  getDialog({ core: { dialog } }: StoreTypes) {
    return dialog
  },

  getModals({ core: { modals } }: StoreTypes) {
    return modals
  }
}
