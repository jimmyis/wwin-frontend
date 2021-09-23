import axios from '@/libs/axios'
import { configs, getCookie } from '@/libs/cookies'
import { FormSubscribe } from '@/types'

export const userService = {
  /**
   * GET all users.
   */
  async findAll(): Promise<any> {
    const res = await axios.get('/users')

    return res?.data
  },

  /**
   * GET user by userId.
   *
   * @param {number} userId
   */
  async findById(userId: number): Promise<any> {
    const res = await axios.get(`/users/${userId}`)

    return res?.data
  },

  /**
   * GET user profile.
   *
   * @param {string} uid Wallet Address
   */
  async getTransactions(address?: string): Promise<any> {
    const _address = address || getCookie(configs.USER_ADDRESS)
    const res = await axios.get('/handleTransaction/api/transaction/get/user/transactions', {
      params: {
        ownerAddress: _address
      }
    })

    if (res) {
      return res.data.map((r: any) => ({
        tokenAddress: r.NFTAddress,
        tokenId: r.tokenId,
        name: r.nftData.name,
        image: r.nftData.image,
        currency: r.tokenAddress,
        price: r.price
      }))
    }

    return void 0
  },

  /**
   * User subscribe.
   *
   * @param {object} form FormSubscribe
   */
  async subscribe(form: FormSubscribe): Promise<any> {
    const res = await axios.post('/handleMarketPlace/api/landing/email-listing', form)

    return res?.data
  }
}
