import Web3 from 'web3'
import { provider as Provider } from 'web3-core'
import { Eth } from 'web3-eth'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import { parseUnits } from 'ethers/lib/utils'
import { chain, tokens, isBrowser } from '@/libs/configs'
import { rpcs } from '@/store/state'
import { dialog, upperCase } from '@/utils'

export { default } from 'web3'
export * from 'web3-core'
export * from 'web3-eth'
export * from 'web3-eth-contract'
export * from 'web3-utils'
import BigNumber from 'bignumber.js'

export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)

export function bigNumber(n: BigNumber.Value): BigNumber {
  return new BigNumber(n)
}

export function toUint256(n: BigNumber.Value) {
  return new BigNumber(n).times(BIG_TEN.pow(18))
}

export function ContractFactory(contractAbi: AbiItem | AbiItem[], contractAddress: string): Contract {
  if (!isBrowser) throw new Error('Contract Factory is not support on SSR.')

  const provider: Provider = GivenProvider()
  const { eth } = new Web3(provider)
  const address = contractAddress

  return new eth.Contract(contractAbi, address)
}

export function GivenProvider() {
  const provider = Web3.givenProvider
  if (!provider) {
    throw new Error('Could not connect to provider!')
  }

  return provider
}

export function getEtherProvider(): Eth | void {
  const { givenProvider } = Web3

  if (!givenProvider) {
    dialog('Please install MetaMask first.')
    return void 0
  }

  const { eth } = new Web3(givenProvider)

  return eth
}

// To be removed
export function getRpcUrl(): string {
  if (process.browser) {
    const rpc = (rpcs as any)[(window as any).ethereum]
    const idx = Math.floor(Math.random() * rpc.length)
    return rpc[idx]
  }
  return ""
}

// To be removed
export function getToken(symbol: string) {
  const token = tokens.findOne('symbol', upperCase(symbol))

  if (!token) return void 0
  return {
    ...token,
    address: (token.address as any)[chain.chainId]
  }
}

/**
 * GET signature token.
 *
 * @param {string} dataToSign Message
 * @param {string} address Wallet Address
 */
export async function getSignature(dataToSign: string, address?: string): Promise<any> {
  const ether = getEtherProvider()
  if (ether) {
    const { personal, getAccounts } = ether

    if (!address) {
      address = await getAccounts().then((r) => r[0])
    }

    try {
      const signature = await personal.sign(dataToSign, address!, '')
      return signature
    } catch (err: any) {
      return {
        code: err.code,
        message: err.message
      }
    }
  }

  return void 0
}

export async function getGasPrice() {
  const ether = getEtherProvider()
  if (ether) {
    const blockNumber = await ether.getBlockNumber()
    const { gasLimit, gasUsed } = await ether.getBlock(blockNumber)
    return { gasLimit, gasUsed }
  }

  return void 0
}

export enum GAS_PRICE {
  default = '5',
  fast = '6',
  instant = '7',
  testnet = '10'
}

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.default, 'gwei').toString(),
  fast: parseUnits(GAS_PRICE.fast, 'gwei').toString(),
  instant: parseUnits(GAS_PRICE.instant, 'gwei').toString(),
  testnet: parseUnits(GAS_PRICE.testnet, 'gwei').toString()
}
