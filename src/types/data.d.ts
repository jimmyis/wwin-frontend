export interface Collection<T = any[]> {
  id: string
  logo: string
  cover: string
  name: string
  description: string
  owner: string
  items: T
}

export interface SellTime {
  timestamp: number
  start: number
  end: number
}

export interface NFTItem {
  _id: string
  id: string
  tokenAddress: string
  tokenId: string
  tokenIds: number[]
  isClaim: boolean
  name: string
  collection_id: string
  description: string
  currency: string
  viewers: any[]
  priceHistory: any[]
  listing: any[]
  offer: any[]
  tradingHistory: any[]
  image: string
  price: string
  owner: string
  limit: number
  qrURL: string
  serial_no: number
  available: number
  totalSupply: number
  properties: NFTProperty[]
  is_presale: bool
  serialNoList?: [string]
  status?: string
  sell_type?: string
  marketplace_item_id?: string,
  contract_address: string,
  current_market_session: number,
  sell_time: SellTime | null
}

export interface NFTProperty {
  image?: File
  label: string
  value: string
}
