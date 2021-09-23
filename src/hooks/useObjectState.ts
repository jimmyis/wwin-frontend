import { useState, useMemo } from 'react'

export interface IState {
  [key: string]: any
}

export function useObjectState<T = IState>(input: T) {
  // __STATE <React.Hooks>
  const [state, setState] = useState<T>(input)
  const memo = useMemo(() => input, [])

  // __FUNCTIONS
  const setStateByField = (field: keyof T, value: any): void => {
    const _state = { ...state, [field]: value }
    setState(_state)
  }

  const reset = (): void => {
    setState(memo)
  }

  return {
    state,
    setState,
    setStateByField,
    reset
  }
}
