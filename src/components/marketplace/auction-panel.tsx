import { useState, useEffect, useCallback } from 'react'
import { ethers/* , Contract */ } from "ethers"

import { CurrencyComponent } from '@/components'
import { useAuth } from '@/hooks'
import { chain } from '@/libs/configs'

import { getShortAddress } from '@/utils'
import { Connectors } from '@/types/constants'
import { useWeb3React } from '@web3-react/core'
import { useDB, useContract } from "@/hooks"

import { doc, /* getDoc, */ onSnapshot, arrayUnion } from "firebase/firestore"
import { safeAddress, findMatchCurrency, createQuote, addressMask, hotContractSelector } from '@/utils/blockchain'

import { updateFirestoreDocument, loadSingleMarketplaceSessionData } from "@/functions/firestore"
import { errorIdentifier } from '@/utils/error'
import { completeAuctionSales } from '@/functions/firestore/auction-logics'
import { dev } from '@/utils/dev'
import { CountdownTimerDisplay } from '@/components'


/* 
 / Sequences
 / Approve Auction Operator Contract for ERC20 then it can be use to pay
 / Button and Input for add bid
*/
export function AuctionPanelComponent({ data, handlers: parentHandlers }: any) {
    // __STATE <React.Hooks>
    dev.log("AuctionPanelComponent", data )
    const { marketplace_item_id, nft_marketplace_item, serial_no/*  ,contract_address */ } = data
    const { current_market_session, current_market_session_active } = nft_marketplace_item

    
    const { signin } = useAuth()
    const { db } = useDB()
    const { contracts } = useContract()
    const { account, chainId } = useWeb3React();

    const currencyApprovalState = useState(true)

    const [ priceInput, setPriceInput ] = useState("0")
    const [ currencyInput, setCurrencyInput ] = useState(findMatchCurrency("0x0"))
    const [ /* loading */, setLoading ] = useState(true)
    const [ session, setSession ] = useState<any>(null)
    const [ quotes, setQuotes ] = useState<any[]>([])
    const [ sellEndTime, /* setSellEndTime */ ] = useState(data?.nft_marketplace_session?.sell_time ? data?.nft_marketplace_session?.sell_time?.end : 0)

    const [ isAvailableToBuy, setIsAvailableToBuy ] = useState(true)
    // const [ NFTOwner, setNFTOwner ] = useState("")

    // Get data and subscribe to data changing
    useEffect(() => {
        setLoading(true);
        let unsubscribe = () => {};
    
        
        const current_market_session_id = marketplace_item_id + "@" + current_market_session
        if (db && current_market_session_active) {
          (async () => {
            if (current_market_session) {
                const data_ = await loadSingleMarketplaceSessionData(db, current_market_session_id)
                if (data_) {
                    data_.participants = data_?.participants?.reverse()
                    const quotes_ = data_?.quotes ? Object.keys(data_?.quotes).map((key: string) => data_?.quotes[key]) : []
                    setSession(data_)
                    setQuotes(quotes_)

                    const minSuggestPrice = (parseInt(data_?.participants[0]?.quote.amount || quotes_[0]?.amount) + 1).toString()
                    setPriceInput(minSuggestPrice)
                    const currencyInput_ = findMatchCurrency(quotes_[0]?.currency_address)
                    if (currencyInput_) {
                        setCurrencyInput(currencyInput_)
                    }
                }
            }
            setLoading(false);
          })();
      
          const marketplaceSessionDocRef = doc(db, "nft_marketplace:sessions", current_market_session_id);
          unsubscribe = onSnapshot(marketplaceSessionDocRef, 
            { includeMetadataChanges: true },
            (doc: any) => {
                const data_ = doc.data()
                if (data_) {
                    data_.participants = data_?.participants?.reverse()
                    const quotes_ = data_?.quotes ? Object.keys(data_?.quotes).map((key: string) => data_?.quotes[key]) : []
                    setSession(data_)
                    setQuotes(quotes_)

                    const minSuggestPrice = (parseInt(data_?.participants[0]?.quote.amount || quotes_[0]?.amount) + 1).toString()
                    setPriceInput(minSuggestPrice)
                    const currencyInput_ = findMatchCurrency(quotes_[0]?.currency_address)
                    if (currencyInput_) {
                        setCurrencyInput(currencyInput_)
                    }
                }
            }
          );
        }
    
        return () => {
          setSession([])
          setLoading(false)
          unsubscribe()
        }
    }, [marketplace_item_id, account])

    // __EFFECTS <React.Hooks>
    useEffect(() => {
        if (typeof account === "string") {
            dev.log("Check ERC20 Approval ", data)
            checkERC20Approval(
                account, currencyInput.contract_address, data?.nft_marketplace_session?.contracts?.agency, currencyApprovalState
            )
            .then().catch()
        }

    }, [account, currencyInput.contract_address])

    useEffect(() => {
        (async() => {
            const _contractInstance = await hotContractSelector(db, null, data.tokenAddress, "ERC721")
            const _NFTOwner = _contractInstance?.ownerOf(data.serial_no)
            dev.log("NFT Owner", _NFTOwner)
        })()
    }, [data.tokenAddress])

    // __FUNCTIONS
    const handleSignin = useCallback(() => {
        signin(Connectors.Injected)
    }, [])

    console.log("Quotes", quotes);

    const checkERC20Approval = async (owner: string, erc20_address: string, spender: string, approvalState: any) => {
        const [, setIsCurrencyApproval] = approvalState;
        if (erc20_address === "0x0000000000000000000000000000000000000000") {
            return setIsCurrencyApproval(true)
        } 
        const _contractInstance = await hotContractSelector(db, null, currencyInput.contract_address, "ERC20")

        const amount = await _contractInstance.allowance(owner, spender)
        dev.log("checkERC20Approval", erc20_address, spender, amount, amount?.gt(0))
        if (amount?.gt(0)) { // Update Condition
            setIsCurrencyApproval(true)
        } else {
            setIsCurrencyApproval(false)
        }
    }
    const explorer = chain[chainId || 97].explorer

    function handlePlaceBid() {
        dev.log("handlePlaceBid", priceInput, currencyInput)
        if (account) {
            placeBid(db, contracts, { ...data, account: safeAddress(account), inputs: { committer: safeAddress(account), priceInput, currencyInput } }, handlers)
        }
    }

    function handleCloseSell() {
        if (account) {
            closeSell(db, contracts, 
            { ...data, account: safeAddress(account) }, 
            { ...handlers })
        }
    }

    
    async function handleCurrencyApprove(db: any, approvalState: any) {
        if (data.nft_marketplace_session.contracts.agency) {
            const [, setIsCurrencyApproval] = approvalState;

            const _contractInstance = await hotContractSelector(db, null, currencyInput.contract_address, "ERC20")
            const tx = await _contractInstance.approve(data.nft_marketplace_session.contracts.agency, ethers.utils.parseEther("999999999999999"));
            await tx.wait()
            setIsCurrencyApproval(true)
        }
    }

    function handlePriceInputChange(event: any) {
        const { value } = event.target
        console.log(value);
        // TODO: Convert to be a valid value
        setPriceInput(value)
    }

    function handleCurrencyChange(event: any) {
        const { value } = event.target
        const currencyInput_ = findMatchCurrency(value)
        if (currencyInput_) {
            setCurrencyInput(currencyInput_)
        } else {
            // TODO: Handle Error UI
        }
        dev.log("handleCurrencyChange", currencyInput_)
    }

    function handleClearStates() {
        setPriceInput("0")
        setCurrencyInput("0x0")
    }

    function handleTimePassed(params: any) {
        console.log("handleTimePassed", params)
        // Re-render on time passed
        // if (params.completed) {
        //     setIsUpdate(true);
        //     setTimeout(() => setIsUpdate(false), 3000);
        // }
    }

    const handlers = {
        ...parentHandlers,
        handleClearStates
    }

    // __RENDER
    return (
        <div className='ui--assets-trade'>
            <div className='status-bar'>
                <div className='_left'>
                    <div className='status'>
                        <div className='columns owner'>
                            <span className='label'>Owned by</span>
                            <a className='btn btn-default' href={`${explorer}/address/${safeAddress(nft_marketplace_item?.current_owner)}`} target='_blank'>
                                {safeAddress(nft_marketplace_item?.current_owner) === safeAddress(account || "") ? 'You' : getShortAddress(safeAddress(nft_marketplace_item?.current_owner))}
                            </a>
                        </div>

                        <div className='columns supply'>
                            {/* <span className='icon bi bi-archive'></span> */}
                            <span className='text'>Token Id {serial_no}</span>
                        </div>
                    </div>

                </div>
                <div className='_right'>
                    { nft_marketplace_item?.current_market_session > 1 && (
                        <div className={`timer mini ${sellEndTime * 1000 > new Date().getTime() ? "_active" : ""}`}>
                            <CountdownTimerDisplay size="mini" epoch={sellEndTime} type="ending" handlers={{ handleTimePassed }} />
                        </div> 
                    )}
                </div>
            </div>

            <div className='actions-box actions'>
            { nft_marketplace_item?.current_market_session < 1 ? (<>
                <div className="_divider"></div>
                <div id="bids-box">
                    <div className="label">This NFT is currently not selling</div>
                    <div className="_entries">
                        {
                            session?.participants?.map((bid: any, index: number) => (
                                <div className="_entry" key={session._id + "/" + index}>
                                    <span className="_user">
                                        { addressMask(bid.user) }
                                    </span>
                                    <span className="_price">
                                        { bid.quote.amount }
                                    </span>
                                    <span className="_symbol">
                                        { bid.quote.symbol }
                                    </span>
                                    <span className="_timestamp">
                                        { bid.timestamp }
                                    </span>
                                    <a className="_tx_hash" target="_blank" href={`https://testnet.bscscan.com/tx/${bid.tx_hash}`}>BSC Scan</a>
                                </div>)
                            )
                        }
                    </div>
                </div>
            </>) : (<>
                {
                    session?.participants?.length > 0
                    ? (<>
                        <div className='label'>Latest Bids</div>
                        <CurrencyComponent currency={session?.current_participation?.quote.symbol} amount={session?.current_participation?.quote.amount} size='large'>
                            <small className='unit'>{ session?.current_participation?.quote.symbol }</small>
                        </CurrencyComponent>
        
                        <div className="_divider"></div>
                    </>) : (<>
                        <div className='label'>Minimum Bids</div>
                        <CurrencyComponent currency={quotes[0]?.symbol} amount={quotes[0]?.amount} size='large'>
                            <small className='unit'>{ quotes[0]?.symbol }</small>
                        </CurrencyComponent>
        
                        <div className="_divider"></div>
                    </>)
                }

                {account ? (
                    <div>
                        
                        { safeAddress(account) !== safeAddress(nft_marketplace_item?.current_owner)
                            ? (<div>
                                {
                                    isAvailableToBuy && 
                                    (
                                        <div id="auction-bid-input-panel">
                                            <div className="_inputs">
                                                <input type="number" className="_textinput" placeholder={(parseInt(session?.current_participation?.quote.amount || quotes[0]?.amount) + 1).toString()} onChange={ handlePriceInputChange }></input>
                                                <select className="_selectbox" value={currencyInput.contract_address} onChange={handleCurrencyChange}>
                                                    <option value={quotes[0]?.currency_address}>{ quotes[0]?.symbol }</option>
                                                </select>
                                            </div>
                                            { currencyApprovalState[0] ? (
                                                <div className="_actions">
                                                    <button
                                                        className='btn btn-dark btn-connect'
                                                        disabled={safeAddress(account) === safeAddress(session?.current_participation?.user) }
                                                        onClick={() => { handlePlaceBid() }}
                                                    >
                                                        <span className='icon bi bi-bag'></span>
                                                        <span className='text'>Place Bid</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className='btn btn-dark btn-connect' onClick={() => { handleCurrencyApprove(db, currencyApprovalState) }}>
                                                    <span className='icon bi bi-bag'></span>
                                                    <span className='text'>Approve to Buy</span>
                                                </button>
                                            )}
                                        </div>
                                    )
                                    
                                }
                                
                            </div>)
                            
                            : (<>{
                                // safeAddress(account) === safeAddress(NFTOwner) 
                                safeAddress(nft_marketplace_item?.current_owner) === safeAddress(account || "")
                                && (
                                    <div>
                                        {
                                            data?.nft_marketplace_session?.participants.length > 0 && (
                                                <div>
                                                    <button className='btn btn-dark btn-connect' onClick={() => { handleCloseSell() }}>
                                                        <span className='icon bi bi-bag'></span>
                                                        <span className='text'>Send NFT</span>
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </div>
                                    
                                )
                            }</>)
                        }
                    </div>
                ) : (
                    <button className='btn btn-dark btn-connect' onClick={handleSignin}>
                        <span className='icon bi bi-wallet2'></span>
                        <span className='text'>Connect Wallet</span>
                    </button>
                )}


                { nft_marketplace_item?.current_market_session > 1 && (<>
                    <div className="_divider"></div>
                    <div id="bids-box">
                        <div className="label">Bids</div>
                        <div className="_entries">
                            {
                                session?.participants?.map((bid: any, index: number) => (
                                    <div className="_entry" key={session._id + "/" + index}>
                                        <span className="_user">
                                            { addressMask(bid.user) }
                                        </span>
                                        <span className="_price">
                                            { bid.quote.amount }
                                        </span>
                                        <span className="_symbol">
                                            { bid.quote.symbol }
                                        </span>
                                        <span className="_timestamp">
                                            { bid.timestamp }
                                        </span>
                                        <a className="_tx_hash" target="_blank" href={`https://testnet.bscscan.com/tx/${bid.tx_hash}`}>BSC Scan</a>
                                    </div>)
                                )
                            }
                        </div>
                    </div>
                </>)}
            </>)}
            </div>
        </div>
    )
}

/* 

*/


function placeBid(db: any, contracts: any, data: any, handlers: any) {
    dev.log("Place Bid", handlers)
    const { inputs, marketplace_item_id } = data;
    const contract_address = safeAddress(data.contract_address)
    const sell_type = "auction"
    const quote = createQuote(inputs)

    commitBidData(db, contracts, {
        ...data,
        contract_address,
        marketplace_item_id,
        sell_type,
        quote
    })
        .then(() => {
            // return handlers.updateSingleNFTData(contract_address, account).then().catch()
        })
        .then(() => {
            // Update UI
            // handlers.handleClearStates()
            // handlers.handleCloseAuctionSetupPanel()

        })
        .catch((error: any) => {
            dev.error(error)
            // handlers.handleCloseAuctionSetupPanel()
        })
}

async function commitBidData(db: any, contracts: any, data: any) {
    try {
        const { quote, account } = data;
        const timestamp = new Date().getTime()
        dev.log("commitBidData", data);

        const marketplace_session_id = data.marketplace_item_id + "@" + data.nft_marketplace_item?.current_market_session

        // Create a transaction with MetaMask
        const tx_result = await sendBidTx(contracts, data)
        dev.log("Transaction Result", tx_result);

        if (tx_result.success) {
            // Update Off-chain Data
            const current_participation = {
                quote,
                user: account,
                timestamp,
                tx_hash: tx_result.result.transactionHash,
                block_hash: tx_result.result.blockHash,
                block_number: tx_result.result.blockNumber,
            }
            //
            await setNFTMarketplaceSessionData(db,
                {
                    ...data,
                    marketplace_session_id,
                    timestamp,
                    payload: {
                        marketplace_session: {
                            current_participation,
                            participants: arrayUnion(current_participation),
                        }
                    }
                }
            )
        }


    } catch (error) {
        dev.error(error)
    }
}



function closeSell(db: any, contracts: any, data: any, handlers: any) {
    dev.log("Close Sell", handlers)
    const { marketplace_item_id } = data;
    const contract_address = safeAddress(data.contract_address)
    const sell_type = "auction"

    commitCloseSellData(db, contracts, {
        ...data,
        contract_address,
        marketplace_item_id,
        sell_type,
    })
        .then(() => {
            handlers.handleReload().then().catch()
            // return handlers.updateSingleNFTData(contract_address, account).then().catch()
        })
        .then(() => {
            // Update UI
            // handlers.handleClearStates()
            // handlers.handleCloseAuctionSetupPanel()

        })
        .catch((error: any) => {
            dev.error(error)
            // handlers.handleCloseAuctionSetupPanel()
        })
}


async function commitCloseSellData(db: any, contracts: any, data: any) {
    dev.log(db);

    try {
        const { account, contract_address, serial_no, marketplace_item_id, marketplace_session_id } = data;
        // const timestamp = new Date().getTime()
        dev.log("commitCloseSellData", data);

        // Create a transaction with MetaMask
        const tx_result = await sendCloseSellTx(contracts, data)
        dev.log("Transaction Result", tx_result);

        if (tx_result.success) {
            // Update Off-chain Data
            const latest_quote_ = data?.nft_marketplace_session?.current_participation?.quote
            
            // Relocate user owned token
            await completeAuctionSales(db, {
                new_user_account: latest_quote_?.committer,
                account,
                contract_address,
                serial_no,
                marketplace_session_id,
                marketplace_item_id
            })
            // Mark NFT marketplace item
            // reset current market session
            // Update new value (latest price).
            // Remove from NFT marketplace list
            // 

        }


    } catch (error) {
        dev.error(error)
    }
}


async function setNFTMarketplaceSessionData(db: any, data: any) {
    try {
        // const collection_nft_marketplace_items = "nft_marketplace:items";
        // const collection_nft_marketplace_lists = "nft_marketplace:lists";
        const collection_nft_marketplace_sessions = "nft_marketplace:sessions";

        if (data.marketplace_session_id) {
            // await setFirestoreDocument(db, collection_nft_marketplace_items, safeAddress(data.marketplace_item_id), data.payload.marketplace_item, { merge: true })
            // await setFirestoreDocument(db, collection_nft_marketplace_lists, "auction:recent", {
            //     list: arrayUnion(data.marketplace_item_id)
            // })
            await updateFirestoreDocument(db, collection_nft_marketplace_sessions, data.marketplace_session_id, data.payload.marketplace_session)
        }

    } catch (error: any) {

    }
}

/* 
    TO BE REMOVED
*/


// function createContractInstance(_contract: { name?: string, symbol?: string, address: string, abi: any }) {
//     const contract = ({
//         ..._contract,
//         contract: null,
//         error: process.browser ? null : "Only supported on browser context"
//     } as any);

//     if (process.browser) {
//         if (!window.ethereum) { contract.error = "Web3 ethereum object not existed" }
//         else {
//             const { address, abi } = _contract
//             const provider = new ethers.providers.Web3Provider(window.ethereum)
//             provider.send("eth_requestAccounts", []).then((/* x: any */) => {
//                 const signer = provider.getSigner();
//                 contract.contract = new Contract(address, abi, signer);
//             })
//         }

//     }
//     return contract
// }


// function getERC20tokenContract(contract_config: ContractConfig, chainId: string | number) {
//     dev.log("getERC20tokenContract", contract_config)
//     const { name, symbol, address: _address } = contract_config
//     const address = _address[chainIdMatcher(chainId)]
//     const abi = ERC20.abi
//     return createContractInstance({ name, symbol, address, abi })
// }

// function chainIdMatcher(chainId: string | number) {
//     return chainId.toString()
// }

// function getNFTregistryContract() {
//     const name = "NFT Registry"
//     // const address = "0x262451c4BFf59747BbCFEb03c5490611BF9Ba635" // Testnet Old
//     const address = "0x7ca07b1bbe7e78949c3efeeb23f3429e4d3fa3cf" // Mainnet Current
//     const abi = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "erc20_address", "type": "address" }], "name": "getERC20token", "outputs": [{ "components": [{ "internalType": "address", "name": "contract_address", "type": "address" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "string", "name": "meta", "type": "string" }], "internalType": "struct I_NFT_Registry.ERC20Token", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc721_address", "type": "address" }], "name": "getERC721token", "outputs": [{ "components": [{ "internalType": "address", "name": "contract_address", "type": "address" }, { "internalType": "string", "name": "name", "type": "string" }, { "internalType": "uint256", "name": "max_supply", "type": "uint256" }, { "internalType": "uint256[]", "name": "max_supply_history", "type": "uint256[]" }, { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "payee", "type": "address" }, { "internalType": "bool", "name": "active", "type": "bool" }, { "internalType": "string", "name": "meta", "type": "string" }], "internalType": "struct I_NFT_Registry.ERC721Token", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc721_address", "type": "address" }, { "internalType": "address", "name": "erc20_address", "type": "address" }], "name": "getExchangeRateForNFTcollection", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc721_address", "type": "address" }, { "internalType": "uint256", "name": "serial_no", "type": "uint256" }, { "internalType": "address", "name": "erc20_address", "type": "address" }], "name": "getExchangeRateForSpecificNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc20_address", "type": "address" }], "name": "getMinimumExchangeRate", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc721_address", "type": "address" }, { "internalType": "uint256", "name": "serial_no", "type": "uint256" }], "name": "getNFTslotState", "outputs": [{ "components": [{ "internalType": "bool", "name": "exists", "type": "bool" }, { "internalType": "uint256", "name": "serial_no", "type": "uint256" }, { "internalType": "string", "name": "status", "type": "string" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "string", "name": "remark", "type": "string" }, { "internalType": "string", "name": "meta", "type": "string" }, { "internalType": "address", "name": "operator", "type": "address" }], "internalType": "struct I_NFT_Registry.SlotState", "name": "", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }]
//     return createContractInstance({ name, address, abi })
// }

// function getNFTswapContract() {
//     const name = "NFT Swap"
//     // const address = "0x262451c4BFf59747BbCFEb03c5490611BF9Ba635" // Testnet Old
//     // const address = "0xb163A78b8169B862D1111F3AcC3B3b169d36c23e" // Mainnet Current
//     const address = "0x19A330E00B1dedf395Cf22DA61949c330dD6d243" // Mainnet Current V0.2.1
//     const abi = [{ "inputs": [{ "internalType": "address", "name": "buyer", "type": "address", "indexed": true }, { "indexed": true, "internalType": "address", "name": "erc721_address", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "serial_no", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "erc20_address", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "NFTswap", "type": "event", "anonymous": false }, { "inputs": [], "name": "$nft_registry", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc721_address", "type": "address" }, { "internalType": "uint256", "name": "serial_no", "type": "uint256" }, { "internalType": "address", "name": "erc20_address", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "string", "name": "remark", "type": "string" }, { "internalType": "string", "name": "meta", "type": "string" }], "name": "swapNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "erc721_address", "type": "address" }, { "internalType": "uint256", "name": "serial_no", "type": "uint256" }, { "internalType": "string", "name": "remark", "type": "string" }, { "internalType": "string", "name": "meta", "type": "string" }], "name": "swapNFTbyNative", "outputs": [], "stateMutability": "payable", "type": "function" }]
//     return createContractInstance({ name, address, abi })
// }

// function getNFTContract(contract_config: ERC721ContractConfig) {
//     const { name, symbol, address } = contract_config
//     const abi = ERC721.abi
//     return createContractInstance({ name, symbol, address, abi })
// }


// // import { setDoc } from "firebase/firestore";

// async function getOneDoc(collection: string, id: string) {
//     const { db } = firebaseApp
//     const docRef = doc((db as any), collection, id);
//     const docSnap = await getDoc(docRef);
//     const data = docSnap.data();
//     return data as any
// }

// function shuffle(array: any[]) {
//     let currentIndex = array.length, randomIndex;

//     // While there remain elements to shuffle...
//     while (currentIndex != 0) {

//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex--;

//         // And swap it with the current element.
//         [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
//     }

//     return array;
// }

// const getNFTtokensAvailable = async (id: string) => {
//     const doc = await getOneDoc("nft_tokens_list:available", id);
//     dev.log(doc);
//     const { LIST, /* TESTLIST */ } = doc;

//     const availableList = shuffle([...new Set(LIST)])
//     return availableList
// }


async function sendBidTx(contracts: any, data: any) {
    const NFT_MARKETPLACE_AGENCY = contracts.NFT_MARKETPLACE_AGENCY
    const NFT_MARKETPLACE_OPERATOR = contracts.NFT_MARKETPLACE_OPERATOR
    const contracts_ = { operator: safeAddress(NFT_MARKETPLACE_OPERATOR.address), agency: safeAddress(NFT_MARKETPLACE_AGENCY.address) }
    const sell_type = "auction"

    try {
        const { contract_address, serial_no, /* start_time, end_time, */ quote, note = "" } = data
        // dev.log("sendOpenAuctionTx", data, contracts_)


        if (NFT_MARKETPLACE_OPERATOR) {
    
            const tx = await NFT_MARKETPLACE_OPERATOR.buyNFT(
                NFT_MARKETPLACE_AGENCY.address,
                contract_address,
                serial_no,
                sell_type,
                quote,
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

async function sendCloseSellTx(contracts: any, data: any) {
    const NFT_MARKETPLACE_AGENCY = contracts.NFT_MARKETPLACE_AGENCY
    const NFT_MARKETPLACE_OPERATOR = contracts.NFT_MARKETPLACE_OPERATOR
    const contracts_ = { operator: safeAddress(NFT_MARKETPLACE_OPERATOR.address), agency: safeAddress(NFT_MARKETPLACE_AGENCY.address) }


    try {
        const { contract_address, serial_no, /* start_time, end_time, */  note = "" } = data
        // dev.log("sendOpenAuctionTx", data, contracts_)

        if (NFT_MARKETPLACE_OPERATOR) {
    
            const tx = await NFT_MARKETPLACE_OPERATOR.closeSellNFT(
                NFT_MARKETPLACE_AGENCY.address,
                contract_address,
                serial_no,
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