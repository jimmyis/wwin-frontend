import { ReactNode } from 'react'
import { Profile } from '@/components'
// import { dispatch, authActions } from '@/store'
// import { createObjectURL } from '@/utils'
import { User } from '@/types'
import cls from 'classnames'

export interface Props {
  className?: string
  user: User
  children: ReactNode
}

export function ProfileLayoutComponent({ user, children, className }: Props) {
  // __FUNCTIONS
  // const handleChange = ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
  //   const file = files?.length && files.item(0)
  //   if (file) {
  //     const action = authActions.setUserProfile({
  //       cover: createObjectURL(file)
  //     })

  //     dispatch(action)
  //   }
  // }

  // __RENDER
  return (
    <div className={cls('ui--profile', className, 'router-view')}>
      {/* <div className='ui--profile-cover'>
        {user.cover && <img className='image cursor-none' src={user.cover} />}

        <input type='file' id='cover' accept='image/*' onChange={handleChange} />
        <label className='btn btn-default btn-cover' htmlFor='cover'>
          <span className='icon bi bi-pencil'></span>
        </label>
      </div> */}

      <div className='ui--profile-container'>
        <Profile.User user={user} />

        <div className='ui--profile-content'>
          <Profile.Menu />

          {children}
        </div>
      </div>
    </div>
  )
}
