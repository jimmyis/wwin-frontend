import { Contract } from '@/libs/web3'
import { ContractFactory } from '@/libs/web3'
import { ContractMethods, ContractEvents } from '@/types/contract'
import { ContractAddress, ContractAbi } from './abi/WWIN'

export interface IMethods extends ContractMethods {}

export interface IEvents extends ContractEvents {}

export interface IContract extends Contract {
  methods: IMethods
  events: IEvents
}

export const wwinContract = {
  build(): IContract {
    return ContractFactory(ContractAbi, ContractAddress)
  },

  getAddress(): string {
    return ContractAddress
  }
}
