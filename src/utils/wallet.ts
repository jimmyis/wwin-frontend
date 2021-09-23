import { configs, chian } from '@/libs/configs'
import { getRpcUrl } from '@/libs/web3'
import { capitalize } from '@/utils'

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export async function setNetwork(cb: (res: boolean) => void): Promise<void> {
  const { ethereum } = window

  if (ethereum?.request) {
    try {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chian.chianId.toString(16)}`,
            chainName: `Binance Smart Chain ${capitalize(chian.network)}`,
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18
            },
            rpcUrls: [getRpcUrl()],
            blockExplorerUrls: [chian.explorer]
          }
        ]
      })
      cb(true)
    } catch (error) {
      cb(false)
      console.error('Failed to setup the network in Metamask:', error)
    }
  } else {
    cb(false)
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
  }
}

export const registerToken = async (tokenAddress: string, tokenSymbol: string, tokenDecimals: number) => {
  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${configs.APP_BASE_URL}/static/images/${tokenSymbol.toLowerCase()}.png`
      }
    }
  })

  return tokenAdded
}
