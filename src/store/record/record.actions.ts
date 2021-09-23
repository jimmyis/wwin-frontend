import { RecordActionInterface, RecordActionTypes, Collections } from './record.interface'

export default {
  setCollections(payload: Collections[]): RecordActionInterface {
    return {
      type: RecordActionTypes.SET_COLLECT,
      payload
    }
  }
}
