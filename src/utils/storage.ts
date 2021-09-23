import { StorageProps } from '@/types'

/**
 * Local Storege Manager.
 */
export const storage: StorageProps = {
  get: (key) => {
    if (localStorage.getItem(key)) {
      try {
        return localStorage.getItem(key)
      } catch (error) {
        localStorage.removeItem(key)
        throw error
      }
    }
  },

  set: (key, input) => {
    localStorage.setItem(key, input)
  },

  remove: (key) => {
    localStorage.removeItem(key)
  }
}

/**
 * Session Storege Manager.
 */
export const session: StorageProps = {
  get: (key) => {
    if (sessionStorage.getItem(key)) {
      try {
        return sessionStorage.getItem(key)
      } catch (error) {
        sessionStorage.removeItem(key)
        throw error
      }
    }
  },

  set: (key, input) => {
    sessionStorage.setItem(key, input)
  },

  remove: (key) => {
    sessionStorage.removeItem(key)
  }
}
