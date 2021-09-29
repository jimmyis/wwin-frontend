import { useState, useEffect } from 'react'
import { Profile, Loading, NFTitemDisplay } from '@/components'
// import { userService } from '@/services/user.service'
import { useSelector, authSelector } from '@/store'
import { NFTItem } from '@/types'
import { db } from '@/libs/firebase'
import { doc, getDoc } from "firebase/firestore";

export default function ProfileContainer() {
  // __STATE <React.Hooks>
  const user = useSelector(authSelector.getUser)
  const [state, setState] = useState<NFTItem[] | null>(null)

  // __EFFECTS <React.Hooks>
  // useEffect(() => {
  //   async function run() {
  //     const res = await userService.getTransactions()
  //     if (res) setState(res)
  //   }

  //   if (user) run()
  // }, [user])

  useEffect(() => {

    async function run() {

      const records_: any[] = []
      
      const wallet_address = (user?.uid as string).toLowerCase() || null
      if (wallet_address) {
        const docUserOwnerRef = doc(db, "user_owned_token", wallet_address)
        const docUserOwnerSnap = await getDoc(docUserOwnerRef)
        const userOwnedData = docUserOwnerSnap.data() as any
  
        const userOwnedList = Object.keys(userOwnedData)
  
        for (let erc721 of userOwnedList) {
          const erc721_address = erc721.toLowerCase();
          const docCollectionsRef = doc(db, "nft_collections", erc721_address)
          const docCollectionsSnap = await getDoc(docCollectionsRef)
  
          if (docCollectionsSnap.exists()) {
            const collectionsData = docCollectionsSnap.data() as any
  
            // const docTokenOwnedRef = doc(db, "nft_tokens_list:owned", erc721)
            // const docTokenOwnedSnap = await getDoc(docTokenOwnedRef)
  
            // let tokenOwnedData = {}
  
            // if (docTokenOwnedSnap.exists()) {
            //   tokenOwnedData = docTokenOwnedSnap.data() as any
            // }
  
            if (Object.keys(collectionsData).length > 0) {
              const data = {...collectionsData, serialNoList: userOwnedData[erc721].serial_no}
              records_?.push(data)
            }
          }
          
          console.log('in map object end', erc721)
        }
  
        console.log('record', records_)
        setState(records_)
      }
    }
    if (user) run()
  }, [user])

  // __RENDER
  if (!user) return null
  return (
    <Profile.Layout className='main' user={user}>
      {state ? (
        <div className='collects'>
          {state.map((record, index) => (
            <NFTitemDisplay data={record} key={index} />
          ))}

          {!state.length && 'No Data!'}
        </div>
      ) : (
        <Loading />
      )}
    </Profile.Layout>
  )
}
