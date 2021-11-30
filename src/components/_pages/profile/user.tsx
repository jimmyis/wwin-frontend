import { useEffect, useCallback, ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components'
import { useModal } from '@/hooks'
import { authService } from '@/services/auth.service'
import { dispatch, authActions } from '@/store'
import { loader, getShortAddress, getFileListAt, createObjectURL, file404, xModal } from '@/utils'
import { emailValidator, urlValidator } from '@/utils/validator'
import { User, FormProfile } from '@/types'

export interface Props {
  user: User
}

export function UserComponent({ user }: Props) {
  // __STATE <React.Hooks>
  const { onModalActive } = useModal(null, 'Edit Profile')

  // __FUNCTIONS
  const submit = useCallback(async (file: File) => {
    const res = await authService.setProfile({ file })
    if (res) return createObjectURL(file)
  }, [])

  const handleChange = useCallback(async ({ target: { files } }: ChangeEvent<HTMLInputElement>) => {
    const file = files?.length && files.item(0)
    if (file) {
      loader('on')
      const avatar = await submit(file)

      if (avatar) {
        const action = authActions.setUserProfile({ avatar })
        dispatch(action)
      }

      loader('off')
    }
  }, [])

  // __RENDER
  return (
    <div className='ui--profile-user'>
      <div className='user-avatar'>
        <img className='image' src={user.avatar} onError={file404} />

        <label className='overlay' htmlFor='avatar'>
          <span className='icon bi bi-pencil'></span>
          <span className='text'>edit</span>
        </label>

        <input type='file' id='avatar' accept='image/*' onChange={handleChange} />
      </div>

      <div className='user-name'>{user.name}</div>
      <div className='user-address'>{getShortAddress(user.uid)}</div>
      {user.email && <div className='user-email'>{user.email}</div>}
      <div className='user-bio'>{user.bio}</div>
      <div className='user-link'>
        {user.facebook && (
          <a className='btn btn-overlay link' href={user.facebook}>
            <span className='icon bi bi-facebook'></span>
          </a>
        )}

        {user.instagram && (
          <a className='btn btn-overlay link' href={user.instagram}>
            <span className='icon bi bi-instagram'></span>
          </a>
        )}

        {user.twitter && (
          <a className='btn btn-overlay link' href={user.twitter}>
            <span className='icon bi bi-twitter'></span>
          </a>
        )}

        {user.telegram && (
          <a className='btn btn-overlay link' href={user.telegram}>
            <span className='icon bi bi-telegram'></span>
          </a>
        )}
      </div>

      <div className='user-action'>
        <button className='btn btn-overlay' onClick={() => onModalActive(<EditProfileModal user={user} />)}>
          <span className='icon bi bi-gear'></span>
          <span className='text'>edit profile</span>
        </button>

        <button className='btn btn-overlay'>
          <span className='icon bi bi-clock-history'></span>
          <span className='text'>activity</span>
        </button>
      </div>
    </div>
  )
}

export function EditProfileModal({ user }: Props) {
  // __STATE <React.Hooks>
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormProfile>()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('bio', user.bio)
      setValue('facebook', user.facebook)
      setValue('instagram', user.instagram)
      setValue('twitter', user.twitter)
      setValue('telegram', user.telegram)
    }
  }, [user])

  // __FUNCTIONS
  const submit = useCallback(async (formData: FormProfile): Promise<void> => {
    loader('on')

    if (formData.file) {
      formData.file = getFileListAt(formData.file as any)!
    }

    const res = await authService.setProfile(formData)
    if (res) {
      await authService.getProfile()
      xModal()

      if (formData.file) {
        const action = authActions.setUserProfile({ avatar: createObjectURL(formData.file) })
        dispatch(action)
      }
    }

    loader('off')
  }, [])

  // __RENSER
  return (
    <form className='ui--profile-setting-form setting-form' onSubmit={handleSubmit(submit)}>
      <Input.Image key='.avatar' name='file' label='avatar' register={register} />

      <Input.Main
        key='.name'
        name='name'
        label='display name'
        register={register}
        errors={errors.name}
        rules={{ required: true }}
      />

      <Input.Main
        key='.email'
        name='email'
        label='email address'
        register={register}
        errors={errors.email}
        rules={{ pattern: emailValidator() }}
      />

      <Input.Textarea key='.bio' name='bio' label='bio' register={register} />

      <Input.Main
        key='.facebook'
        name='facebook'
        label='Facebook'
        icon='facebook'
        register={register}
        errors={errors.facebook}
        rules={{ pattern: urlValidator() }}
      />

      <Input.Main
        key='.instagram'
        name='instagram'
        label='Instagram'
        icon='instagram'
        register={register}
        errors={errors.instagram}
        rules={{ pattern: urlValidator() }}
      />

      <Input.Main
        key='.twitter'
        name='twitter'
        label='Twitter'
        icon='twitter'
        register={register}
        errors={errors.twitter}
        rules={{ pattern: urlValidator() }}
      />

      <Input.Main
        key='.telegram'
        name='telegram'
        label='Telegram'
        icon='telegram'
        register={register}
        errors={errors.telegram}
        rules={{ pattern: urlValidator() }}
      />

      <div className='ui--profile-setting-form-footer'>
        <button className='btn btn-primary btn-save' type='submit'>
          <span className='text'>save</span>
        </button>
      </div>
    </form>
  )
}
