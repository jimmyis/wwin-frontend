import { useState } from 'react'
import { RouterLink, MediaComponent } from '@/components'

export function LatestAssetsComponent() {
  // __STATE <React.Hooks>
  const [state] = useState([
    {
      id: 1,
      name: 'Gold Model',
      media: '/static/media/Garuda_Gold_Model.jpg',
      link: '/assets/0x8351057B11d48a02D138637C9386a7bCE72b0966',
      btnLabel: 'Buy Now',
    },
    {
      id: 2,
      name: 'White Gold Model',
      media: '/static/media/Garuda_Silver_Model.jpeg',
      link: '/assets/0xd1a21d267c5ae768ef9f75f38b16e03490c49e4e',
      btnLabel: 'Buy Now',
      external: false
    },
    {
      id: 3,
      name: 'Pink Gold Model',
      media: '/static/media/nft/garuda_v02-rose_gold-thumb_m.jpg',
      link: '#',
      btnLabel: 'Coming Soon',
    },
    {
      id: 4,
      name: 'Graphite Model',
      media: '/static/media/nft/garuda_v02-graphite-thumb_m.jpg',
      link: '#',
      btnLabel: 'Coming Soon',
    }
  ])

  // __RENDER
  return (
    <section className='ui--home-latest section'>
      <div className='ui--home-section-header'>
        <div className='title'>
          <h2 className='h2'>New items</h2>
        </div>
      </div>

      <div className='ui--home-latest-container'>
        {state.map((record) => (
          <article className='ui--article' key={record.id}>
            <div className='ui--article-body'>
              <MediaComponent media={record.media} />
            </div>

            <div className='ui--article-footer'>
              <RouterLink className='meta' href={record.link} useLink={record.external}>
                <div className='meta-rows'>
                  <div className='name'>{record.name}</div>
                </div>
              </RouterLink>

              <div className='annotations'>
                <RouterLink className='btn btn-primary' href={record.link} useLink={record.external}>
                  <span className='text'>{record.btnLabel}</span>
                </RouterLink>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
