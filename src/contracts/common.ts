import { ContractFactory } from '@/libs/web3'
import { AbiItem } from '@/libs/web3'

import { Contract, ContractSendMethod as ContractMethod } from '@/libs/web3'
import { ContractMethods, ContractEvents } from '@/types/contract'

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
  
export function build(contractAbi:  AbiItem[], contractAddress: any, chainId: number | undefined): IContract {
    const _contractAddress = contractAddress[chainId || 97]
    return ContractFactory(contractAbi, _contractAddress)
}
