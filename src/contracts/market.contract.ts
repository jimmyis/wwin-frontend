import { Contract, ContractSendMethod as ContractMethod } from '@/libs/web3'
import { ContractFactory } from '@/libs/web3'
import { ContractAddress, ContractAbi } from './abi/MARKET'

export interface NFTSell {
  ownerAddress: string
  tokenAddress: string
  NFTAddress: string
  tokenId: number
  price: number
}

export interface IMethods {
  buy(tokenAddress: string, tokenId: string): ContractMethod
  buyWithBNB(tokenAddress: string, tokenId: string): ContractMethod
  cancel(tokenAddress: string, tokenId: number): ContractMethod
  getItem(tokenAddress: string, tokenId: number): ContractMethod
  getKey(tokenAddress: string, tokenId: number): ContractMethod
  onERC721Received(): ContractMethod
  owner(): ContractMethod
  sell(items: NFTSell[]): ContractMethod
  sellItem(
    ownerAddress: string,
    tokenAddress: string,
    NFTAddress: string,
    tokenId: number,
    price: number
  ): ContractMethod
}

export interface IEvents {
  OwnershipTransferred(previousOwner: string, newOwner: string): ContractMethod
}

export interface IContract extends Contract {
  methods: IMethods
  events: IEvents
}

export const marketContract = {
  build(): IContract {
    return ContractFactory(ContractAbi, ContractAddress)
  },

  getAddress(): string {
    return ContractAddress
  }
}
