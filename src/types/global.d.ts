declare interface Window<T = any> {
  web3?: any
  ethereum?: any
  BinanceChain?: any
}

declare interface Array<T = any> {
  findOne: (prop: string, value: string | number | boolean) => T
  findAll: (prop: string, value: string | number | boolean) => T[]
  remove: (prop: string, value: string | number | boolean) => T[]
  groupBy: (prop: string) => T
  orderBy: (prop: string, type?: string) => T[]
}

declare module 'antd'
declare module '*.json'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.webp'
