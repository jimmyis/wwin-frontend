import { useEffect, useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getRpcUrl } from '@/libs/web3'
import { ethers } from 'ethers'

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(getRpcUrl())

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
export function useActiveWeb3React() {
  // __STATE <React.Hooks>
  const { library, ...web3React } = useWeb3React()
  const [provider, setProvider] = useState(library || simpleRpcProvider)
  const refEth = useRef(library)

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library || simpleRpcProvider)
      refEth.current = library
    }
  }, [library])

  return { library: provider, ...web3React }
}
