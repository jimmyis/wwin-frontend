import { RouterLink } from '@/components'
import { getShortAddress } from '@/utils'
import { Collection } from '@/types'

export interface Props {
  data: Collection
}

export function CollectComponent({ data }: Props) {
  // __RENDER
  return (
    <RouterLink href={`/collections/${data.id}`}>
      <div className='ui--collect-card'>
        <div className='ui--collect-card-banner'>
          <img className='image' src={data.cover} />
        </div>

        <div className='ui--collect-card-content'>
          <img className='logo' src={data.logo} />
          <div className='name'>{data.name}</div>
          <div className='creator'>
            by <b>{getShortAddress(data.owner)}</b>
          </div>
          <p className='desc'>{data.description}</p>
          <p className='item'>{data.items.length} items</p>
        </div>
      </div>
    </RouterLink>
  )
}
