import { ContractAddress, ContractAbi } from './abi/SWAP'
import { build } from './common'

export const swapContract = {
    build(chainId: number): any {
      return build(ContractAbi, ContractAddress, chainId)
    },
    getAddress(chainId: string | number): string {
      return ContractAddress[chainId]
    }
}
