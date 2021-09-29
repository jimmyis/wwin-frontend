import { RouterLink, MediaComponent, CurrencyComponent } from '@/components'
import { isDevelop } from '@/libs/configs'
import { NFTItem } from '@/types'

export interface Props {
  data: NFTItem
}

export function ArticleComponent({ data }: Props) {
  // __STATE <React.Hooks>
  const tokenAddress = data.id || data.tokenAddress
  const tokenId = data?.tokenId ? `?tokenId=${data.tokenId}` : ''

  // __RENDER
  return (
    <article className='ui--article'>
      <div className='ui--article-head'>
        <MediaComponent media={data.image} />
      </div>

      <div className='ui--article-body'>
        <RouterLink className='meta' href={`/assets/${tokenAddress}${tokenId}`}>
          <div className='meta-rows' title={data.name}>
            {isDevelop && <div className='desc'>Untitled Collection</div>}
            <div className='name'>{data.name}</div>
          </div>

          <div className='meta-rows'>
            <div className='label'>price</div>
            <CurrencyComponent currency={data.currency} amount={data.price} size='medium'>
              <small className='unit'>{data.currency}</small>
            </CurrencyComponent>
          </div>
        </RouterLink>
      </div>
    </article>
  )
}
