import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { collectionService } from '@/services/collection.service'
import { RouterLink, CollectComponent, Loading } from '@/components'
import { useRole } from '@/hooks'
import { Collection } from '@/types'
import cls from 'classnames'

export default function CollectionContainer() {
  // __STATE <React.Hooks>
  const { account, /* chainId */ } = useWeb3React()
  const { isUser } = useRole()
  const [state, setState] = useState<Collection[]>([])

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (account) fetchAll(account)
  }, [account])

  // __FUNCTIONS
  const fetchAll = useCallback(async (account: string): Promise<void> => {
    const res = await collectionService.getAll(account)
    if (res) setState(res)
  }, [])

  // __RENDER
  return (
    <div className={cls('ui--collect', 'router-view', { disabled: !state.length })}>
      <div className='ui--collect-header'>
        <div className='title'>
          <h1 className='h1'>my collections</h1>
          <p className='desc'>Create, curate, and manage collections of unique NFTs to share and sell.</p>
        </div>

        {!isUser && (
          <RouterLink className='btn btn-primary btn-create' href='/collections/create'>
            <span className='text'>Create a collection</span>
          </RouterLink>
        )}
      </div>

      {state.length ? (
        <div className='ui--collect-body grid'>
          {state.map((record, index) => (
            <div key={index}>
              <CollectComponent data={record} />
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}
