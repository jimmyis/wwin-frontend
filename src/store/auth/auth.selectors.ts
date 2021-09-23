import { StoreTypes } from '@/store'

export default {
  getAuthenticated({ auth: { address, user } }: StoreTypes) {
    return address && user
  },

  getAddress({ auth: { address } }: StoreTypes) {
    return address
  },

  getUser({ auth: { user } }: StoreTypes) {
    return user
  }
}
