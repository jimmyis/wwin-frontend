import { MediaComponent } from '@/components'
import { NFTItem } from '@/types'

export interface Props {
  data: NFTItem
}

export function NFTitemDisplay({ data }: Props) {

  // __RENDER
  return (
    <article className='ui--article'>
      <div className='ui--article-head'>
        <MediaComponent media={data.image} />
      </div>

      <div className='ui--article-body'>
      </div>
    </article>
  )
}
