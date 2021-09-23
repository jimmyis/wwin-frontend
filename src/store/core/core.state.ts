import { CoreState } from './core.interface'

export const initialState: CoreState = {
  company: 'Undefined Co., Ltd.',
  appVersion: 'v1.0-beta (Aug, 2021)',
  lang: 'en-US',
  theme: 'default',
  loader: {
    visible: false,
    text: 'rendering...'
  },
  dialog: {
    visible: false,
    type: 'alert',
    message: '',
    confirmLabel: 'OK',
    cancelLabel: 'Cancel'
  },
  modals: {
    visible: false,
    title: 'title',
    component: null
  }
}
