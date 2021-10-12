import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { userService } from '@/services/user.service'
import { dialog, loader } from '@/utils'
import { emailValidator } from '@/utils/validator'
import { FormSubscribe } from '@/types'

export function FooterComponent() {
  // __STATE <React.Hooks>
  const { register, handleSubmit, reset } = useForm<FormSubscribe>()

  // __FUNCTIONS
  const submit = useCallback(async (formData: FormSubscribe): Promise<void> => {
    loader('on')

    await userService.subscribe(formData)
    await dialog('Thank you for your subscribe.')

    reset()
    loader('off')
  }, [])

  // __RENDER
  return (
    <footer className='ui--footer'>
      <div className='ui--footer-follow'>
        <div className='columns'>
          <div className='ui--footer-follow-info'>
            <h4 className='h4'>Be in the know</h4>
            <p className='desc'>
              Join our mailing list to be in the know with our latest updates on SNFT drops, feature releases, and tips
              for navigating WWIN Platform.
            </p>
          </div>

          <div className='ui--footer-follow-content'>
            <form className='form' onSubmit={handleSubmit(submit)}>
              <input
                type='email'
                placeholder='Your Email Address'
                {...register('email', {
                  required: true,
                  pattern: emailValidator()
                })}
              />
              <button className='btn btn-primary' type='submit'>
                <span className='text'>Sign up</span>
              </button>
            </form>
          </div>
        </div>

        <div className='columns'>
          <div className='ui--footer-follow-info'>
            <h4 className='h4'>Join the community</h4>
          </div>

          <div className='ui--footer-follow-content'>
            <div className='list'>
              <a className='btn btn-link' href='https://t.me/winwinwin_news' title='Telegram' target='_blank'>
                <span className='icon bi bi-telegram'></span>
              </a>

              <a
                className='btn btn-link'
                href='https://www.facebook.com/3win.official'
                title='Facebook'
                target='_blank'
              >
                <span className='icon bi bi-facebook'></span>
              </a>

              <a className='btn btn-link' href='https://twitter.com/winwinwinoffic1' title='Twitter' target='_blank'>
                <span className='icon bi bi-twitter'></span>
              </a>

              <a className='btn btn-link' href='https://medium.com/@winwinwin.official' title='Medium' target='_blank'>
                <img className='image' src='/static/images/medium.svg' />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className='ui--footer-container'>
        <div className='ui--footer-content'>
          <div className='meta'>
            <img className='meta-logo' src='/static/images/logo.svg' />
            <p className='meta-desc'>The world’s first and only Sacred NFT marketplace. SNFTs are highly collectible because of their spiritual value and beauty. You can purchase and sell SNFTs here as well as displaying your SNFTs in a viewing gallery.</p>
          </div>

          <div className='menu'>
            <div className='columns'>
              <h4 className='h4'>marketplace</h4>
              <a className='router-link'>All NFTs</a>
            </div>

            <div className='columns'>
              <h4 className='h4'>My Account</h4>
              <a className='router-link'>My Profile</a>
            </div>

            <div className='columns'>
              <h4 className='h4'>Resources</h4>
              <a className='router-link'>WWIN support</a>
              <a className='btn btn-dark btn-chatwithus' href="https://t.me/WinWinWin_EN" target="_blank">Chat with us</a>
            </div>
          </div>
        </div>

        {/* <div className='ui--footer-copyright'>
          <p className='desc'>&copy; 2021 Undefined Co., Ltd.</p>
        </div> */}
      </div>
    </footer>
  )
}
