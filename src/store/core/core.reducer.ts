import { CoreState, CoreActionTypes, CoreActionInterface } from './core.interface'
import { initialState } from './core.state'

export default function CoreReducer(state = initialState, { type, payload }: CoreActionInterface): CoreState {
  switch (type) {
    case CoreActionTypes.SET_LANG:
      state.lang = payload
      break

    case CoreActionTypes.SET_LOADER:
      state.loader = payload
      break

    case CoreActionTypes.SET_THEME:
      state.theme = payload
      break

    case CoreActionTypes.SET_DIALOG:
      state.dialog = payload
      break

    case CoreActionTypes.SET_MODALS:
      state.modals = { ...state.modals, ...payload }
      break
  }

  return state
}
