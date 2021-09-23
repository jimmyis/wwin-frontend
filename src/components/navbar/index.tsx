import { useRef, useCallback } from 'react'
import { RouterLink } from '@/components'
import { isDevelop, isProduction } from '@/libs/configs'
import { useModal, useQueryString } from '@/hooks'
import { NavbarUserComponent } from './user'
import cls from 'classnames'

export function NavbarComponent() {
  // __STATE <React.Hooks>
  const searchRef = useRef(null)
  const { onModelActive } = useModal(null, 'Main Menu')
  const [_, setQuery, reset] = useQueryString()

  // __FUNCTIONS
  const handleSearch = useCallback(() => {
    const { current }: any = searchRef
    if (current?.value) {
      setQuery('/marketplace', { search: current.value })
    } else {
      reset()
    }
  }, [searchRef])

  // __RENDER
  return (
    <nav className='ui--navbar'>
      <div className={cls('ui--navbar-container', { x2: isProduction })}>
        <button className='btn btn-default btn-menu2' onClick={onModelActive}>
          <span className='icon bi bi-justify'></span>
        </button>

        <RouterLink className='ui--navbar-logo' href='/' key='home'>
          <img className='image' src='/static/images/logo.svg' />
        </RouterLink>

        {isDevelop && (
          <div className='ui--navbar-search'>
            <input className='search' placeholder='Search by NFT name or collection' ref={searchRef} />
            <span className='icon bi bi-search' onClick={handleSearch}></span>
          </div>
        )}

        <div className='ui--navbar-menu'>
          <RouterLink href='/marketplace' key='marketplace'>
            <span className='text'>marketplace</span>
          </RouterLink>

          <a
            className='router-link'
            href='https://stake.winwinwintoken.com/garuda-white-gold'
            target='_parent'
            referrerPolicy='no-referrer'
          >
            <span className='text'>stake</span>
          </a>

          <a
            className='router-link'
            href='https://testnet-bath-wwin.web.app'
            target='_parent'
            referrerPolicy='no-referrer'
          >
            <span className='text'>bath</span>
          </a>

          <a className='router-link' href='/static/WWIN_Whitepaper.pdf' target='_blank' referrerPolicy='strict-origin'>
            <span className='text'>whitepaper</span>
          </a>

          <NavbarUserComponent />
        </div>
      </div>
    </nav>
  )
}
