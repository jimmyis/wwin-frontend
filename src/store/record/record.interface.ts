export type RecordAction = RecordActionTypes
export enum RecordActionTypes {
  SET_COLLECT = 'SET_RECORD_COLLECTIONS'
}

export interface RecordActionInterface {
  type: RecordAction
  payload: any
}

export interface RecordState {
  collections: Collections[]
}

export interface Collections {
  id: string
  name: string
  logo: string
}
