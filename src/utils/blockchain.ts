import { ethers } from "ethers"
import { loadStoreContract } from "@/functions/firestore"
import { initializeContract } from "@/libs/contracts"
import { commonContractABIStore } from "@/libs/contracts"

/* 
  Blockchain utility functions
*/

export function findMatchCurrency(contract_address: string) {
    const _contract_address = safeAddress(contract_address)
    console.log("Find Match", _contract_address);
    const registry: { [index: string]: any } = {
        "0x0": {
            symbol: "BNB",
            contract_address: ethers.constants.AddressZero,
            decimals: 18
        },
        "0x00534008ca8b5fa3c2e459e24d77aae95671ab9b": {
            symbol: "SAMPLE20",
            contract_address: "0x00534008ca8b5fa3c2e459e24d77aae95671ab9b",
            decimals: 18
        },
        "0x1": {
            symbol: "WBNB",
            contract_address: "0x1",
            decimals: 18
        },
    }
    return _contract_address ? registry[_contract_address] : null
}

export function safeAddress(address: string | null | undefined): string | null {
    return typeof address === "string" ? address.toLowerCase() : null;
}

export function createQuotes(inputs: any) {
    return {
        [inputs.currencyInput.contract_address]: createQuote(inputs)
    };
}
export function createQuote(inputs: any) {
    const { priceInput, currencyInput, committer } = inputs

    return {
        amount: priceInput,
        currency_address: currencyInput.contract_address,
        symbol: currencyInput.symbol,
        committer,
        timestamp: 0
    }
}

export function addressMask(account: string): string { return (account ? (account.substr(0, 6) + '...' + account.substr(account.length - 4, 4)) : 'Unknown') }

export function transctionErrorGenerator(error: any) {
    let type = "TRANSACTION_ERROR"
    let error_codes = ["0000"]

    if (error?.data?.message === "execution reverted: ERC721: transfer caller is not owner nor approved") {
        error_codes = ["ERC_721_NOT_APPROVED", "ERC_721_NOT_OWNER"]
    }

    return { type, error_codes }
}

export async function hotContractSelector(
    db: any,
    default_initialized_contract: any,
    replacer_contract_address: string,
    common_contract_type?: string
) {
    console.log("hotContractSelector 1", replacer_contract_address, default_initialized_contract, safeAddress(default_initialized_contract?.address), safeAddress(replacer_contract_address))
    if (replacer_contract_address && safeAddress(default_initialized_contract?.address) !== safeAddress(replacer_contract_address)) {
        let _contract: any = { address: replacer_contract_address }
        if (common_contract_type) {
            _contract = { ..._contract, ...loadPreloadContract(common_contract_type) }
        } else {
            _contract = { ..._contract, ...await loadStoreContract(db, _contract.address) }
        }

        console.log("hotContractSelector 2", _contract)
        
        return initializeContract(_contract.address, JSON.parse(_contract.abi))
    }
    return default_initialized_contract
}

export function loadPreloadContract(common_contract_type: string) {
    const abi = commonContractABIStore[common_contract_type]
    return { abi }
}