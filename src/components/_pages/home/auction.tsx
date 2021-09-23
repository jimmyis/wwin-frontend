import { RouterLink } from '@/components'

export function AuctionComponent() {
  // __RENDER
  return (
    <section className='ui--home-auction section'>
      <div className='ui--home-section-header'>
        <div className='title'>
          <h2 className='h2'>On Auctions</h2>
          <p className='desc'>Generate Lorem Ipsum placeholder text.</p>
        </div>

        <div className='action'>
          <RouterLink className='btn btn-secondary btn-view' href='/marketplace?status=On%20Auctions'>
            <span className='text'>view all</span>
          </RouterLink>
        </div>
      </div>

      {/* <div className='ui--home-auction-container'>
        {Array.from({ length: 4 })
          .fill(null)
          .map((_, index) => (
            <ArticleComponent key={index} />
          ))}
      </div> */}
    </section>
  )
}
