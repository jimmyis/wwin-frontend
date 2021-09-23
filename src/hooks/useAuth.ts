import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import { configs, setCookie } from '@/libs/cookies'
import { authService } from '@/services/auth.service'
import { dialog, setNetwork } from '@/utils'
import { connectorsBy } from '@/utils/connectors'
import { Connectors } from '@/types/constants'
import { notification as notice } from 'antd'

export function useAuth() {
  // __STATE <Rect.Hooks>
  const { account, active, activate, deactivate } = useWeb3React()

  // __FUNCTIONS
  const signin = useCallback(
    async (connectorName: Connectors): Promise<void> => {
      const connector = connectorsBy[connectorName]

      if (!connector) {
        dialog({
          title: 'Unable to find connector',
          message: 'The connector config is wrong.'
        })

        return void 0
      }

      await activate(connector, (err: Error) => {
        if (err instanceof UnsupportedChainIdError) {
          setNetwork((res) => {
            if (res) activate(connector)
          })
        } else {
          const _alert = { message: err.name, description: err.message }

          if (err instanceof NoEthereumProviderError || err instanceof NoBscProviderError) {
            _alert.message = 'Provider Error'
            _alert.description = 'No provider was found.'
          } else if (err instanceof UserRejectedRequestError) {
            _alert.message = 'Connection Refused'
            _alert.description = 'Please authorize to access your account.'
          }

          notice.warn({ ..._alert, duration: 4 })
        }
      })

      setCookie(configs.CONNECTOR, connectorName)
    },
    [account, activate]
  )

  const signout = useCallback((): void => {
    deactivate()
    authService.logout()
  }, [deactivate])

  return { account, active, signin, signout }
}
