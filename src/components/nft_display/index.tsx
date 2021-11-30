import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@web3-react/core'
import { MediaComponent } from '@/components'
import { useModal } from '@/hooks'
import { NFTItem } from '@/types'
import { useDB, useContract } from '@/hooks'
import { safeAddress, findMatchCurrency, createQuotes, hotContractSelector } from '@/utils/blockchain'
import { getFirestoreDocument, setFirestoreDocument, updateFirestoreDocument } from "@/functions/firestore"
import { errorIdentifier } from '@/utils/error'
import { DatePicker } from "antd";
import { CountdownTimerDisplay } from '@/components'

export interface Props {
    data: NFTItem
    handlers?: any
}

export function NFTitemDisplay({ data, handlers }: Props) {
    console.log("NFTitemDisplay", data)

    // __RENDER
    return (
        <article className='ui--article'>
            <div className='ui--article-head'>
                <MediaComponent media={data.image} />
            </div>
            <div className="">
                {data.name}
                <div>No. {data.serial_no}</div>
                <div>{data.sell_type}</div>
            </div>
            <div className='ui--article-body'>
            </div>
            <NFTActionsDisplay data={data} handlers={handlers} />
        </article>
    )
}

export function NFTActionsDisplay({ data, handlers }: Props) {
    const { onModalActive, onModalClose } = useModal(null, 'Open Auction')
    const { account } = useWeb3React()
    const { current_market_session } = data

    function handleOpenAuctionSetupPanel(data: any) {
        handlers.updateSingleNFTData(data._id, account).then().catch();

        onModalActive(<AuctionSetupPanel {
            ...{ data, 
                handlers: { 
                    ...handlers, 
                    handleCloseAuctionSetupPanel
                }
            }
        }/>)
    }

    function handleCloseAuctionSetupPanel() {
        onModalClose()
        handlers.loadingScreenOff()
    }

    return (
        <div className="ui--nft-actions">
            <button className='btn action-button btn-overlay btn-dark btn-connect' onClick={(() => { handleOpenAuctionSetupPanel(data) })}>
                {/* <span className='icon bi bi-gear'></span> */}
                {
                    current_market_session > 0 ? (
                        <span className='text'>Manage Sell</span>
                        ) : (
                        <span className='text'>Setup Sell</span>
                    )
                }
            </button>
        </div>
    )
}



