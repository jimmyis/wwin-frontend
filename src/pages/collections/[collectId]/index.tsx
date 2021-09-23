import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { RouterLink, ArticleComponent, Loading } from '@/components'
import { collectionService } from '@/services/collection.service'
import { Collection } from '@/types'

export default function ViewCollectionContainer() {
  // __STATE <React.Hooks>
  const router = useRouter()
  const [state, setState] = useState<Collection>()
  const hasItems = Boolean(state?.items.length)

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    const { collectId }: any = router.query
    if (collectId) {
      fetchOne(collectId)
    }
  }, [router])

  // __FUNCTIONS
  const fetchOne = useCallback(async (id: string): Promise<void> => {
    const res = await collectionService.getOne(id)
    if (res) setState(res)
  }, [])

  // __RENDER
  if (!state) return <Loading />
  return (
    <div className='ui--collect router-view'>
      <div className='ui--collect-view'>
        <div className='ui--collect-view-header'>
          <div className='collect-cover'>
            <img className='image' src={state.cover} />
          </div>

          <div className='collect-info'>
            <div className='collect-logo'>
              <img className='image' src={state.logo} />
            </div>

            <div className='collect-name'>{state.name}</div>

            <div className='collect-stats'>
              <div className='column'>
                <div className='value'>{state.items.length}</div>
                <div className='label'>items</div>
              </div>

              <div className='column'>
                <div className='value'>0</div>
                <div className='label'>owners</div>
              </div>

              <div className='column'>
                <div className='value'>
                  <img className='icon' src='/static/images/weth.svg' />
                  <span className='text'>--</span>
                </div>
                <div className='label'>floor price</div>
              </div>

              <div className='column'>
                <div className='value'>
                  <img className='icon' src='/static/images/weth.svg' />
                  <span className='text'>--</span>
                </div>
                <div className='label'>volume traded</div>
              </div>
            </div>

            <div className='collect-desc'>{state.description}</div>
          </div>

          <div className='collect-action'>
            <button className='btn btn-overlay btn-edit' disabled title='Edit'>
              <span className='icon bi bi-pencil'></span>
            </button>

            <RouterLink className='btn btn-primary btn-add' href={`/assets/create?collectId=${state.id}`}>
              <span className='text'>add item</span>
            </RouterLink>
          </div>
        </div>

        {hasItems ? (
          <div className='ui--collect-view-body'>
            {state.items.map((record, index) => (
              <ArticleComponent data={record} key={index} />
            ))}
          </div>
        ) : (
          <div className='ui--collect-view-empty'>
            <div className='is-empty'>
              <span className='icon bi bi-folder-x'></span>
              <p className='text'>No items found in collection.</p>
              <RouterLink className='btn btn-default' href={`/assets/create?collectId=${state.id}`}>
                add item
              </RouterLink>
            </div>
          </div>
        )}

        <div className='ui--collect-view-footer'>
          {hasItems && (
            <button className='btn btn-primary btn-load' disabled>
              <span className='text'>load more</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
