import { CoreActionInterface, CoreActionTypes, Loader, Theme, Dialog, Modals } from './core.interface'

export default {
  setLanguage(payload: string): CoreActionInterface {
    return {
      type: CoreActionTypes.SET_LANG,
      payload
    }
  },

  setLoader(payload: Loader): CoreActionInterface {
    return {
      type: CoreActionTypes.SET_LOADER,
      payload
    }
  },

  setTheme(payload: Theme): CoreActionInterface {
    return {
      type: CoreActionTypes.SET_THEME,
      payload
    }
  },

  setDialog(payload: Dialog): CoreActionInterface {
    return {
      type: CoreActionTypes.SET_DIALOG,
      payload: {
        ...payload,
        type: payload?.type || 'alert',
        confirmLabel: payload?.confirmLabel || 'OK',
        cancelLabel: payload?.cancelLabel || 'Cancel',
        resolvePromise: payload?.resolvePromise,
        rejectPromise: payload?.rejectPromise
      }
    }
  },

  setModals(payload: Modals): CoreActionInterface {
    return {
      type: CoreActionTypes.SET_MODALS,
      payload
    }
  }
}