export function AuctionSetupPanel(props: Props) {

    const { data, handlers: parentHandlers } = props;
    const router = useRouter()
    const { account } = useWeb3React()
    const { db } = useDB()
    const { contracts } = useContract()

    // console.log("Contracts", contracts)

    const [ priceInput, setPriceInput ] = useState("0")
    const [ currencyInput, setCurrencyInput ] = useState(findMatchCurrency("0x00534008ca8b5fa3c2e459e24d77aae95671ab9b"))
    const [ loadingScreen, setLoadingScreen ] = useState(false)
    const [ sellEndTime, setSellEndTime ] = useState(data?.sell_time ? data?.sell_time.end : 0)
    // const [ quotes, setQuotes ] = useState({})
    const NFTApprovalState = useState(false)

    useEffect(() => {
       (async () => {
           if (account && contracts.NFT_MARKETPLACE_AGENCY) {
               checkERC721Approval(account, data.contract_address, contracts?.NFT_MARKETPLACE_AGENCY, NFTApprovalState).then().catch()
           }
       })()
    }, [account, contracts.NFT_MARKETPLACE_AGENCY])


    const checkERC721Approval = async (owner: string, erc721_address: string, agency_contract: any, approvalState: any) => {
        const [isApprove, setIsApprove] = approvalState;

        if (isApprove) { return }
        const _contractInstance = await hotContractSelector(db, null, erc721_address, "ERC721")
        // console.log("checkERC721Approval", _contractInstance, owner, agency_contract);
        const _approvalState = await _contractInstance.isApprovedForAll(owner, agency_contract?.address)
        // console.log("checkERC721Approval :result", _approvalState)
        setIsApprove(_approvalState)

    }

    async function handleNFTApproval(db: any, approvalState: any) {
        if (contracts?.NFT_MARKETPLACE_AGENCY) {
            const [, setApprovalState] = approvalState;

            const _contractInstance = await hotContractSelector(db, null, data.contract_address, "ERC721")
            const tx = await _contractInstance.setApprovalForAll(contracts?.NFT_MARKETPLACE_AGENCY.address, true);
            await tx.wait()
            setApprovalState(true)
        }
    }

    function handlePriceInputChange(event: any) {
        const { value } = event.target
        setPriceInput(value)
    }

    function handleCurrencyChange(event: any) {
        const { value } = event.target
        console.log(value)
        const currencyInput_ = findMatchCurrency(value)
        if (currencyInput_) {
            setCurrencyInput(currencyInput_)
        } else {
            // TODO: Handle Error UI
        }
    }

    function handleClearInputStates() {
        setPriceInput("0")
        setCurrencyInput("0x0")
    }

    function handleSetSellEndTime(time: any) {
        // console.log("handleSetSellEndTime", data)
        setSellEndTime(time)
    }

    function handleTimePassed(params: any) {
        console.log("handleTimePassed", params)
        // Re-render on time passed
        // if (params.completed) {
        //     setIsUpdate(true);
        //     setTimeout(() => setIsUpdate(false), 3000);
        // }
    }

    function loadingScreenOn() {
        parentHandlers.loadingScreenOn()
        setLoadingScreen(true)
        console.log("AuctionSetupPanel loading on")
    }

    function loadingScreenOff() {
        parentHandlers.loadingScreenOff()
        setLoadingScreen(false)
        console.log("AuctionSetupPanel loading off")
    }

    const handlers = {
        ...parentHandlers,
        handleClearInputStates,
        handleSetSellEndTime,
        loadingScreenOn,
        loadingScreenOff,
    }

    return (<div>
        {
            loadingScreen && (<div className="_on-loading"></div>)
        }
        {
            NFTApprovalState[0]
            ? (<div>
                {data?.status === "selling"
                    ? (<div>
                        {data?.sell_type === "auction"
                            ? (<div>
                                <div className={`timer ${sellEndTime * 1000 > new Date().getTime() ? "_active" : ""}`}>
                                    <CountdownTimerDisplay epoch={sellEndTime} type="ending" handlers={{ handleTimePassed }} />
                                </div> 

                                <button className='btn action-button btn-overlay btn-dark btn-connect'
                                    onClick={(() => { router.push(`/marketplace/item/${data?.marketplace_item_id}`) })}>
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
                                <select className="_selectbox" value={currencyInput.contract_address} onChange={handleCurrencyChange}>
                                    <option value="0x0">BNB</option>
                                    <option value="0x00534008ca8b5fa3c2e459e24d77aae95671ab9b">SAMPLE20</option>
                                </select>
                            </div>
                            <div className="divider-clear" />
                            <span className="_label">Set Auction Ending Time</span>
                            <div className="_inputs">
                                <Datepicker {...{ handlers, type: "end" }}/>
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
                                                    committer: safeAddress(account),
                                                    priceInput,
                                                    currencyInput,
                                                    timeInput: {
                                                        end: sellEndTime
                                                    }
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
            </div>) : (<div>
                <button className='btn action-button btn-dark btn-connect' onClick={() => { handleNFTApproval(db, NFTApprovalState) }}>
                    <span className='icon bi bi-bag'></span>
                    <span className='text'>Approve to Sell</span>
                </button>
            </div>)
        }

    </div>)
}

export function Datepicker({ handlers, type }: any) {
  
    function onChange(date: any, /* dateString: any */) {
        const time_ = date ? date.unix() : 0
        handlers.handleSetSellEndTime(time_);
    }
  
    return <div className="date-picker"><DatePicker showTime showNow={type !== "end" || false} onChange={onChange} /></div>;
}

export function toEPOCH(time: number): number {
    return Math.round(time / 1000)
}

function startAuction(db: any, contracts: any, data: any, handlers: any) {
    console.log("Start Auction")
    const { account, inputs } = data;
    const contract_address = safeAddress(data.contract_address)
    const sell_type = "auction"
    const marketplace_item_id = data.contract_address + "__" + data.serial_no || null
    const quotes = createQuotes(inputs)
    const timestamp = toEPOCH(new Date().getTime())

    const sell_time = {
        timestamp,
        start: timestamp,
        ...data.inputs.timeInput
    }
    
    handlers.loadingScreenOn()
    return commitStartAuctionData(db, contracts, {
        ...data,
        timestamp,
        contract_address,
        marketplace_item_id,
        sell_type,
        sell_time,
        quotes
    })
        .then(() => {
            return handlers.updateSingleNFTData(contract_address, account).then().catch()
        })
        .then(() => {
            handlers.handleClearInputStates()
        })
        .catch((error: any) => {
            console.error(error)
        })
        .finally(() => {
            // Update UI
            handlers.loadingScreenOff()
            handlers.handleCloseAuctionSetupPanel()
        })
}

function cancelAuction(db: any, contracts: any, data: any, handlers: any) {
    console.log("Cancel Auction")
    const { account } = data
    const contract_address = safeAddress(data.contract_address)
    const sell_type = "auction"
    const marketplace_item_id = data.contract_address + "__" + data.serial_no || null
    handlers.loadingScreenOn()

    return commitCancelAuctionData(db, contracts, {
        ...data,
        contract_address,
        marketplace_item_id,
        sell_type
    })
        .then(() => {
            return handlers.updateSingleNFTData(contract_address, account).then().catch()
        })
        .catch((error: any) => console.error(error))
        .finally(() => {
            // Update UI
            handlers.loadingScreenOff()
            handlers.handleCloseAuctionSetupPanel()
        })
}

async function commitStartAuctionData(db: any, contracts: any, data: any) {
    try {
        const { quotes, timestamp, sell_time } = data;
        console.log("commitStartAuctionData", data);

        // const current_market_session = timestamp
        // Create a transaction with MetaMask
        const tx_result = await sendOpenAuctionTx(contracts, data)
        console.log("Transaction Result", tx_result);

        if (tx_result.success) {
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
                                tx_hash: safeAddress(tx_result.result.transactionHash),
                                timestamp,
                                creator: safeAddress(data.account),
                                sell_type: data.sell_type,
                                sell_time,
                            }),
                            current_market_session_active: true,
                        },
                        marketplace_session: {
                            _id: safeAddress(data.marketplace_item_id + "@" + timestamp),
                            timestamp,
                            sell_time,
                            status: "active",
                            participants: [],
                            quotes,
                            tx_hash: safeAddress(tx_result.result.transactionHash),
                            contracts: tx_result.contracts
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
                                    sell_time,
                                    marketplace_item_id: data.marketplace_item_id,
                                    current_market_session: timestamp
                                }
                            }
                        }
                    }
                }
            )
        }

    } catch (error) {
        console.error(error)
    }
}

