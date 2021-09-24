import { useState } from 'react'
import { isDevelop } from '@/libs/configs'
import { RouterLink, MediaComponent } from '@/components'

export function LatestAssetsComponent() {
  // __STATE <React.Hooks>
  const [state] = useState([
    {
      id: 1,
      name: 'Paramesuan Garuda Gold Model',
      media: '/static/media/Garuda_Gold_Model.jpg',
      link: isDevelop ? '/marketplace' : '/assets/0x7d7593f5CB0f67a3Fa14Daf063E93d3D4aB3076e',
      btnLabel: 'Purchase',
      external: false
    },
    {
      id: 2,
      name: 'White Gold Model',
      media: '/static/media/Garuda_Silver_Model.jpeg',
      link: 'https://stake.winwinwintoken.com/garuda-white-gold',
      btnLabel: 'Stake',
      external: true
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
