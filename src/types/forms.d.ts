import { NFTProperty } from './data'

export interface QueryParams {
  page: number
  limit: number
}

export interface FormMarketplaceFilters {
  search?: string
  status?: string[]
  minPrice?: string
  maxPrice?: string
  collection?: string[]
  categories?: string[]
  sortBy?: string
}

export interface FormProfile {
  file?: File
  name?: string
  email?: string
  bio?: string
  facebook?: string
  instagram?: string
  twitter?: string
  telegram?: string
}

export interface FormCollection {
  owner: string
  logo?: FileList | File
  cover?: FileList | File
  name?: string
  description?: string
}

export interface FormMintNFT {
  signature?: string
  owner?: string
  image: FileList
  poster?: FileList
  status?: string
  name: string
  description?: string
  collection_id?: string
  properties?: NFTProperty[]
  categories?: string[]
  price: number
  currency?: string
  totalSupply: number
  excludes?: number[]
  qrURL?: any[]
}

export interface FormSubscribe {
  email: string
}
