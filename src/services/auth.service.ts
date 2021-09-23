import axios from '@/libs/axios'
import { configs, setCookie, removeCookie, cookieOptions, getCookie } from '@/libs/cookies'
import { dispatch, authActions } from '@/store'
import { createFormData, loader } from '@/utils'
import { getEtherProvider } from '@/libs/web3'
import { FormProfile } from '@/types'

export const authService = {
  /**
   * Signin.
   */
  async signin(): Promise<any> {
    const ether = getEtherProvider()
    if (ether) {
      const { personal, getAccounts } = ether

      const address = await getAccounts().then((r: string[]) => r[0])
      const nonce = await authService.getNonce(address)
      if (nonce) {
        const message = `I am signing my one-time nonce: ${nonce}`
        const signature = await personal.sign(message, address, '')

        if (signature) {
          const res = await axios.post('/initialApplication/api/init/metaMask', {
            publicAddress: address,
            signature
          })

          if (res) {
            authService.setAuthCookies({ address, token: res.data.token })
            await authService.getProfile(address)
            return true
          }
        }
      }
    }
  },

  /**
   * GET nonce by `address`.
   *
   * @param {string} address Wallet Adress
   */
  async getNonce(address: string): Promise<string | void> {
    const res = await axios.get(`/initialApplication/api/init/get/nonce/${address}`)
    if (res) {
      return res.data.nonce
    }

    return void 0
  },

  /**
   * GET user profile.
   *
   * @param {string} uid Wallet Address
   */
  async getProfile(address?: string): Promise<void> {
    const _address = address || getCookie(configs.USER_ADDRESS)
    const res = await axios.get(`/handleCollectors/api/user/findOne/${_address}`)

    if (res) {
      const { data } = res
      const action = authActions.setUserProfile({
        uid: _address,
        role: data.role || 'user',
        avatar: data.profile_picture || 'https://picsum.photos/256',
        username: data.user_name,
        name: data.name || 'unnamed',
        email: data.email || '',
        bio: data.bio,
        facebook: data.facebook || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
        telegram: data.telegram || ''
      })

      dispatch(action)
    }

    loader('off')
  },

  /**
   * UPDATE user profiule.
   *
   * @param {object} form Form Update Profile
   * @param {string} address Wallet Address
   */
  async setProfile(form: FormProfile, address?: string): Promise<any> {
    const [formData, headers] = createFormData(form)
    const _address = address || getCookie(configs.USER_ADDRESS)
    const res = await axios.put(`/handleCollectors/api/user/update/${_address}`, formData, { headers })
    if (res) return res.data

    return void 0
  },

  /**
   * SET auth cookies.
   *
   * @param {object} param Wallet Address and PassportToken
   */
  async setAuthCookies({ address, token }: { address: string; token: string }): Promise<void> {
    const options = cookieOptions()

    setCookie(configs.APP_AUTH, token, options)
    setCookie(configs.USER_ADDRESS, address, options)
  },

  /**
   * Logout.
   */
  async logout(redirectTo?: string): Promise<void> {
    const options = cookieOptions()

    loader('on')
    removeCookie(configs.APP_AUTH, options)
    removeCookie(configs.CONNECTOR, options)
    removeCookie(configs.USER_ADDRESS, options)

    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      // prettier-ignore
      document.cookie = cookie
        .replace(/^ +/, '')
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
    }

    location.href = redirectTo || '/'
  }
}
