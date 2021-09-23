import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { useAuth, useInactiveListener } from '@/hooks'
import { configs, getCookie } from '@/libs/cookies'
import { authService } from '@/services/auth.service'
import { Connectors } from '@/types/constants'
import { loader } from '@/utils'

export function UseEagerConnect() {
  // __STATE <Rect.Hooks>
  const router = useRouter()
  const { signin } = useAuth()
  const { account, active } = useWeb3React()
  useInactiveListener()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (!account || !active) {
      const connector: Connectors = getCookie(configs.CONNECTOR)
      if (connector) {
        signin(connector)
      }
    }
  }, [account, active, signin])

  useEffect(() => {
    async function run() {
      if (getCookie(configs.APP_AUTH)) {
        authService.getProfile()
      } else {
        const res = await authService.signin()
        if (res) router.push('/profile')
      }
    }

    if (account || active) {
      loader('on')
      run()
    }
  }, [account, active])

  // __RENDER
  return null
}
