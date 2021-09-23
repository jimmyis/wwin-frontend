import { useState } from 'react'
import { MediaComponent } from '@/components'

export function LatestAssetsComponent() {
  // __STATE <React.Hooks>
  const [state] = useState([
    {
      id: 1,
      name: 'Gold Model',
      media: '/static/media/Garuda_Gold_Model.jpg',
      link: 'https://wwin-reserve.web.app',
      btnLabel: 'Purchase'
    },
    {
      id: 2,
      name: 'White Gold Model',
      media: '/static/media/Garuda_Silver_Model.jpeg',
      link: 'https://stake.winwinwintoken.com/garuda-white-gold',
      btnLabel: 'Stake'
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
              <a className='meta' href={record.link}>
                <div className='meta-rows'>
                  <div className='name'>{record.name}</div>
                </div>
              </a>

              <div className='annotations'>
                <a className='btn btn-primary' href={record.link}>
                  <span className='text'>{record.btnLabel}</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
