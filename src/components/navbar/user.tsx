import { useRef, useState, useEffect, useCallback } from 'react'
import { useClickAway } from 'react-use'
import { useRouter } from 'next/router'
import { RouterLink } from '@/components'
import { useAuth, useRole } from '@/hooks'
import { isDevelop } from '@/libs/configs'
import { useSelector, authSelector } from '@/store'
import { getShortAddress, file404 } from '@/utils'
import { Connectors } from '@/types/constants'
import cls from 'classnames'

export function NavbarUserComponent() {
  // __STATE <React.Hooks>
  const router = useRouter()
  const user = useSelector(authSelector.getUser)
  const { isUser } = useRole()
  const { signin, signout } = useAuth()
  const [hover, setHover] = useState(false)
  const elm = useRef(null)

  // prettier-ignore
  useClickAway(elm, () => {
    if (hover) {
      setHover(false)
    }
  }, ['click'])

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (hover) {
      setHover(false)
    }
  }, [router])

  // __FUNCTIONS
  const handleSignin = useCallback(() => {
    signin(Connectors.Injected)
  }, [])

  const handleSignout = useCallback(() => {
    signout()
    setHover(false)
  }, [])

  // __RENDER
  return (
    <div className='ui--navbar-user' suppressHydrationWarning>
      {user ? (
        <>
          <div className='ui--navbar-user-avatar' onClick={() => setHover(true)}>
            <span className='name'>{getShortAddress(user.uid)}</span>
            <img className='image' src={user.avatar} onError={file404} />
          </div>

          <div className={cls('ui--navbar-user-menu', { hover })} ref={elm}>
            <div className='ul'>
              <div className='ui--navbar-user-info'>
                <div className='name'>{user.name}</div>
                <span className='address'>{getShortAddress(user.uid)}</span>
              </div>

              {!isUser && (
                <RouterLink className='li' href='/assets/create' key='mint'>
                  <span className='icon bi bi-pen'></span>
                  <span className='text'>create (Mint)</span>
                </RouterLink>
              )}

              <RouterLink className='li' href='/profile' key='profile'>
                <span className='icon bi bi-person'></span>
                <span className='text'>profile</span>
              </RouterLink>

              {isDevelop && (
                <RouterLink className='li' href='/collections' key='collections'>
                  <span className='icon bi bi-grid'></span>
                  <span className='text'>collections</span>
                </RouterLink>
              )}

              <a className='li signout' onClick={handleSignout}>
                <span className='icon bi bi-box-arrow-right'></span>
                <span className='text'>sign out</span>
              </a>
            </div>
          </div>
        </>
      ) : (
        <button className='btn btn-connect' onClick={handleSignin}>
          <span className='text'>Connect Wallet</span>
        </button>
      )}
    </div>
  )
}
