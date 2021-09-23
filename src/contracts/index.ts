import { bathContract as bath } from './bath.contract'
import { busdContract as busd } from './busd.contract'
import { wwinContract as wwin } from './wwin.contract'

export { bathContract } from './bath.contract'
export { busdContract } from './busd.contract'
export { marketContract } from './market.contract'
export { wwinContract } from './wwin.contract'

export function useBEP20Contract(symbol: string) {
  switch (symbol.toLowerCase()) {
    case 'busd':
      return busd

    case 'bath':
      return bath

    case 'wwin':
      return wwin

    default:
      return busd
  }
}
