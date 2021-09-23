import { useEffect } from 'react'
import { loader } from '@/utils'

export function Loading() {
  // __EFFECTS <React.Hooks>
  useEffect(() => {
    loader('on')
    return () => loader('off')
  }, [])

  // __RENDER
  return (
    <div className='ui--loader-fetch'>
      <span className='text'>Loading...</span>
    </div>
  )
}
