import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import qs from 'qs'

export function useQueryString() {
  // __STATE <React.Hooks>
  const router = useRouter()
  const [query, setQuery] = useState<any>({})

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    const _qs = router.asPath.split('?')[1]
    if (_qs) {
      setQuery(qs.parse(_qs))
    } else {
      setQuery({})
    }
  }, [router.asPath])

  // __FUNCTIONS
  const handleQuery = useCallback(
    (pathName: string, value: any): void => {
      const _qs = qs.stringify({ ...query, ...value }, { arrayFormat: 'repeat' })
      if (_qs) {
        router.push(`${pathName}?${_qs}`)
      }
    },
    [query]
  )

  const handleReset = useCallback(() => {
    setQuery({})
    router.push(router.pathname)
  }, [])

  return [query, handleQuery, handleReset]
}
