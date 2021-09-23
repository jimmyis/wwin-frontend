// import { ArticleComponent } from '@/components'

export function CollectionComponent() {
  // __RENDER
  return (
    <div className='ui--asset-collection'>
      <div className='ui--asset-collection-header'>
        <h2 className='h2'>Also from this collection</h2>
        <h4 className='h4'>Collection Name</h4>
      </div>

      {/* <div className='ui--asset-collection-body'>
        {Array.from({ length: 4 })
          .fill(null)
          .map((_, index) => (
            <ArticleComponent key={index} />
          ))}
      </div> */}
    </div>
  )
}
