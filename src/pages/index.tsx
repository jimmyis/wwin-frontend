import { Home } from '@/components'

export default function HomeContainer() {
  // __RENDER
  return (
    <div className='ui--home router-view'>
      <Home.Hero />
      <Home.Latest />
      <Home.Bar />
      {/* <Home.Collections /> */}
      {/* <Home.Auctions /> */}
    </div>
  )
}
