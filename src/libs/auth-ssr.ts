import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { configs } from '@/libs/configs'

export type Context = GetServerSidePropsContext
export type ContextResult = GetServerSidePropsResult<{}>

export function useMiddleware(callback?: Function) {
  return (context: Context): ContextResult => {
    const isAuthenticated: string = context.req.cookies[configs.AUTH_ADDRESS]
    const url: string = context.req.url || ''

    if (!isAuthenticated) {
      let isPageIgnore = !/login/i.test(url)

      // Redirect to Login page when not logged-in.
      if (isPageIgnore) {
        return {
          redirect: {
            destination: '/login',
            statusCode: 307
          }
        }
      }
    }

    // Pass data to the page via props
    return callback ? callback(context) : { props: {} }
  }
}
