import HTMLHead from 'next/head'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from '@web3-react/core'
import { LoaderComponent, DialogComponent, ModalComponent, NavbarComponent, FooterComponent } from '@/components'
import { UseEagerConnect } from '@/hooks'
import { getLibrary } from '@/utils/connectors'
import { configs } from '@/libs/configs'
import { loader } from '@/utils'
import store from '@/store'
import { DataProvider } from '@/context'
import '@/utils/defineProperty'
import '@style/main.scss'

export default function Application({ Component: PagesContainer, pageProps }: AppProps) {
  console.log("Built for", process.env.NEXT_PUBLIC_BUILD_ENV)
  
  // __STATE <Rect.Hooks>
  const { events: routerEvents } = useRouter()

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_APP_NAME + " Application is Starting")
    routerEvents.on('routeChangeStart', () => loader('on'))
    routerEvents.on('routeChangeError', () => loader('off'))
    routerEvents.on('routeChangeComplete', () => loader('off'))
  }, [])

  // __RENDER
  return (
    <>
      <HTMLHead>
        <title>{configs.APP_WEB_TITLE}</title>
      </HTMLHead>

      <main className='ui--wrapper'>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <DataProvider>
              <UseEagerConnect />

              <NavbarComponent />
              <LoaderComponent />
              <DialogComponent />
              <ModalComponent />

              <PagesContainer {...pageProps} />

              <FooterComponent />
            </DataProvider>
          </Provider>
        </Web3ReactProvider>
      </main>
    </>
  )
}
