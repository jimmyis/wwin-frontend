import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FirestoreCollectionIDs } from "@/types/firestore"
import { safeAddress } from '@/utils/blockchain'


export async function getNFTcollectionData(db: any, id: string) {
    if (id && db) {
      return await getOneDoc(db, FirestoreCollectionIDs.NFT_COLLECTIONS , id)
    }
    return null
}

export async function getUserOwnedTokenData(db: any, account: string) {
    if (account && db) {
        const result_ = await getOneDoc(db, FirestoreCollectionIDs.USER_OWNED_TOKEN , safeAddress(account))
        return result_
    }
    return null
}

export async function loadMarketplaceListData(db: any, marketplace_list_id: string) {
    try {
        const docRef = doc(db, "nft_marketplace:lists", marketplace_list_id)
        const _doc = await getDoc(docRef);
    
        if (_doc.exists()) {
            return _doc.data() as any
        }
    } catch (error) {
        console.error(error)
    }
}

export async function loadMarketplaceItemData(db: any, marketplace_item_id: string) {
    const data_: any = { marketplace_item_id }
    const _doc_nft_marketplace_item_Ref = doc(db, "nft_marketplace:items", marketplace_item_id)
    const _doc_nft_marketplace_item = await getDoc(_doc_nft_marketplace_item_Ref);
    if (_doc_nft_marketplace_item.exists()) {
      const _data_nft_marketplace_item = _doc_nft_marketplace_item.data() as any
      data_.nft_marketplace_item = _data_nft_marketplace_item
    }

    const [ contract_address, serial_no ] = marketplace_item_id.split("__")
    const _doc_nft_item_Ref = doc(db, "nft_collections", contract_address)
    const _doc_nft_item = await getDoc(_doc_nft_item_Ref);
    if (_doc_nft_item.exists()) {
      const _data_nft_item = _doc_nft_item.data() as any
      data_.nft_item = _data_nft_item
      data_.contract_address = contract_address
      data_.serial_no = serial_no
    }

    return data_
}

export async function loadMarketplaceSessionData(db: any, id: string) {
    const _docRef = doc(db, FirestoreCollectionIDs.NFT_MARKETPLACE_SESSIONS, id)
    const _doc = await getDoc(_docRef);
    if (_doc.exists()) {
      return { ..._doc.data() as any }
    }
    return null
}

  // Generic Function for Firestore
export async function getOneDoc(db: any, collection: FirestoreCollectionIDs, id: string) {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data as any
    }
    return null
}

export async function setFirestoreDocument(db: any, targetCollection: string, targetDocument: string, data: any, options?: any) {
    let result_: { [key: string]: any } = {}
    console.log("setFirestoreDocument", data, options)

    try {
        if (!db) {

        }

        const _ref = doc(db, targetCollection, targetDocument)
        console.log(_ref)
        result_.result = await setDoc(_ref, data, { ...options });

    } catch (error) {
        result_.error = error;
    } finally {
        console.log(result_)
        return result_
    }
}

export async function updateFirestoreDocument(db: any, targetCollection: string, targetDocument: string, data: any, options?: any) {
    let result_: { [key: string]: any } = {}
    console.log("updateFirestoreDocument", data, options)

    try {
        if (!db) {

        }

        const _ref = doc(db, targetCollection, targetDocument)
        console.log(_ref)
        result_.result = await updateDoc(_ref, data, { ...options });

    } catch (error) {
        result_.error = error;
    } finally {
        console.log(result_)
        return result_
    }
}

export async function removeFirestoreDocument(db: any, targetCollection: string, targetDocument: string, options?: any) {
    let result_: { [key: string]: any } = {}
    console.log("removeFirestoreDocument", options)

    try {
        if (!db) {

        }

        const _ref = doc(db, targetCollection, targetDocument)
        result_.result = await deleteDoc(_ref);

    } catch (error) {
        result_.error = error;
    } finally {
        console.log(result_)
        return result_
    }
}

/* 
  Firestore Generic Operations Functions
*/

export async function getFirestoreDocument(db: any, targetCollection: string, targetDocument: string, options?: any) {
    let result_: { [key: string]: any } = {}

    try {
        if (!db) {

        }

        const _ref = doc(db, targetCollection, targetDocument)
        console.log(_ref)
        const _doc = await getDoc(_ref);
        result_.result = _doc.exists() ? _doc.data() : null

    } catch (error) {
        result_.error = error;
    } finally {
        console.log(result_)
        return result_
    }
}

