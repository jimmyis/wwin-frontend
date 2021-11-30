import { useState, useEffect, useRef } from 'react'
import { Profile, Loading, NFTitemDisplay } from '@/components'
// import { userService } from '@/services/user.service'
import { useSelector, authSelector } from '@/store'
import { NFTItem } from '@/types'
import { useDB } from '@/hooks'
import { useWeb3React } from '@web3-react/core'
import { getNFTcollectionData, getUserOwnedTokenData } from "@/functions/firestore"

export default function ProfileContainer() {
  // __STATE <React.Hooks>
  const user = useSelector(authSelector.getUser)
  const stateOwnedNFTList = useState<NFTItem[] | null>(null)
  const [ ownedNFTList, setOwnedNFTList ] = stateOwnedNFTList

  const { account, chainId } = useWeb3React()

  const { db } = useDB();
  const dbRef = useRef(db.name);

  // __EFFECTS <React.Hooks>

  useEffect(() => {
    // Get new profile data due to account changing.
    (async () => {
      if (account) {
        const data_ = await getOwnedNFTs({ user, account, chainId, db })
        setOwnedNFTList(data_)
      }
    })()
  }, [user, account ])

  useEffect(() => {
    // Get new profile data due to chain changing.
    (async () => {
      if (account && dbRef.current !== db.name) {
        const data_ = await getOwnedNFTs({ user, account, chainId, db })
        setOwnedNFTList(data_)
        dbRef.current = db.name
      }
    })()
  }, [chainId, db.name ])

  async function updateSingleNFTData(id: string, account: string) {
    if (account && db) {
      const _nft_collection_data = await getNFTcollectionData(db, id)
      const _user_owned_token = await getUserOwnedTokenData(db, account)
  
      const ownedNFTList_ = ownedNFTList ? [ ...ownedNFTList ] : []
      const index = ownedNFTList_.findIndex((nft: NFTItem) => nft._id === id)
      const serial_no = ownedNFTList_[index].serial_no

      const  _data = { ..._nft_collection_data, ..._user_owned_token[id].serial_no[serial_no], contract_address: id, serial_no }
      ownedNFTList_.splice(index, 1, _data)
    

      setOwnedNFTList(ownedNFTList_)
    }
  }

  const handlers = {
    updateSingleNFTData
  }

  // __RENDER
  if (!user) return null

  return (
    <Profile.Layout className='main' user={user}>
      {ownedNFTList ? (
        <div className='collects'>
          {ownedNFTList.map((record, index) => (
            <NFTitemDisplay data={record} handlers={handlers} key={index} />
          ))}

          {!ownedNFTList.length && 'No Data!'}
        </div>
      ) : (
        <Loading />
      )}
    </Profile.Layout>
  )
}
/* 
  // TODO:
  // - Decouple it to smaller function, shift down data loading to NFTitemDisplay component and make it lazy load.
  // - Refactored to be a shared function
*/

async function getOwnedNFTs({ account, db }: any) {
  const records_: any[] = []

  const _account = (account).toLowerCase()

  if (!db) {

  }

  const user_owned_token = await getUserOwnedTokenData(db, _account)
  if (user_owned_token) {
    const userOwnedList = Object.keys(user_owned_token)

    for (let erc721 of userOwnedList) {
      const erc721_address = erc721.toLowerCase();

      const nft_item_data = await getNFTcollectionData(db, erc721_address)
  
      // Workaround
      if (Array.isArray(user_owned_token[erc721].serial_no)) {
        for (let serial_no of user_owned_token[erc721].serial_no) {
          let item = { ...nft_item_data, ...user_owned_token, contract_address: erc721, serial_no }
          records_?.push(item)
        }
      } else {
        for (let serial_no in user_owned_token[erc721].serial_no) {
          let item = { ...nft_item_data, ...user_owned_token[erc721].serial_no[serial_no], contract_address: erc721, serial_no }
          records_?.push(item)
        }
      }
    }
  }
  return records_
}