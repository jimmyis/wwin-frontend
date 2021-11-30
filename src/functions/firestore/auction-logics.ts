import { Firestore, runTransaction, doc, deleteField, arrayRemove } from "firebase/firestore"
import { FirestoreCollectionIDs } from "@/types/firestore"
import { safeAddress } from '@/utils/blockchain'
import { cummulativeThrowErrors } from '@/utils/error'

export async function completeAuctionSales($db: Firestore, payload: any) {
    console.log("Sell/Auction/CompletionTransaction")

    try {
        const errors = cummulativeThrowErrors()
        const db: Firestore = $db.type === "firestore" ? $db 
            : errors.get({ message: "Required object not available: Firestore instance" }, $db)
        const new_user_account = payload.new_user_account
            || errors.get({ message: "Invalid required parameter: new user account" })
        const previous_owner = payload.account
            || errors.get({ message: "Invalid required parameter: user account" })
        const contract_address = payload.contract_address
            || errors.get({ message: "Invalid required parameter: NFT contract address" })
        const serial_no = payload.serial_no
            || errors.get({ message: "Invalid required parameter: NFT serial no. (Token Id)" })
        const marketplace_session_id = payload.marketplace_session_id
            || errors.get({ message: "Invalid required parameter: NFT Marketplace Session ID" })
        const marketplace_item_id = payload.marketplace_item_id
            || errors.get({ message: "Invalid required parameter: NFT Marketplace Item ID" })

        errors.check()

        const docRefs = {
            newUserOwnedToken: doc(db, FirestoreCollectionIDs.USER_OWNED_TOKEN , (safeAddress(new_user_account) as string)),
            previousUserOwnedToken: doc(db, FirestoreCollectionIDs.USER_OWNED_TOKEN , (safeAddress(previous_owner) as string)),
            newUserMarketplaceList: doc(db, FirestoreCollectionIDs.USER_MARKETPLACE_LIST , (safeAddress(new_user_account) as string)),
            previousOwnerMarketplaceList: doc(db, FirestoreCollectionIDs.USER_MARKETPLACE_LIST , (safeAddress(previous_owner) as string)),
            marketplaceSession: doc(db, FirestoreCollectionIDs.NFT_MARKETPLACE_SESSIONS , (safeAddress(marketplace_session_id) as string)),
            marketplaceList: doc(db, FirestoreCollectionIDs.NFT_MARKETPLACE_LIST , "auction:recent"),
            marketplaceItem: doc(db, FirestoreCollectionIDs.NFT_MARKETPLACE_ITEMS , (safeAddress(marketplace_item_id) as string)),
        }

        await runTransaction(db, async (transaction) => {

            // Add token to new user
            // Checking for new user have owned any token?
            // const newUserOwnedTokenDoc = await transaction.get(docRefs.newUserOwnedToken)
            // if (!newUserOwnedTokenDoc.exists()) {
            //     throw "Document does not exist!";
            //     // Create data for new user
            const previousOwnerMarketplaceList = await transaction.get(docRefs.previousOwnerMarketplaceList)
            // const newUserMarketplaceList = await transaction.get(docRefs.newUserMarketplaceList)

            // Relocate user owned token
            transaction.update(docRefs.newUserOwnedToken, {
                [contract_address + ".serial_no." + serial_no]: {}
            })

            // Remove token from previous owner
            transaction.update(docRefs.previousUserOwnedToken, {
                [contract_address + ".serial_no." + serial_no]: deleteField()
            })

            // Mark current marketplace session
            transaction.update(docRefs.marketplaceSession, {
                status: "completed"
            })
            
            transaction.update(docRefs.marketplaceList, {
                list: arrayRemove(marketplace_item_id)
            })

            // Mark on NFT marketplace item
            transaction.update(docRefs.marketplaceItem, {
                quotes: {},
                current_market_session: -1,
                current_market_session_active: false,
                current_owner: new_user_account
            })
            
            if (previousOwnerMarketplaceList.exists()) {
                transaction.update(docRefs.previousOwnerMarketplaceList, {
                    list: arrayRemove(marketplace_session_id)
                })
            }
            
            // Remove from NFT marketplace list


            // Update new value (latest price).

        })
        // console.log("Transaction successfully committed!")
    } catch (e) {
        console.error("Sell/Auction/CompletionTransaction failed: ", e)
    }
}

