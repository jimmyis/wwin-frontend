import { Contract } from '@/libs/web3'
import { ContractFactory } from '@/libs/web3'
import { ContractMethods, ContractEvents } from '@/types/contract'
import { ContractAddress, ContractAbi } from './abi/SWAP'

export interface IMethods extends ContractMethods {
    [x: string]: any
}

export interface IEvents extends ContractEvents { }

export interface IContract extends Contract {
    methods: IMethods
    events: IEvents
}

export const swapContract = {
    build(): IContract {
        return ContractFactory(ContractAbi, ContractAddress)
    },

    getAddress(): string {
        return ContractAddress
    }
}
