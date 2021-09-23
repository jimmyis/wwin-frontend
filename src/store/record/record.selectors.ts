import { StoreTypes } from '@/store'

export default {
  getCollections({ record: { collections } }: StoreTypes) {
    return collections
  }
}
