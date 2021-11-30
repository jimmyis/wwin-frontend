import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FirestoreCollectionIDs } from "@/types/firestore"
import { safeAddress } from '@/utils/blockchain'


export async function loadStoreContract(db: any, id: string, /* common_contract_type?: string */) {
    // if (common_contract_type) {
    //     return 
    // }
    
    if (id && db) {
        const result_ = await getOneDoc(db, FirestoreCollectionIDs.CONTRACTS , (safeAddress(id) as string))
        console.log("loadStoreContract", result_)
        return result_

    }
    return null
}

export async function loadSingleNFTcollectionData(db: any, id: string) {
    if (id && db) {
      return await getOneDoc(db, FirestoreCollectionIDs.NFT_COLLECTIONS , id)
    }
    return null
}

export async function getUserOwnedTokenData(db: any, account: string) {
    if (account && db) {
        const result_ = await getOneDoc(db, FirestoreCollectionIDs.USER_OWNED_TOKEN , (safeAddress(account) as string))
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

export async function loadSingleMarketplaceItemData(db: any, id: string) {
    const _docRef = doc(db, FirestoreCollectionIDs.NFT_MARKETPLACE_ITEMS, id)
    const _doc = await getDoc(_docRef);
    if (_doc.exists()) {
      return { ..._doc.data() as any }
    }
    return null
}

export async function loadSingleMarketplaceSessionData(db: any, id: string) {
    const _docRef = doc(db, FirestoreCollectionIDs.NFT_MARKETPLACE_SESSIONS, id)
    const _doc = await getDoc(_docRef);
    if (_doc.exists()) {
      return { ..._doc.data() as any }
    }
    return null
}

export async function loadAllMarketplaceItemData(db: any, marketplace_item_id: string) {
    const data_: any = { marketplace_item_id }
    try {
        // Get current marketplace item data.
        data_.nft_marketplace_item = await loadSingleMarketplaceItemData(db,  marketplace_item_id)

        if (data_.nft_marketplace_item) {
            // Get current marketplace session.
            if (data_.nft_marketplace_item.current_market_session_active) {
                const marketplace_session_id = marketplace_item_id + "@" + data_.nft_marketplace_item.current_market_session;
                data_.marketplace_session_id = marketplace_session_id
                data_.nft_marketplace_session = await loadSingleMarketplaceSessionData(db, marketplace_session_id)
            }
        }

        // Get NFT collection data.
        const [ contract_address, serial_no ] = marketplace_item_id.split("__")
        data_.nft_item = await loadSingleNFTcollectionData(db, contract_address)
        data_.contract_address = contract_address
        data_.serial_no = serial_no

    } catch (error) {

    }

    return data_
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
        console.log(_ref, options)
        const _doc = await getDoc(_ref);
        result_.result = _doc.exists() ? _doc.data() : null

    } catch (error) {
        result_.error = error;
    } finally {
        console.log(result_)
        return result_
    }
}

