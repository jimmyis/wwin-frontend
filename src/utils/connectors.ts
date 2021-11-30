import { ethers } from 'ethers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { allowChains } from '@/libs/configs'
import { Connectors } from '@/types/constants'

export const injected = new InjectedConnector({ supportedChainIds: allowChains })
export const bsc = new BscConnector({ supportedChainIds: allowChains })

// console.log("allowChains", allowChains)

export const connectorsBy: { [connector in Connectors]: any } = {
  [Connectors.Injected]: injected,
  [Connectors.BSC]: bsc
}

export function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 9600
  return library
}
