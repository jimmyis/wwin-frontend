import { ethers } from 'ethers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import { chain } from '@/libs/configs'
import { Connectors } from '@/types/constants'

const supportedChainIds = [chain.chainId]

export const injected = new InjectedConnector({ supportedChainIds })
export const bsc = new BscConnector({ supportedChainIds })

export const connectorsBy: { [connector in Connectors]: any } = {
  [Connectors.Injected]: injected,
  [Connectors.BSC]: bsc
}

export function getLibrary(provider: any) {
  const library = new ethers.providers.Web3Provider(provider)
  library.pollingInterval = 9600
  return library
}