async function commitCancelAuctionData(db: any, contracts: any, data: any) {
    try {
        // Create a transaction with MetaMask

        const contracts_ = {
            NFT_MARKETPLACE_AGENCY: await hotContractSelector(db, contracts.NFT_MARKETPLACE_AGENCY, data?.marketplace_session?.contracts?.agency),
            NFT_MARKETPLACE_OPERATOR: await hotContractSelector(db, contracts.NFT_MARKETPLACE_OPERATOR, data?.marketplace_session?.contracts?.operator),
        }

        const tx_result = await sendCloseAuctionTx(contracts_, data)
        console.log("Transaction Result", tx_result);

        if (tx_result.success) {
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
                                    sell_time: null,
                                    marketplace_item_id: null,
                                    current_market_session: -1
                                }
                            }
                        }
                    }
                }
            )
        }

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
            
            // Update the item
            await setFirestoreDocument(db, collection_nft_marketplace_items, (safeAddress(data.marketplace_item_id) as string ), data.payload.marketplace_item, { merge: true })
            
            // Update the index list
            await updateFirestoreDocument(db, collection_nft_marketplace_lists, "auction:recent", {
                list: arrayUnion(data.marketplace_item_id)
            })

            // Add the session
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

            const { result: item_data } = await getFirestoreDocument(db, collection_nft_marketplace_items, (safeAddress(data.marketplace_item_id) as string ))
            const { current_market_session } = item_data

            // Update the item
            await updateFirestoreDocument(db, collection_nft_marketplace_items, (safeAddress(data.marketplace_item_id) as string ),
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
            await updateFirestoreDocument(db, collection_nft_marketplace_sessions, (safeAddress(data.marketplace_item_id + "@" + current_market_session) as string),
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
            await setFirestoreDocument(db, collection_user_owned_token, (safeAddress(data.account) as string), data.payload, { merge: true })
        }

    } catch (error: any) {

    }
}


