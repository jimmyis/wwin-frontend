
import { ContractAddress, ContractAbi } from './abi/BATH'
import { build } from './common'


export const bathContract = {
  build(chainId: number): any {
    return build(ContractAbi, ContractAddress, chainId)
  },
  getAddress(chainId: string | number): string {
    return ContractAddress[chainId]
  }
}
