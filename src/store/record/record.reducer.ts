import { RecordState, RecordActionTypes, RecordActionInterface } from './record.interface'
import { initialState } from './record.state'

export default function AuthReducer(state = initialState, { type, payload }: RecordActionInterface): RecordState {
  switch (type) {
    case RecordActionTypes.SET_COLLECT:
      state.collections = payload
      break
  }

  return state
}
