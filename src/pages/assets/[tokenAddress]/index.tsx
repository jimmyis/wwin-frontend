import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Asset, Loading, MediaComponent } from '@/components'
import { chain } from '@/libs/configs'
// import { assetService } from '@/services/assets.service'
import { /* getQueryAt, */ getShortAddress,/*  loader */ } from '@/utils'
import { NFTItem } from '@/types'
import QRCode from 'react-qr-code'

import { db } from '@/libs/firebase'
import { doc, getDoc } from "firebase/firestore";

async function getOneDoc(collection: string, id: string) {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return data as any
}

export default function AssetsContainer() {
  // __STATE <React.Hooks>
  const { query } = useRouter()
  const [ state, setState ] = useState<NFTItem>()

  // __EFFECTS <React.Hooks>
  useEffect(() => {

    (async () => {
      const id = query?.tokenAddress?.toString().toLowerCase();
      if (id) {
        getNFTcollectionData(id)
      }
    })();
    // async function run() {
    //   const tokenAddress = getQueryAt(query.tokenAddress!)
    //   const tokenId = getQueryAt(query.tokenId!)
    //   let res: any = void 0

    //   if (tokenId) {
    //     res = await assetService.getOneByQuery({
    //       NFTAddress: tokenAddress,
    //       tokenId
    //     })
    //     console.log(res)
    //   } else {
    //     res = await assetService.getOne(tokenAddress)
    //   }

    //   if (res) {
    //     setState({
    //       ...res,
    //       id: res.id || res.tokenAddress,
    //       tokenId: res.tonkenId,
    //       price: res.price || 0,
    //       available: res.available || 0,
    //       totalSupply: res.totalSupply || 1
    //     })
    //   }

    //   loader('off')
    // }

    // if (query.tokenAddress) {
    //   loader('on')
    //   run()
    // }
  }, [query])

  const getNFTcollectionData = async (id: string) => {
    const NFTcollection = await getOneDoc("nft_collections", id)
    setState((NFTcollection as NFTItem))
  }

  // __RENDER
  if (!state) return <Loading />
  return (
    <div className='ui--assets router-view'>
      <div className='ui--assets-fullbar'>
        <img src='/static/images/header-caption.png' />
      </div>
      <div className='ui--assets-container'>
        <div className='ui--assets-columns'>
          <div className='ui--assets-header'>
            <h1 className='name'>{state.name}</h1>
            <a className='btn btn-default collection'>
              {/* <span className='text'>Untitled Collection</span> */}
            </a>
          </div>

          <Asset.Trade data={state} />

          <div className='ui--assets-desc'>
            <div className='content-header'>description</div>

            <div className='description' dangerouslySetInnerHTML={{ __html: state.description }}></div>

            {state.qrURL && (
              <div className='qr-code'>
                <QRCode value={state.qrURL} size={99} />
              </div>
            )}
          </div>
        </div>

        <div className='ui--assets-columns'>
          <div className='ui--assets-media'>
            <MediaComponent media={state.image} />
          </div>

          <div className='ui--assets-details'>
            <div className='content-header'>details</div>

            <div className='ul'>
              <div className='li'>
                <span className='label'>Contract Address</span>
                <span className='value'>
                  <a className='btn btn-default' href={`${chain.explorer}/address/${state.id}`} target='_blank'>
                    {getShortAddress(state.id)}
                  </a>
                </span>
              </div>

              {state.tokenId && (
                <div className='li'>
                  <span className='label'>Token ID</span>
                  <span className='value'>{state.tokenId}</span>
                </div>
              )}

              <div className='li'>
                <span className='label'>Blockchain</span>
                <span className='value'>Binance Smart Chain</span>
              </div>

              <div className='li'>
                <span className='label'>Metadata</span>
                <span className='value'>Centralized</span>
              </div>
            </div>
          </div>

          <Asset.Property data={state.properties} />
        </div>
      </div>
    </div>
  )
}
