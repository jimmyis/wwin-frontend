import { useState, useEffect } from 'react'
import { RouterLink, MediaComponent, CurrencyComponent } from '@/components'
// import { isDevelop } from '@/libs/configs'
import { NFTItem } from '@/types'

export interface NFTMarketplaceItem {
    serial_no?: number | string
    nft_item: NFTItem
    nft_marketplace_item: any
    marketplace_item_id: string
    nft_marketplace_session?: any
}

export interface Props {
  data: NFTMarketplaceItem
}

export function ItemCardAuctionComponent({ data }: Props) {
  const [ quotes, setQuotes ] = useState<any[]>([])
  // __STATE <React.Hooks>
  useEffect(() => {
    const _quotes = data?.nft_marketplace_session?.quotes
    const quotes_ = Object.keys(_quotes).map((key: string) => _quotes[key]);
    if (quotes_.length > 0) {
      setQuotes(quotes_)
    }
  }, [data.nft_marketplace_session])

  // __RENDER
  return (
    <article className='ui--article'>
      <div className='ui--article-head'>
        <MediaComponent media={data?.nft_item.image} />
      </div>

      <div className='ui--article-body'>
        <RouterLink className='meta' href={`/marketplace/item/${data?.marketplace_item_id}`}>
        <div className='name'>{data?.nft_item?.name}</div>
        <div className='meta-rows' title={data.nft_item.name}>
          <div className="">Token Id # {data?.serial_no}</div>
          <div className='name'>{data.nft_marketplace_item.sell_type}</div>
        </div>
          <div className='meta-rows'>
            <div className='label'>price</div>
            <CurrencyComponent currency={quotes[0]?.symbol} amount={quotes[0]?.amount} size='medium'>
              <small className='unit'>{quotes[0]?.symbol}</small>
            </CurrencyComponent>
          </div>
        </RouterLink>
      </div>
    </article>
  )
}
