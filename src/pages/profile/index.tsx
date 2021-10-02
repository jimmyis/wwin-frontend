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
        const docUserOwnedRef = doc(db, "user_owned_token", wallet_address)
        const docUserOwnedSnap = await getDoc(docUserOwnedRef)

        if (docUserOwnedSnap.exists()) {
          const userOwnedData = docUserOwnedSnap.data() as any
    
          const userOwnedList = Object.keys(userOwnedData)
    
          for (let erc721 of userOwnedList) {
            const erc721_address = erc721.toLowerCase();
            const docRefNFTcollection = doc(db, "nft_collections", erc721_address)
            const docSnapNFTcollection = await getDoc(docRefNFTcollection)
    
            if (docSnapNFTcollection.exists()) {
              const collectionData = docSnapNFTcollection.data() as any
    
              // const docTokenOwnedRef = doc(db, "nft_tokens_list:owned", erc721)
              // const docTokenOwnedSnap = await getDoc(docTokenOwnedRef)
    
              // let tokenOwnedData = {}
    
              // if (docTokenOwnedSnap.exists()) {
              //   tokenOwnedData = docTokenOwnedSnap.data() as any
              // }
    
              for (let serial_no of userOwnedData[erc721].serial_no) {
                const data = { ...collectionData, serial_no }
                records_?.push(data)
              }
            }
            
            // console.log('in map object end', erc721)
          }
    
          // console.log('record', records_)
          setState(records_)
        } else {
          // TODO: Set User Profile not founc
        }
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
