import { ethers, Contract } from 'ethers';

export const abis: { [chainId: number]: any } = {
    56: {
        "CHAIN_ID": 56
    },
    97: {
        "CHAIN_ID": 97,
        "NFT_MARKETPLACE_OPERATOR": [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[],"name":"NFT_BUY","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"address","name":"erc721_address","type":"address"},{"indexed":false,"internalType":"uint256","name":"serial_no","type":"uint256"},{"indexed":true,"internalType":"address","name":"erc20_address","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"NFT_SELL","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"$nft_registry","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"erc721_address","type":"address"},{"internalType":"uint256","name":"serial_no","type":"uint256"}],"name":"cancelSellNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"erc721_address","type":"address"},{"internalType":"uint256","name":"serial_no","type":"uint256"}],"name":"sellNFT","outputs":[],"stateMutability":"nonpayable","type":"function"}]
    }
}

export const contracts: { [chainId: number]: any } = {
    56: {
        "CHAIN_ID": 56
    },
    97: {
        "CHAIN_ID": 97,
        "NFT_MARKETPLACE_OPERATOR": "0x2eAee4692b854a3acc49d086E77c908E9A123aCd"
    }
}

export const contractInstance: { [chainId: number]: any } = {
    56: {
        "CHAIN_ID": 56
    },
    97: {
        "CHAIN_ID": 97
    }
}

let defaultContractSet = {}

export { defaultContractSet as default }

export function getContracts(chainId: number | undefined | null) {

    if (!chainId) { return {} }
    const ethereum = (window as any).ethereum

    if (!ethereum) { return {} }

    const provider = new ethers.providers.Web3Provider(ethereum)

    const contractSet = contracts[chainId] || {}
    const ABI = abis[chainId] || {}
    const _contractInstance = contractInstance[chainId] || {}

    if (contractSet) {
        for (let _key in contractSet) {
            // Check whether each contract was initiallized or not.
            if (!Object.prototype.hasOwnProperty.call(_contractInstance, _key) && _key !== chainId.toString()) {
                const _contract_address = contractSet[_key]
                const _ABI = ABI[_key]
                contractInstance[chainId][_key] = initializeContract(provider, _contract_address, _ABI)
                // console.log("Initialized Contract", _key, "chain", chainId, contractInstance[chainId][_key])
            }
        }
    }

    defaultContractSet = contractInstance[chainId]

    return defaultContractSet
}

export function initializeContract(
    $provider: any,
    contract_address: string,
    abi: any
) {
    const signer = $provider.getSigner()
    return new Contract(contract_address,
        abi,
        signer
    )
}
