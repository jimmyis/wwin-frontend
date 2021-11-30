/* 
  Blockchain utility functions
*/

export function findMatchCurrency(contract_address: string) {
    const _contract_address = safeAddress(contract_address)
    const registry: { [index: string]: any } = {
        "0x0": {
            symbol: "BNB",
            contract_address: "0x0",
            decimals: 18
        },
        "0x1": {
            symbol: "WBNB",
            contract_address: "0x1",
            decimals: 18
        },
    }
    return registry[_contract_address] || null
}

export function safeAddress(address: string): string {
    return address.toLowerCase();
}

export function createQuotes(inputs: any) {
    return {
        [inputs.currencyInput.contract_address]: createQuote(inputs)
    };
}
export function createQuote(inputs: any) {
    const { priceInput, currencyInput } = inputs

    return {
        price: priceInput,
        currency: currencyInput.contract_address,
        symbol: currencyInput.symbol
    }
}

export function addressMask(account: string): string { return (account ? (account.substr(0, 6) + '...' + account.substr(account.length - 4, 4)) : 'Unknown') }
