import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { MediaComponent } from '@/components'
import { useModal } from '@/hooks'
import { NFTItem } from '@/types'
import { useDB, useContract } from '@/hooks'
import { safeAddress, findMatchCurrency, createQuotes } from '@/utils/blockchain'
import { getFirestoreDocument, setFirestoreDocument, updateFirestoreDocument } from "@/functions/firestore"

export interface Props {
    data: NFTItem
    handlers?: any
}

export function NFTitemDisplay({ data, handlers }: Props) {

    // __RENDER
    return (
        <article className='ui--article'>
            <div className='ui--article-head'>
                <MediaComponent media={data.image} />
            </div>
            <div className="">
                {data.name}
                <div>No. {data.serial_no}</div>
            </div>
            <div className='ui--article-body'>
            </div>
            <NFTActionsDisplay data={data} handlers={handlers} />
        </article>
    )
}

export function NFTActionsDisplay({ data, handlers }: Props) {
    const { onModalActive, onModalClose } = useModal(null, 'Open Auction')

    function handleOpenAuctionSetupPanel(data: any) {
        onModalActive(<AuctionSetupPanel {...{ data, handlers: { ...handlers, handleCloseAuctionSetupPanel } }} />)
    }

    function handleCloseAuctionSetupPanel() {
        onModalClose()
    }

    return (
        <div className="ui--nft-actions">
            <button className='btn action-button btn-overlay btn-dark btn-connect' onClick={(() => { handleOpenAuctionSetupPanel(data) })}>
                {/* <span className='icon bi bi-gear'></span> */}
                <span className='text'>Set Auction</span>
            </button>
        </div>
    )
}



export function AuctionSetupPanel(props: Props) {

    const { data, handlers: parentHandlers } = props;
    const { account } = useWeb3React()
    const { db } = useDB()
    const { contracts } = useContract()

    // console.log("Contracts", contracts)

    const [ priceInput, setPriceInput ] = useState("0")
    const [ currencyInput, setCurrencyInput ] = useState(findMatchCurrency("0x0"))
    // const [ quotes, setQuotes ] = useState({})
    // console.log("AuctionSetupPanel", props)

    function handlePriceInputChange(event: any) {
        const { value } = event.target
        setPriceInput(value)
    }

    function handleCurrencyChange(event: any) {
        const { value } = event.target
        const currencyInput_ = findMatchCurrency(value)
        if (currencyInput_) {
            setCurrencyInput(value)
        } else {
            // TODO: Handle Error UI
        }
        console.log("handleCurrencyChange", currencyInput_)
    }

    function handleClearStates() {
        setPriceInput("0")
        setCurrencyInput("0x0")
    }

    const handlers = {
        ...parentHandlers,
        handleClearStates
    }

    return (<div>
        {data?.status === "selling"
            ? (<div>
                {data?.sell_type === "auction"
                    ? (<div>
                        <button className='btn action-button btn-overlay btn-dark btn-connect' onClick={(() => { })}>
                            {/* <span className='icon bi bi-gear'></span> */}
                            <span className='text'>View Bids</span>
                        </button>
                        <button className='btn action-button btn-overlay btn-dark btn-connect'
                            onClick={(() => {
                                cancelAuction(db, contracts,
                                    {
                                        ...data,
                                        account
                                    }, 
                                    handlers
                                )
                                }
                            )}
                        >
                            {/* <span className='icon bi bi-gear'></span> */}
                            <span className='text'>Cancel Auction</span>
                        </button>
                    </div>)
                    : (<div>
                    </div>)
                }
            </div>)
            : (<div>
                <div id="auction-bid-input-panel">
                    <span className="_label">Set Minimum Bid Price</span>
                    <div className="_inputs">
                        <input type="number" min="1" className="_textinput" onChange={handlePriceInputChange}></input>
                        <select className="_selectbox" value={currencyInput.symbol} onChange={handleCurrencyChange}>
                            <option value="0x0">BNB</option>
                            <option value="0x1">WBNB</option>
                        </select>
                    </div>
                    <div className="divider-clear" />
                    <div className="_actions">
                        <button className='btn action-button btn-overlay  btn-dark btn-connect'
                            onClick={(() => {
                                startAuction(db, contracts,
                                    // Data
                                    {
                                        ...data, 
                                        account,
                                        inputs: {
                                            priceInput,
                                            currencyInput
                                        }
                                    },
                                    // Handlers
                                    handlers,
                                )
                            })}
                        >
                            {/* <span className='icon bi bi-gear'></span> */}
                            <span className='text'>Start Auction</span>
                        </button>
                    </div>
                </div>
            </div>)
        }
    </div>)
}

