import { dispatch, coreActions } from '@/store'
import { DialogOptions, DialogResults } from '@/types'

/**
 * Loader.
 *
 * @param {string} visible
 * @param {string} text
 */
export function loader(visible: 'on' | 'off' = 'on', text?: string): void {
  const action = coreActions.setLoader({
    visible: visible === 'on',
    text: text || 'loading...'
  })

  dispatch(action)
}

/**
 * Alert box.
 *
 * @param {object | string} options
 */
export function dialog(options: DialogOptions | string): Promise<DialogResults> {
  return new Promise((resolve, reject) => {
    let payload: any = {
      visible: true,
      resolvePromise: resolve,
      rejectPromise: reject
    }

    if (typeof options === 'string') {
      payload.message = options
    } else {
      payload = { ...payload, ...options }
    }

    const action = coreActions.setDialog(payload)
    dispatch(action)
    loader('off')
  })
}

/**
 * SET close modal.
 */
export function xModal(): void {
  const data: any = { visible: false }

  dispatch(coreActions.setModals(data))
}

/**
 * Convert address to short string.
 *
 * @param {string} address
 */
export function getShortAddress(address?: string | null): string {
  if (address) {
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
  } else {
    return '...'
  }
}

/**
 * Axios response auditor.
 *
 * @param {object} payload
 */
export async function resAudit<Data = any>(payload: any): Promise<Data | void> {
  if (payload instanceof Error) {
    dialog({
      title: 'XHR Error.',
      message: `<p>Something was wrong!</p><small>${payload.message}.</small>`
    })

    return void 0
  }

  if (payload.isAxiosError) {
    const { status, statusText } = payload.response

    dialog({
      title: 'XHR Error.',
      message: `<p>Something was wrong!</p><small>${status} ${statusText}.</small>`
    })

    return void 0
  } else {
    return payload.data
  }
}
