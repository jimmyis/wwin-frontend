import { IPaginate, SelectOption, WalletConnectors } from '@/types'
import { Connectors, Network } from '@/types/constants'

export * from './_db'

export const defaultPaginate: IPaginate = {
  docs: [],
  totalDocs: 0,
  limit: 12,
  totalPages: 1,
  page: 1,
  pagingCounter: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null
}

export const fruit: SelectOption[] = [
  { label: '🍇  Grapes', value: 'grapes' },
  { label: '🍈  Melon', value: 'melon' },
  { label: '🍉  Watermelon', value: 'watermelon' },
  { label: '🍊  Tangerine', value: 'tangerine' },
  { label: '🍋  Lemon', value: 'lemon' },
  { label: '🍌  Banana', value: 'banana' },
  { label: '🍍  Pineapple', value: 'pineapple' },
  { label: '🍎  Apple', value: 'apple' },
  { label: '🍏  Green apple', value: 'green apple' },
  { label: '🍐  Pear', value: 'pear' },
  { label: '🍑  Peach', value: 'peach' },
  { label: '🍒  Cherries', value: 'cherries' },
  { label: '🍓  Strawberry', value: 'strawberry' },
  { label: '🍅  Tomato', value: 'tomato' },
  { label: '🥥  Coconut', value: 'coconut' }
]

export const rpcs: { [network in Network]: string[] } = {
  [Network.Main]: [
    'https://bsc-dataseed.binance.org',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.ninicoin.io'
  ],
  [Network.Test]: [
    'https://data-seed-prebsc-1-s1.binance.org:8545',
    'https://data-seed-prebsc-2-s1.binance.org:8545',
    'https://data-seed-prebsc-1-s2.binance.org:8545',
    'https://data-seed-prebsc-2-s2.binance.org:8545',
    'https://data-seed-prebsc-1-s3.binance.org:8545',
    'https://data-seed-prebsc-2-s3.binance.org:8545'
  ]
}

export const walletConnectors: WalletConnectors[] = [
  {
    id: 1,
    name: 'metamask',
    icon: '/static/images/metamask.png',
    connector: Connectors.Injected
  }
  // {
  //   id: 2,
  //   name: 'wallet connect',
  //   icon: '/static/images/walletconnect.png',
  //   connector: Connectors.WalletConnect
  // }
]