function startAuction(db: any, contracts: any, data: any, handlers: any) {
    console.log("Start Auction")
    const { account, inputs } = data;
    const contract_address = safeAddress(data.contract_address)
    const sell_type = "auction"
    const marketplace_item_id = data.contract_address + "__" + data.serial_no || null
    const quotes = createQuotes(inputs)

    commitStartAuctionData(db, contracts, {
        ...data,
        contract_address,
        marketplace_item_id,
        sell_type,
        quotes
    })
        .then(() => {
            return handlers.updateSingleNFTData(contract_address, account).then().catch()
        })
        .then(() => {
            // Update UI
            handlers.handleClearStates()
            handlers.handleCloseAuctionSetupPanel()

        })
        .catch((error: any) => {
            console.error(error)
            handlers.handleCloseAuctionSetupPanel()
        })
}

function cancelAuction(db: any, contracts: any, data: any, handlers: any) {
    console.log("Cancel Auction")
    const { account } = data
    const contract_address = safeAddress(data.contract_address)
    const sell_type = "auction"
    const marketplace_item_id = data.contract_address + "__" + data.serial_no || null
    commitCancelAuctionData(db, contracts, {
        ...data,
        contract_address,
        marketplace_item_id,
        sell_type
    })
        .then(() => {
            return handlers.updateSingleNFTData(contract_address, account).then().catch()
        })
        .then(() => {
            // Update UI
            handlers.handleCloseAuctionSetupPanel()
        })
        .catch((error: any) => console.error(error))
}

async function commitStartAuctionData(db: any, contracts: any, data: any) {
    try {
        const { quotes } = data;
        const timestamp = new Date().getTime()
        console.log("commitStartAuctionData", data);

        // const current_market_session = timestamp
        // Create a transaction with MetaMask
        await sendOpenAuctionTx(contracts, data)
        
        // Update Off-chain Data
        //
        await setNFTMarketplaceData(db,
            {
                ...data,
                timestamp,
                payload: {
                    marketplace_item: {
                        _id: safeAddress(data.marketplace_item_id),
                        quotes,
                        current_owner: safeAddress(data.account),
                        current_market_session: timestamp,
                        market_sessions: arrayUnion({
                            tx_hash: safeAddress(""),
                            timestamp,
                            creator: safeAddress(data.account),
                            sell_type: data.sell_type,
                        }),
                        current_market_session_active: true,
                    },
                    marketplace_session: {
                        _id: safeAddress(data.marketplace_item_id + "@" + timestamp),
                        timestamp,
                        status: "active",
                        participants: [],
                        quotes,
                    }
                }
            }
        )

        await updateUserOwnedTokenData(db,
            {
                ...data,
                payload: {
                    [data.contract_address]: {
                        serial_no: {
                            [data.serial_no]: {
                                status: "selling",
                                sell_type: data.sell_type,
                                marketplace_item_id: data.marketplace_item_id,
                                current_market_session: timestamp
                            }
                        }
                    }
                }
            }
        )

    } catch (error) {
        console.error(error)
    }
}

async function commitCancelAuctionData(db: any, contracts: any, data: any) {
    try {
        // Create a transaction with MetaMask

        await sendCloseAuctionTx(contracts, data)

        await removeNFTMarketplaceData(db,
            {
                ...data
            }
        )

        // Update Off-chain Data
        await updateUserOwnedTokenData(db,
            {
                ...data,
                payload: {
                    [data.contract_address]: {
                        serial_no: {
                            [data.serial_no]: {
                                status: "",
                                sell_type: null,
                                sell_meta: null,
                                marketplace_item_id: null,
                                current_market_session: -1
                            }
                        }
                    }
                }
            })

    } catch (error) {
        console.error(error)
    }
}


