export const configs = {
  APP_MODE: process.env.NODE_ENV,
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'project_wwin',
  APP_WEB_TITLE: process.env.NEXT_PUBLIC_APP_WEB_TITLE || "3W'WIN - NFTs Marketplace",
  APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3000',
  APP_CLIENT_SIDE: process.browser,

  // XMLHttpRequest (XHR)
  API_GATEWAY: process.env.NEXT_PUBLIC_API_GATEWAY || 'http://localhost:3000/api',
  API_SECRET_KEY: process.env.NEXT_PUBLIC_API_SECRET_KEY || '4d54',

  // Chain Network
  APP_CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '97', 10),

  // STORAGE KEY-NAME
  APP_AUTH: 'APP.PassportToken',
  CONNECTOR: 'APP.WalletConnector',
  USER_ADDRESS: 'APP.UserAddress',
  USER_INFO: 'APP.UserInfo',
  APP_LANG: 'APP.Language',
  APP_THEME: 'APP.Theme',

  // REQUEST HEADERS
  AUTH_TOKEN: 'Authorization',
  AUTH_ADDRESS: 'User-Address',
  CONTENT_LANG: 'Content-Language',
  XSRF_TOKEN: 'XSRF-TOKEN',
  X_CSRF_TOKEN: 'X-CSRF-TOKEN'
}

export const isBrowser: boolean = configs.APP_CLIENT_SIDE || typeof window !== 'undefined'
export const isDevelop: boolean = configs.APP_MODE === 'development'
export const isProduction: boolean = configs.APP_MODE === 'production'

export const chain = {
  56: {
    chainId: 56,
    network: 'mainnet',
    explorer: 'https://bscscan.com'
  },
  97: {
    chainId: 97,
    network: 'testnet',
    explorer: 'https://testnet.bscscan.com'
  }
}[configs.APP_CHAIN_ID]!

export const tokens = [
  {
    symbol: 'BNB',
    label: '',
    address: {
      56: '',
      97: ''
    },
    decimals: 18,
    projectLink: ''
  },
  {
    symbol: 'BUSD',
    label: '',
    address: {
      56: '',
      97: '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7'
    },
    decimals: 18,
    projectLink: ''
  },
  {
    symbol: 'BATH',
    label: '',
    address: {
      56: '',
      97: '0x9cc3908a1b38bd966ee9c3a2fbd96e1422ea2bd6'
    },
    decimals: 18,
    projectLink: ''
  },
  {
    symbol: 'wWIN',
    label: '',
    address: {
      56: '',
      97: '0xf5d693ce8515024aaf496cdf11bdb18ca843acee'
    },
    decimals: 18,
    projectLink: ''
  }
]
