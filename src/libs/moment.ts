import { MomentInput } from 'moment'
import moment from 'moment-timezone'

moment.tz.setDefault('Asia/Bangkok')

export default moment

/**
 * Convert date format.
 *
 * @param {MomentInput} input
 * @param {string} format
 */
export function setFormat(input: MomentInput, format: string = 'll'): string {
  return moment(input).format(format)
}

/**
 * Check date id expired.
 *
 * @param {MomentInput} input
 * @param {string} format
 */
export function isExpired(input: MomentInput, format: string = 'YYYY-MM-DD'): number {
  const exp = moment(input).format(format)
  const now = moment().format(format)
  return moment(exp).diff(now, 'days')
}
