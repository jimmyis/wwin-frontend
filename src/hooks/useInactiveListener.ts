import { useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { configs, getCookie } from '@/libs/cookies'
import { authService } from '@/services/auth.service'
import { loader } from '@/utils'
import { BSChain } from '@/types/constants'
import { notification as notice } from 'antd'

export function useInactiveListener() {
  // __STATE <Rect.Hooks>
  const { account, active } = useWeb3React()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    const provider = window.ethereum
    if (provider) {
      const chainId = provider.chainId || provider.networkVersion
      if (chainId) {
        handleChainChange(chainId)
      }
    }

    if (account) notice.destroy()
  }, [account])

  useEffect(() => {
    const provider = window.ethereum

    if (provider?.on) {
      provider.on('chainChanged', handleChainChange)
      provider.on('accountsChanged', handleAccountsChange)

      return () => {
        provider.removeListener('chainChanged', handleChainChange)
        provider.removeListener('accountsChanged', handleAccountsChange)
      }
    }
  }, [active])

  // __FUNCTIONS
  const handleChainChange = useCallback((chainkId: string) => {
    const $bsc = [
      'Binance Smart Chain Network',
      'Binance Smart Chain Main Network',
      'Binance Testnet Smart Chain Network'
    ]

    if ([BSChain.Mainnet, BSChain.Testnet].indexOf(+chainkId) < 0) {
      notice.warn({
        duration: 0,
        message: 'Network warning.',
        description: `WWIN is only supported on ${$bsc[0]}. Please confirm you installed Metamask and selected ${$bsc[0]}`
      })
    }
    // if (isProduction && +chainkId === BSChain.Testnet) {
    //   notice.error({
    //     duration: 0,
    //     message: 'Network provider error!',
    //     description: `You are currently visiting the ${$bsc[2]}. Please change your metamask to access the ${$bsc[1]}`
    //   })
    // } else if (isDevelop && +chainkId === BSChain.Mainnet) {
    //   notice.error({
    //     duration: 0,
    //     message: 'Network provider error!',
    //     description: `You are currently visiting the ${$bsc[1]}. Please change your metamask to access the ${$bsc[2]}`
    //   })
    // }
  }, [])

  const handleAccountsChange = useCallback((accounts: string[]) => {
    if (accounts.length) {
      const currentAccount = getCookie(configs.USER_ADDRESS)
      if (currentAccount) {
        loader('on')
        if (currentAccount !== accounts[0]) {
          authService.signin()
        } else {
          authService.getProfile()
        }
      }
    } else {
      authService.logout()
    }
  }, [])

  return { account }
}