import { arrayUnion, arrayRemove } from "firebase/firestore";

async function setNFTMarketplaceData(db: any, data: any) {
    try {
        const collection_nft_marketplace_items = "nft_marketplace:items";
        const collection_nft_marketplace_lists = "nft_marketplace:lists";
        const collection_nft_marketplace_sessions = "nft_marketplace:sessions";

        if (data.marketplace_item_id) {
            await setFirestoreDocument(db, collection_nft_marketplace_items, safeAddress(data.marketplace_item_id), data.payload.marketplace_item, { merge: true })
            await setFirestoreDocument(db, collection_nft_marketplace_lists, "auction:recent", {
                list: arrayUnion(data.marketplace_item_id)
            })
            await setFirestoreDocument(db, collection_nft_marketplace_sessions, data.payload.marketplace_session._id, data.payload.marketplace_session)
        }

    } catch (error: any) {

    }
}

async function removeNFTMarketplaceData(db: any, data: any) {
    try {
        const collection_nft_marketplace_items = "nft_marketplace:items";
        const collection_nft_marketplace_lists = "nft_marketplace:lists";
        const collection_nft_marketplace_sessions = "nft_marketplace:sessions";

        if (data.marketplace_item_id) {
            // await removeFirestoreDocument(db, collection_nft_marketplace_items, safeAddress(data.marketplace_item_id))

            const { result: item_data } = await getFirestoreDocument(db, collection_nft_marketplace_items, safeAddress(data.marketplace_item_id))
            console.log(item_data)
            const { current_market_session } = item_data

            // Update the item
            await updateFirestoreDocument(db, collection_nft_marketplace_items, safeAddress(data.marketplace_item_id),
                {
                    current_market_session: -1,
                    current_market_session_active: false,
                    quotes: null,
                })

            // Update the index list
            await updateFirestoreDocument(db, collection_nft_marketplace_lists, "auction:recent",
                {
                    list: arrayRemove(data.marketplace_item_id)
                })

            // Update the session
            await updateFirestoreDocument(db, collection_nft_marketplace_sessions, safeAddress(data.marketplace_item_id + "@" + current_market_session),
                {
                    status: "closed",
                },
                {
                    merge: true
                })
        }

    } catch (error: any) {

    }
}

async function updateUserOwnedTokenData(db: any, data: any) {
    try {
        console.log("updateUserOwnedTokenData", data)
        const collection_user_owned_token = "user_owned_token";
        if (data.account) {
            // Do Firebase Operations
            await setFirestoreDocument(db, collection_user_owned_token, safeAddress(data.account), data.payload, { merge: true })
        }

    } catch (error: any) {

    }
}


async function sendOpenAuctionTx(contracts: any, data: any) {
    try {
        const { contract_address, serial_no, start_time, end_time, quotes } = data
        console.log("sendOpenAuctionTx", data, contracts.NFT_MARKETPLACE_OPERATOR,)
        if (contracts.NFT_MARKETPLACE_OPERATOR) {
    
            const tx = await contracts.NFT_MARKETPLACE_OPERATOR.sellNFT(
                contract_address, serial_no/* , start_time, end_time, quotes     */
            )
        
            tx.wait()
            .then((resultTx: any) => {
                console.log(resultTx)
            })
            .catch(console.error)
            .finally()
        }
    } catch (error) {
        console.error(error)
    }
}

async function sendCloseAuctionTx(contracts: any, data: any) {
    try {
        const { contract_address, serial_no } = data
        console.log("sendOpenAuctionTx", data, contracts.NFT_MARKETPLACE_OPERATOR,)
        if (contracts.NFT_MARKETPLACE_OPERATOR) {
    
            const tx = await contracts.NFT_MARKETPLACE_OPERATOR.cancelSellNFT(
                contract_address, serial_no/* , start_time, end_time, quotes     */
            )
        
            tx.wait()
            .then((resultTx: any) => {
                console.log(resultTx)
            })
            .catch(console.error)
            .finally()
        }
    } catch (error) {
        console.error(error)
    }
}