import { isBrowser } from '@/libs/configs'
import { upperCase } from '@/utils'

((): void => {
  if (!isBrowser) return void 0

  Object.defineProperty(Array.prototype, 'findOne', {
    value: function (prop: string, value: any) {
      return [].concat(this)
        .find((a) => a[prop] === value)
    }
  })

  Object.defineProperty(Array.prototype, 'findAll', {
    value: function (prop: string, value: any) {
      return [].concat(this)
        .filter((a) => a[prop] === value)
    }
  })

  Object.defineProperty(Array.prototype, 'remove', {
    value: function (prop: string, value: any) {
      return [].concat(this)
        .filter((a) => a[prop] !== value)
    }
  })

  Object.defineProperty(Array.prototype, 'groupBy', {
    value: function (prop: string) {
      return [].concat(this)
        .reduce((previousValue: any, currentValue: never) => {
          previousValue[currentValue[prop]] = [
            ...(previousValue[currentValue[prop]] || []),
            currentValue
          ]
          
          return previousValue
        }, {})
    }
  })

  Object.defineProperty(Array.prototype, 'orderBy', {
    value: function (prop: string, type: string = 'asc') {
      return [].concat(this)
        .sort((a, b) => {
          let propA: any = a[prop]
          propA = typeof propA === 'string' ? upperCase(propA) : propA

          let propB: any = b[prop]
          propB = typeof propB === 'string' ? upperCase(propB) : propB

          return (type === 'desc')
            ? (propB < propA ? -1 : propB > propA ? 1 : propB >= propA ? 0 : NaN)
            : (propA < propB ? -1 : propA > propB ? 1 : propA >= propB ? 0 : NaN)
        })
    }
  })

})()
