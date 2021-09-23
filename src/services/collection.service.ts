import axios from '@/libs/axios'
import { configs, getCookie } from '@/libs/cookies'
import { dispatch, recordActions } from '@/store'
import { createFormData } from '@/utils'
import { FormCollection } from '@/types'

export const collectionService = {
  /**
   * GET collection by `id`
   */
  async getOne(id: string): Promise<any> {
    const res = await axios.get(`/handleCollections/api/collection/findOne/${id}`)
    if (res) {
      const { item, ...data } = res.data
      return { ...data, items: item }
    }

    return void 0
  },

  /**
   * GET collections all by `address`
   *
   * @param {string} address Wallet Addess
   */
  async getAll(address: string): Promise<any> {
    const res = await axios.get(`/handleCollections/api/collections/findAll/${address}`)
    if (res) return res.data

    return void 0
  },

  /**
   * GET collections all by `address`
   *
   * @param {string} address Wallet Addess
   */
  async getLists(address?: string): Promise<any> {
    const _address = address || getCookie(configs.USER_ADDRESS)
    const res = await axios.get('/handleCollections/api/collections/get/list', {
      params: {
        ownerId: _address
      }
    })

    if (res) {
      const action = recordActions.setCollections(res.data)
      dispatch(action)
      return res.data
    }

    return void 0
  },

  /**
   * CREATE new collection.
   *
   * @param {object} form Form create collection
   */
  async create(form: FormCollection): Promise<any> {
    const [formData, headers] = createFormData(form)
    const res = await axios.post('/handleCollections/api/collection/create', formData, { headers })
    if (res) return res.data

    return void 0
  }
}
