import { ContractAddress, ContractAbi } from './abi/WWIN'

import { build } from './common'

export const wwinContract = {
  build(chainId: number): any {
    return build(ContractAbi, ContractAddress, chainId)
  },
  getAddress(chainId: string | number): string {
    return ContractAddress[chainId]
  }
}
