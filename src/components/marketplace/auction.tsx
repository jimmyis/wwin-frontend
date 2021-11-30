import { RouterLink, MediaComponent, CurrencyComponent } from '@/components'
// import { isDevelop } from '@/libs/configs'
import { NFTItem } from '@/types'

export interface NFTMarketplaceItem {
    nft_item: NFTItem
    nft_marketplace_item: any
    marketplace_item_id: string
}

export interface Props {
  data: NFTMarketplaceItem
}

export function ItemCardAuctionComponent({ data }: Props) {
  // __STATE <React.Hooks>
  // __RENDER
  return (
    <article className='ui--article'>
      <div className='ui--article-head'>
        <MediaComponent media={data?.nft_item.image} />
        <div className='name'>{data.nft_marketplace_item.sell_type}</div>
        <div className="">Token Id</div>
      </div>

      <div className='ui--article-body'>
        <RouterLink className='meta' href={`/marketplace/item/${data?.marketplace_item_id}`}>
          <div className='meta-rows' title={data.nft_item.name}>
            {/* { isDevelop && <div className='desc'>Untitled Collection</div>} */}
            <div className='label'># {data.nft_item.serialNoList?.join(", ")}</div>
            <div className='name'>{data.nft_item.name}</div>
          </div>

          <div className='meta-rows'>
            <div className='label'>price</div>
            <CurrencyComponent currency={data.nft_marketplace_item?.currency} amount={data.nft_marketplace_item?.price} size='medium'>
              <small className='unit'>{data.nft_marketplace_item?.currency}</small>
            </CurrencyComponent>
          </div>
        </RouterLink>
      </div>
    </article>
  )
}
