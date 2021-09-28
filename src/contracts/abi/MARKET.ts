import { chain } from '@/libs/configs'
import { AbiItem } from '@/libs/web3'
import { Network } from '@/types/constants'

export const ContractName: string = 'MarketPlace'

export const ContractAddress: string = {
  [Network.Main]: '0x84cad6549B3B97748DB6802F4AA0c6F41Dd4d408',
  [Network.Test]: '0x8efB2A4C9Da79bC17e7bc47F382Fe538e5b5202A'
}[chain.network]!

export const ContractAbi: AbiItem[] = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'address', name: '_NFTAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' }
    ],
    name: 'buy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_NFTAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' }
    ],
    name: 'buyWithBNB',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_NFTAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' }
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_NFTAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' }
    ],
    name: 'getItem',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'ownerAddress', type: 'address' },
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
          { internalType: 'address', name: 'NFTAddress', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'uint256', name: 'price', type: 'uint256' }
        ],
        internalType: 'struct MarketPlace.Item',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '_NFTAddress', type: 'address' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' }
    ],
    name: 'getKey',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'bytes', name: '', type: 'bytes' }
    ],
    name: 'onERC721Received',
    outputs: [{ internalType: 'bytes4', name: '', type: 'bytes4' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'ownerAddress', type: 'address' },
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
          { internalType: 'address', name: 'NFTAddress', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'uint256', name: 'price', type: 'uint256' }
        ],
        internalType: 'struct MarketPlace.Item[]',
        name: '_sellItems',
        type: 'tuple[]'
      }
    ],
    name: 'sell',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'ownerAddress', type: 'address' },
          { internalType: 'address', name: 'tokenAddress', type: 'address' },
          { internalType: 'address', name: 'NFTAddress', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'uint256', name: 'price', type: 'uint256' }
        ],
        internalType: 'struct MarketPlace.Item',
        name: '_sellItem',
        type: 'tuple'
      }
    ],
    name: 'sellItem',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address payable', name: '_wallet', type: 'address' }],
    name: 'setWallet',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
