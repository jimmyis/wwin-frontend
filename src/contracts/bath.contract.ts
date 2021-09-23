import { Contract, ContractSendMethod as ContractMethod } from '@/libs/web3'
import { ContractFactory } from '@/libs/web3'
import { ContractMethods, ContractEvents } from '@/types/contract'
import { ContractAddress, ContractAbi } from './abi/BATH'

export interface IMethods extends ContractMethods {
  minter(): ContractMethod
  transferMintership(newMinter: string): ContractMethod
}

export interface IEvents extends ContractEvents {
  MintershipTransferred(previousMinter: string, newMinter: string): ContractMethod
}

export interface IContract extends Contract {
  methods: IMethods
  events: IEvents
}

export const bathContract = {
  build(): IContract {
    return ContractFactory(ContractAbi, ContractAddress)
  },

  getAddress(): string {
    return ContractAddress
  }
}
