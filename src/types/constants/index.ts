export * from './asset'

export enum BSChain {
  Mainnet = 56,
  Testnet = 97
}

export enum Network {
  Main = 'mainnet',
  Test = 'testnet'
}

export enum Connectors {
  Injected = 'injected',
  BSC = 'bsc'
}

export enum Role {
  User = 'user',
  Admon = 'admin',
  Owner = 'owner'
}
