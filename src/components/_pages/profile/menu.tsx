import { useCallback } from 'react'
import { useRouter } from 'next/router'
import cls from 'classnames'

export function MenuComponent() {
  // __STATE <React.Hooks>
  const router = useRouter()

  // __FUNCTIONS
  const handleClickTab = useCallback(
    (tab: string): void => {
      const { uid, ...query } = router.query
      router.push({
        pathname: '/profile',
        query: { ...query, tab }
      })
    },
    [router.query]
  )

  const setActiveClass = useCallback(
    (value: string): string => {
      const { tab }: any = router.query
      return cls('list', {
        active: tab ? tab === value : value === 'collects'
      })
    },
    [router.query]
  )

  // __RENDER
  return (
    <div className='ui--profile-menu'>
      <ul className='group'>
        <li className={setActiveClass('collects')} onClick={() => handleClickTab('collects')}>
          <span className='icon bi bi-columns-gap'></span>
          <span className='text'>collected</span>
        </li>

        <li className={setActiveClass('hidden')} onClick={() => handleClickTab('hidden')}>
          <span className='icon bi bi-eye-slash'></span>
          <span className='text'>hidden</span>
        </li>
      </ul>
    </div>
  )
}
