import axios from '@/libs/axios'
import { configs, getCookie } from '@/libs/cookies'
import { getSignature } from '@/libs/web3'
import { createFormData, getFileListAt, getIpfs, uploadToIPFS } from '@/utils'
import { FormMintNFT } from '@/types'

export const assetService = {
  /**
   * GET all items with filters.
   */
  async getAll(query?: any): Promise<any> {
    const res = await axios.get('/handleMarketPlace/api/market_place/get/filter', {
      params: query
    })

    if (res) return res.data

    return void 0
  },

  /**
   * GET nft item by `tokenAddress`
   *
   * @param {string} tokenAddress NFT Token address
   */
  async getOne(tokenAddress: string): Promise<any> {
    const res = await axios.get(`/handleCollections/api/collection/findOne/${tokenAddress}`)
    if (res) return res.data

    return void 0
  },

  /**
   * GET nft item by query.
   *
   * @param {object} params
   */
  async getOneByQuery(params: any): Promise<any> {
    const res = await axios.get('/handleCollections/api/collection/get/ownerNFT', {
      params: {
        ...params,
        ownerAddress: getCookie(configs.USER_ADDRESS)
      }
    })
    if (res) return res.data

    return void 0
  },

  /**
   * Upload and Mint new NFT.
   *
   * @param {object} formData
   */
  async create({ image, ...form }: FormMintNFT): Promise<any> {
    if (form.properties?.length) {
      for await (const property of form.properties) {
        if (property.image) {
          const token = await uploadToIPFS(property.image)
          property.image = getIpfs(token) as any
        } else {
          continue
        }
      }
    }

    const [formData, headers] = createFormData({
      data: JSON.stringify(form),
      image: getFileListAt(image)
    })
    const res = await axios.post('/handleCollections/api/collection/create/item', formData, { headers })
    if (res) return res.data

    return void 0
  },

  /**
   * SET transaction.
   *
   * @param transactionHash
   * @returns
   */
  async buy(form: any): Promise<any> {
    const res = await axios.post('handleTransaction/api/transaction/save/address', form)
    if (res) return res.data

    return void 0
  },

  /**
   * Sign to Mint new NFT.
   *
   * @param {string} address Wallet Adress
   */
  async getSignature(address?: string): Promise<any> {
    const _address = address || getCookie(configs.USER_ADDRESS)
    const signature = await getSignature('Owner: Sign for Mint new NFT.', _address)
    if (signature) return signature

    return void 0
  }
}
