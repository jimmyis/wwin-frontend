import { RouterLink } from '@/components'

export function CollectionComponent() {
  // __RENDER
  return (
    <section className='ui--home-collection section'>
      <div className='ui--home-section-header'>
        <div className='title'>
          <h2 className='h2'>Collections</h2>
          <p className='desc'>Generate Lorem Ipsum placeholder text.</p>
        </div>

        <div className='action'>
          <RouterLink className='btn btn-secondary btn-view' href='/marketplace'>
            <span className='text'>view all</span>
          </RouterLink>
        </div>
      </div>

      <div className='ui--home-collection-container'>
        {/* {Array.from({ length: 4 })
          .fill(null)
          .map((_, index) => (
            <CollectComponent key={index} />
          ))} */}
      </div>
    </section>
  )
}
