import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Asset, Loading, MediaComponent, AuctionPanelComponent } from '@/components'
import { chain } from '@/libs/configs'
// import { assetService } from '@/services/assets.service'
import { /* getQueryAt, */ getShortAddress,/*  loader */ } from '@/utils'
// import { NFTItem } from '@/types'
import QRCode from 'react-qr-code'
import { useDB } from '@/hooks'
import { loadMarketplaceItemData } from '@/functions/firestore'
import { doc, onSnapshot } from "firebase/firestore";

export default function MarketplaceItemContainer() {
  // __STATE <React.Hooks>
  const { query } = useRouter()
  const [ loading, setLoading ] = useState(true)
  const [ content, setContent ] = useState<any>(null)
  
  const { db } = useDB();

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    setLoading(true);
    let unsubscribe = () => {};

    const _id = query?.marketplace_id ? (query?.marketplace_id)?.toString().toLowerCase() : null;
    if (_id && db) {
      (async () => {
        const [ contract_address ] = _id.split("__")
        if (contract_address) {
          const data_ = await loadMarketplaceItemData(db, _id)
          setContent(data_)
        }
        setLoading(false);
      })();
  
      const docRef = doc(db, "nft_marketplace:items", (_id as string));
      unsubscribe = onSnapshot(docRef, 
        { includeMetadataChanges: true },
        (doc: any) => {
          const content_ = { ...content, nft_marketplace_item: doc.data() }
          setContent(content_)
        }
      );
    }

    return () => {
      setContent(null)
      setLoading(false)
      unsubscribe()
    }
  }, [query])

  // __RENDER
  return (
    <div className='ui--assets router-view'>
      {loading ? (
          <Loading />
        ) : (<>{
          content
          ? (<div>
            <div className='ui--assets-fullbar'>
              <img src='/static/images/header-caption.png' srcSet="/static/images/header-caption@2x.png 2x, /static/images/header-caption@3x.png 3x" />
            </div>
            <div className='ui--assets-container'>
              <div className='ui--assets-columns'>
                <div className='ui--assets-header'>
                  <div className="leftarea">
                    <h1 className='name'>{content?.nft_item?.name}</h1>
                    <a className='btn btn-default collection'>
                      {/* <span className='text'>Untitled Collection</span> */}
                    </a>
                  </div>
                  {/* <div className="rightarea">
                    <img src="/static/images/snft-pow.png" />
                  </div> */}
                </div>

                {/* <Asset.Trade data={content} /> */}
                <AuctionPanelComponent data={content} />

                <div className='ui--assets-desc'>
                  <div className='content-header'>description</div>

                  <div className='description' dangerouslySetInnerHTML={{ __html: content?.nft_item.description }}></div>

                  {content?.nft_item.qrURL && (
                    <div className='qr-code'>
                      <QRCode value={content?.nft_item.qrURL} size={99} />
                    </div>
                  )}
                </div>
              </div>

              <div className='ui--assets-columns'>
                <div className='ui--assets-media'>
                  <MediaComponent media={content?.nft_item.image} />
                </div>

                <div className='ui--assets-details'>
                  <div className='content-header'>details</div>

                  <div className='ul'>
                    <div className='li'>
                      <span className='label'>Contract Address</span>
                      <span className='value'>
                        <a className='btn btn-default' href={`${chain.explorer}/address/${content?.nft_item.tokenAddress}`} target='_blank'>
                          {getShortAddress(content?.nft_item.tokenAddress)}
                        </a>
                      </span>
                    </div>

                    {content?.nft_item.tokenId && (
                      <div className='li'>
                        <span className='label'>Token ID</span>
                        <span className='value'>{content?.nft_item.tokenId}</span>
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

                <Asset.Property data={content?.nft_item.properties} />
              </div>
            </div>
          </div>
          ) : (<div>No Item</div>)
        }</>
            
      )}

    </div>
  )
}