async function sendOpenAuctionTx(contracts: any, data: any) {
    const NFT_MARKETPLACE_AGENCY = contracts.NFT_MARKETPLACE_AGENCY
    const NFT_MARKETPLACE_OPERATOR = contracts.NFT_MARKETPLACE_OPERATOR
    const contracts_ = { operator: safeAddress(NFT_MARKETPLACE_OPERATOR.address), agency: safeAddress(NFT_MARKETPLACE_AGENCY.address) }

    try {
        const { contract_address, serial_no, sell_type, sell_time, quotes: _quotes, note = "" } = data
        const prices = Object.keys(_quotes).map((key: string) => _quotes[key])
        console.log("sendOpenAuctionTx", data, contracts_, prices, sell_type, _quotes, prices)

        if (NFT_MARKETPLACE_OPERATOR) {
    
            const tx = await NFT_MARKETPLACE_OPERATOR.sellNFT(
                NFT_MARKETPLACE_AGENCY.address,
                contract_address,
                serial_no,
                sell_type,
                prices,
                sell_time,
                note
                /* , start_time, end_time, quotes     */
            )

            return tx.wait()
            .then((resultTx: any) => {
                return { success: true, result: resultTx, contracts: contracts_, error: null }
            })
            .catch((error: any) => {
                return { success: false, type: "TRANSACTION ERROR", result: null, error }
            })
            .finally()
        }
    } catch (error: any) {
        const { type, error_codes } = errorIdentifier(error);
        
        return { success: false, type, error_codes, error, result: null }
    }
}

async function sendCloseAuctionTx(contracts: any, data: any) {
    const { NFT_MARKETPLACE_AGENCY, NFT_MARKETPLACE_OPERATOR } = contracts
    console.log("sendCloseAuctionTx", data, contracts)
    
    const contracts_ = { operator: safeAddress(NFT_MARKETPLACE_OPERATOR.address) , agency: safeAddress(NFT_MARKETPLACE_AGENCY.address) }
    
    try {
        const { contract_address, serial_no, note = "" } = data
        console.log("sendCloseAuctionTx", data, contracts_)
        
        if (NFT_MARKETPLACE_OPERATOR) {
    
            const tx = await NFT_MARKETPLACE_OPERATOR.cancelSellNFT(
                NFT_MARKETPLACE_AGENCY.address,
                contract_address, serial_no, note/* , start_time, end_time, quotes     */
            )
        
            return tx.wait()
            .then((resultTx: any) => {
                return { success: true, result: resultTx, contracts: contracts_, error: null }
            })
            .catch((error: any) => {
                return { success: false, type: "TRANSACTION ERROR", result: null, error }
            })
            .finally()
        }
    } catch (error: any) {
        const { type, error_codes } = errorIdentifier(error);
        
        return { success: false, type, error_codes, error, result: null }
    }
}



