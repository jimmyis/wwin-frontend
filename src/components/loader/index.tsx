import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, coreSelector } from '@/store'
import cls from 'classnames'

export function LoaderComponent() {
  // __STATE <React.Hooks>
  const elm = useRef(null)
  const [state, setState] = useState(false)
  const loader = useSelector(coreSelector.getLoader)

  // __EFFECTS <React.Hooks>
  useEffect(() => {
    if (loader.visible) {
      handleFocus()
      setState(loader.visible)
    } else {
      setTimeout(() => setState(false), 320)
    }
  }, [loader.visible])

  // __FUNCTIONS
  const handleFocus = useCallback((): void => {
    const el: any = elm.current
    if (el) el.focus()
  }, [elm])

  // __RENDER
  if (!state) return null
  return (
    <div className='ui--loader' ref={elm}>
      <div className={cls('ui--loader-progress', { done: !loader.visible })}></div>
    </div>
  )
}
