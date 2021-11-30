import { ContractAddress, ContractAbi } from './abi/BUSD'
import { build } from './common'


export const busdContract = {
  build(chainId: number): any {
    return build(ContractAbi, ContractAddress, chainId)
  },
  getAddress(chainId: string | number): string {
    return ContractAddress[chainId]
  }
}
